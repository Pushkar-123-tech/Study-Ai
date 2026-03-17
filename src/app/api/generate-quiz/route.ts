import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { generateQuiz } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Fetch profile and parse request concurrently
    const [
      { data: profile },
      { notes, noteId }
    ] = await Promise.all([
      supabase.from("users").select("plan").eq("id", user.id).single(),
      req.json()
    ]);

    if (profile?.plan !== "premium") {
      return NextResponse.json({ error: "Quiz generation is a Premium feature. Please upgrade." }, { status: 403 });
    }
    if (!notes) return NextResponse.json({ error: "Notes content required" }, { status: 400 });

    const questions = await generateQuiz(notes);

    // Save to database
    const quizRows = questions.map((q) => ({
      user_id: user.id,
      note_id: noteId || null,
      question: q.question,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_answer: q.correct_answer,
    }));

    const { data: savedQuizzes, error } = await supabase
      .from("quizzes")
      .insert(quizRows)
      .select();

    if (error) throw error;

    return NextResponse.json({ questions: savedQuizzes });
  } catch (err: unknown) {
    console.error("Generate quiz error:", err);
    const message = err instanceof Error ? err.message : "Failed to generate quiz";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
