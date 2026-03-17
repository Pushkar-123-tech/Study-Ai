import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ---------------- TYPES ---------------- */

export interface Flashcard {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: "A" | "B" | "C" | "D";
}

/* ---------------- HELPER ---------------- */

function safeJSONParse(text: string) {
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("JSON Parse Error:", error);
    return {};
  }
}

/* ---------------- NOTES GENERATOR ---------------- */

export async function generateNotes(text: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Create structured study notes from the provided text. Use markdown headers, bullet points, and highlight important terms with **bold**. Keep it concise but clear."
        },
        {
          role: "user",
          content: text
        }
      ],
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content ?? "";
  } catch (error) {
    console.error("Notes generation error:", error);
    throw new Error("Failed to generate notes");
  }
}

/* ---------------- FLASHCARDS ---------------- */

export async function generateFlashcards(
  notes: string
): Promise<Flashcard[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Generate exactly 8 flashcards from the notes. Return ONLY JSON in this format: {\"flashcards\": [{\"question\": \"string\", \"answer\": \"string\"}]}"
        },
        {
          role: "user",
          content: notes
        }
      ],
      max_tokens: 2000,
    });

    const parsed = safeJSONParse(response.choices[0]?.message?.content ?? "{}");
    return parsed.flashcards ?? [];
  } catch (error) {
    console.error("Flashcard generation error:", error);
    throw new Error("Failed to generate flashcards");
  }
}

/* ---------------- QUIZ GENERATOR ---------------- */

export async function generateQuiz(
  notes: string
): Promise<QuizQuestion[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Create exactly 8 multiple choice questions from the notes. Return JSON: {\"questions\": [{\"question\":\"string\", \"option_a\":\"string\", \"option_b\":\"string\", \"option_c\":\"string\", \"option_d\":\"string\", \"correct_answer\":\"A\"}]}"
        },
        {
          role: "user",
          content: notes
        }
      ],
      max_tokens: 2000,
    });

    const parsed = safeJSONParse(response.choices[0]?.message?.content ?? "{}");
    return parsed.questions ?? [];
  } catch (error) {
    console.error("Quiz generation error:", error);
    throw new Error("Failed to generate quiz");
  }
}