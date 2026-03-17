import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { generateNotes } from "@/lib/openai";
import { checkRateLimit, incrementUsage } from "@/utils/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [
      { data: profile },
      { text, title }
    ] = await Promise.all([
      supabase.from("users").select("plan").eq("id", user.id).single(),
      req.json()
    ]);

    if (!text || text.trim().length < 10) {
      return NextResponse.json({ error: "Please provide at least 10 characters of study material." }, { status: 400 });
    }

    const plan = profile?.plan ?? "free";

    // Check text length limit for free users
    if (plan !== "premium" && text.length > 5000) {
      return NextResponse.json({ error: "Free plan is limited to 5,000 characters. Upgrade to Premium for unlimited length." }, { status: 403 });
    }

    // Check rate limit
    const rateCheck = await checkRateLimit(user.id, plan);
    if (!rateCheck.allowed) {
      return NextResponse.json({
        error: `You've reached the daily limit of 5 notes. Upgrade to Premium for unlimited notes.`,
        rateLimited: true,
      }, { status: 429 });
    }

    // Generate notes via OpenAI
    const content = await generateNotes(text);

    // Save to database and increment usage concurrently
    const noteTitle = title || `Notes - ${new Date().toLocaleDateString()}`;
    const [noteResult] = await Promise.all([
      supabase.from("notes").insert({
        user_id: user.id,
        title: noteTitle,
        content: text,
        summary: content,
      }).select().single(),
      incrementUsage(user.id)
    ]);

    const { data: note, error } = noteResult;

    if (error) throw error;

    return NextResponse.json({ note, content, remaining: rateCheck.remaining - 1 });
  } catch (err: unknown) {
    console.error("Generate notes error:", err);
    const message = err instanceof Error ? err.message : "Failed to generate notes";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
