import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { generateFlashcards } from "@/lib/openai";

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
      return NextResponse.json({ error: "Flashcard generation is a Premium feature. Please upgrade." }, { status: 403 });
    }
    if (!notes) return NextResponse.json({ error: "Notes content required" }, { status: 400 });

    const flashcards = await generateFlashcards(notes);

    // Save to database
    const flashcardRows = flashcards.map((f) => ({
      user_id: user.id,
      note_id: noteId || null,
      question: f.question,
      answer: f.answer,
    }));

    const { data: savedFlashcards, error } = await supabase
      .from("flashcards")
      .insert(flashcardRows)
      .select();

    if (error) throw error;

    return NextResponse.json({ flashcards: savedFlashcards });
  } catch (err: unknown) {
    console.error("Generate flashcards error:", err);
    const message = err instanceof Error ? err.message : "Failed to generate flashcards";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
