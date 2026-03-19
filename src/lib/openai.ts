import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("API KEY:", process.env.GEMINI_API_KEY);

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
    const model = genAI.getGenerativeModel({   model: "gemini-1.5-flash" });

    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text:
                "Create structured study notes from the provided text. Use markdown headers, bullet points, and highlight important terms with **bold**. Keep it concise but clear.\n\n" +
                text,
            },
          ],
        },
      ],
    });

    return response.response.text();
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
    const model = genAI.getGenerativeModel({   model: "gemini-1.5-flash" });

    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text:
                "Generate exactly 8 flashcards from the notes. Return ONLY JSON in this format: {\"flashcards\": [{\"question\": \"string\", \"answer\": \"string\"}]}\n\n" +
                notes,
            },
          ],
        },
      ],
    });

    const parsed = safeJSONParse(response.response.text());
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
    const model = genAI.getGenerativeModel({   model: "gemini-1.5-flash" });

    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text:
                "Create exactly 8 multiple choice questions from the notes. Return JSON: {\"questions\": [{\"question\":\"string\", \"option_a\":\"string\", \"option_b\":\"string\", \"option_c\":\"string\", \"option_d\":\"string\", \"correct_answer\":\"A\"}]}\n\n" +
                notes,
            },
          ],
        },
      ],
    });

    const parsed = safeJSONParse(response.response.text());
    return parsed.questions ?? [];
  } catch (error) {
    console.error("Quiz generation error:", error);
    throw new Error("Failed to generate quiz");
  }
}