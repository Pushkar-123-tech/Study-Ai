import { POST as generateNotes } from "./generate-notes/route";
import { POST as generateFlashcards } from "./generate-flashcards/route";
import { POST as generateQuiz } from "./generate-quiz/route";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextRequest } from "next/server";
import * as openAI from "@/lib/openai";
import * as rateLimit from "@/utils/rateLimit";

jest.mock("@/lib/supabase-server");
jest.mock("@/lib/openai");
jest.mock("@/utils/rateLimit");

describe("API Endpoints", () => {
  const mockSupabase = createServerSupabaseClient as jest.Mock;
  const mockGenerateNotes = openAI.generateNotes as jest.Mock;
  const mockGenerateFlashcards = openAI.generateFlashcards as jest.Mock;
  const mockGenerateQuiz = openAI.generateQuiz as jest.Mock;
  const mockCheckRateLimit = rateLimit.checkRateLimit as jest.Mock;
  const mockIncrementUsage = rateLimit.incrementUsage as jest.Mock;

  // Common mock user and profile
  const mockUser = { id: "123", email: "test@example.com" };
  const mockProfile = { plan: "premium" };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe("generate-notes", () => {
    it("should return 401 if user is not authenticated", async () => {
      mockSupabase.mockReturnValue({
        auth: { getUser: () => ({ data: { user: null } }) },
      });

      const req = new NextRequest("http://localhost/api/generate-notes", {
        method: "POST",
        body: JSON.stringify({ text: "This is a test" }),
      });

      const res = await generateNotes(req);
      expect(res.status).toBe(401);
    });

    it("should return 400 if text is too short", async () => {
      mockSupabase.mockReturnValue({
        auth: { getUser: () => ({ data: { user: mockUser } }) },
        from: () => ({
          select: () => ({
            eq: () => ({
              single: () => ({ data: mockProfile }),
            }),
          }),
        }),
      });

      const req = new NextRequest("http://localhost/api/generate-notes", {
        method: "POST",
        body: JSON.stringify({ text: "short" }),
      });

      const res = await generateNotes(req);
      expect(res.status).toBe(400);
    });

    it("should generate notes successfully", async () => {
      mockSupabase.mockReturnValue({
        auth: { getUser: () => ({ data: { user: mockUser } }) },
        from: (table: string) => ({
          select: () => ({
            eq: () => ({
              single: () => ({ data: mockProfile }),
            }),
          }),
          insert: () => ({
            select: () => ({
              single: () => ({ data: { id: "note-1" }, error: null }),
            }),
          }),
        }),
      });
      mockGenerateNotes.mockResolvedValue("Generated notes");
      mockCheckRateLimit.mockResolvedValue({ allowed: true, remaining: 4 });
      mockIncrementUsage.mockResolvedValue(undefined);

      const req = new NextRequest("http://localhost/api/generate-notes", {
        method: "POST",
        body: JSON.stringify({ text: "This is a longer test for generating notes." }),
      });

      const res = await generateNotes(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.note.id).toBe("note-1");
    });
  });

  describe("generate-flashcards", () => {
    it("should return 401 if user is not authenticated", async () => {
      mockSupabase.mockReturnValue({
        auth: { getUser: () => ({ data: { user: null } }) },
      });

      const req = new NextRequest("http://localhost/api/generate-flashcards", {
        method: "POST",
        body: JSON.stringify({ notes: "Test notes" }),
      });

      const res = await generateFlashcards(req);
      expect(res.status).toBe(401);
    });

    it("should return 403 if user is not premium", async () => {
      mockSupabase.mockReturnValue({
        auth: { getUser: () => ({ data: { user: mockUser } }) },
        from: () => ({
          select: () => ({
            eq: () => ({
              single: () => ({ data: { plan: "free" } }),
            }),
          }),
        }),
      });

      const req = new NextRequest("http://localhost/api/generate-flashcards", {
        method: "POST",
        body: JSON.stringify({ notes: "Test notes" }),
      });

      const res = await generateFlashcards(req);
      expect(res.status).toBe(403);
    });

    it("should return 400 if notes are missing", async () => {
      mockSupabase.mockReturnValue({
        auth: { getUser: () => ({ data: { user: mockUser } }) },
        from: () => ({
          select: () => ({
            eq: () => ({
              single: () => ({ data: mockProfile }),
            }),
          }),
        }),
      });

      const req = new NextRequest("http://localhost/api/generate-flashcards", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const res = await generateFlashcards(req);
      expect(res.status).toBe(400);
    });

    it("should generate flashcards successfully", async () => {
      mockSupabase.mockReturnValue({
        auth: { getUser: () => ({ data: { user: mockUser } }) },
        from: (table: string) => ({
          select: () => ({
            eq: () => ({
              single: () => ({ data: mockProfile }),
            }),
          }),
          insert: () => ({
            select: () => ({ data: [{ id: "fc-1" }], error: null }),
          }),
        }),
      });
      mockGenerateFlashcards.mockResolvedValue([{ question: "Q1", answer: "A1" }]);

      const req = new NextRequest("http://localhost/api/generate-flashcards", {
        method: "POST",
        body: JSON.stringify({ notes: "Test notes for flashcards" }),
      });

      const res = await generateFlashcards(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.flashcards[0].id).toBe("fc-1");
    });
  });

  describe("generate-quiz", () => {
    it("should return 401 if user is not authenticated", async () => {
      mockSupabase.mockReturnValue({
        auth: { getUser: () => ({ data: { user: null } }) },
      });

      const req = new NextRequest("http://localhost/api/generate-quiz", {
        method: "POST",
        body: JSON.stringify({ notes: "Test notes" }),
      });

      const res = await generateQuiz(req);
      expect(res.status).toBe(401);
    });

    it("should return 403 if user is not premium", async () => {
      mockSupabase.mockReturnValue({
        auth: { getUser: () => ({ data: { user: mockUser } }) },
        from: () => ({
          select: () => ({
            eq: () => ({
              single: () => ({ data: { plan: "free" } }),
            }),
          }),
        }),
      });

      const req = new NextRequest("http://localhost/api/generate-quiz", {
        method: "POST",
        body: JSON.stringify({ notes: "Test notes" }),
      });

      const res = await generateQuiz(req);
      expect(res.status).toBe(403);
    });

    it("should return 400 if notes are missing", async () => {
      mockSupabase.mockReturnValue({
        auth: { getUser: () => ({ data: { user: mockUser } }) },
        from: () => ({
          select: () => ({
            eq: () => ({
              single: () => ({ data: mockProfile }),
            }),
          }),
        }),
      });

      const req = new NextRequest("http://localhost/api/generate-quiz", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const res = await generateQuiz(req);
      expect(res.status).toBe(400);
    });

    it("should generate a quiz successfully", async () => {
      mockSupabase.mockReturnValue({
        auth: { getUser: () => ({ data: { user: mockUser } }) },
        from: (table: string) => ({
          select: () => ({
            eq: () => ({
              single: () => ({ data: mockProfile }),
            }),
          }),
          insert: () => ({
            select: () => ({ data: [{ id: "q-1" }], error: null }),
          }),
        }),
      });
      mockGenerateQuiz.mockResolvedValue([{ question: "Q1", option_a: "A", option_b: "B", option_c: "C", option_d: "D", correct_answer: "A" }]);

      const req = new NextRequest("http://localhost/api/generate-quiz", {
        method: "POST",
        body: JSON.stringify({ notes: "Test notes for a quiz" }),
      });

      const res = await generateQuiz(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.questions[0].id).toBe("q-1");
    });
  });
});
