"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Copy, Check, Loader2, Brain, HelpCircle, Crown } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";

interface Note {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  created_at: string;
}

interface NoteDetailClientProps {
  note: Note;
  plan: string;
}

export function NoteDetailClient({ note, plan }: NoteDetailClientProps) {
  const isPremium = plan === "premium";
  const [copied, setCopied] = useState(false);
  const [flashcardsLoading, setFlashcardsLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<Array<{ id: string; question: string; answer: string }>>([]);
  const [quizQuestions, setQuizQuestions] = useState<Array<{
    id: string; question: string; option_a: string; option_b: string;
    option_c: string; option_d: string; correct_answer: string;
  }>>([]);

  function handleCopy() {
    navigator.clipboard.writeText(note.summary ?? note.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard");
  }

  async function handleExportPDF() {
    if (!isPremium) {
      toast.error("PDF export is a Premium feature");
      return;
    }
    try {
      const res = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: note.title, content: note.summary ?? note.content, flashcards }),
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${note.title.replace(/\s+/g, "-")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded!");
    } catch {
      toast.error("Failed to export PDF");
    }
  }

  async function handleGenerateFlashcards() {
    setFlashcardsLoading(true);
    try {
      const res = await fetch("/api/generate-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: note.summary ?? note.content, noteId: note.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFlashcards(data.flashcards);
      toast.success("Flashcards generated!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to generate flashcards");
    } finally {
      setFlashcardsLoading(false);
    }
  }

  async function handleGenerateQuiz() {
    setQuizLoading(true);
    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: note.summary ?? note.content, noteId: note.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setQuizQuestions(data.questions);
      toast.success("Quiz generated!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to generate quiz");
    } finally {
      setQuizLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/saved-notes">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{note.title}</h1>
            <p className="text-xs text-gray-500">{format(new Date(note.created_at), "PPP")}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 h-8">
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            disabled={!isPremium}
            className="gap-1.5 h-8 relative"
          >
            <Download className="w-3.5 h-3.5" />
            Export PDF
            {!isPremium && <Badge className="absolute -top-2 -right-2 bg-violet-600 text-white text-xs border-0 px-1">Pro</Badge>}
          </Button>
        </div>
      </div>

      {/* Notes content */}
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="p-6">
          <div className="prose prose-sm max-w-none text-gray-700">
            <ReactMarkdown>{note.summary ?? note.content}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {isPremium && (
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={handleGenerateFlashcards}
            disabled={flashcardsLoading}
            className="gap-2"
          >
            {flashcardsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
            Generate Flashcards
          </Button>
          <Button
            variant="outline"
            onClick={handleGenerateQuiz}
            disabled={quizLoading}
            className="gap-2"
          >
            {quizLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <HelpCircle className="w-4 h-4" />}
            Generate Quiz
          </Button>
        </div>
      )}

      {!isPremium && (
        <Card className="border-violet-200 bg-violet-50">
          <CardContent className="p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-violet-600" />
              <p className="text-sm text-gray-700">Upgrade to generate flashcards & quizzes from this note</p>
            </div>
            <Link href="/pricing">
              <Button size="sm" className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 shrink-0">Upgrade</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Flashcards */}
      {flashcards.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Flashcards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flashcards.map((card, i) => (
              <FlashcardItem key={card.id} card={card} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Quiz */}
      {quizQuestions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Quiz</h2>
          <div className="space-y-4">
            {quizQuestions.map((q, i) => (
              <QuizItem key={q.id} question={q} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FlashcardItem({ card, index }: { card: { question: string; answer: string }; index: number }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="cursor-pointer" style={{ perspective: "1000px" }} onClick={() => setFlipped(!flipped)}>
      <div
        className="relative h-32 transition-transform duration-500"
        style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-xl p-4 flex flex-col justify-between" style={{ backfaceVisibility: "hidden" }}>
          <div className="flex justify-between">
            <Badge className="bg-violet-100 text-violet-700 border-0 text-xs">Q{index + 1}</Badge>
            <span className="text-xs text-gray-400">Click to flip</span>
          </div>
          <p className="text-sm font-medium text-gray-800">{card.question}</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-4 flex flex-col justify-between" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <Badge className="bg-green-100 text-green-700 border-0 text-xs w-fit">Answer</Badge>
          <p className="text-sm text-gray-800">{card.answer}</p>
        </div>
      </div>
    </div>
  );
}

function QuizItem({ question: q, index }: {
  question: { question: string; option_a: string; option_b: string; option_c: string; option_d: string; correct_answer: string; };
  index: number;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const options = [
    { key: "A", text: q.option_a }, { key: "B", text: q.option_b },
    { key: "C", text: q.option_c }, { key: "D", text: q.option_d },
  ];
  const isCorrect = selected === q.correct_answer;
  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardContent className="p-5">
        <p className="text-sm font-semibold text-gray-900 mb-3"><span className="text-violet-600 mr-2">Q{index + 1}.</span>{q.question}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {options.map((opt) => {
            const isSelected = selected === opt.key;
            const showCorrect = selected !== null && opt.key === q.correct_answer;
            const showWrong = isSelected && !isCorrect;
            return (
              <button key={opt.key} onClick={() => !selected && setSelected(opt.key)}
                className={`text-left p-3 rounded-lg border text-sm transition-all ${showCorrect ? "bg-green-50 border-green-400 text-green-800 font-medium" : showWrong ? "bg-red-50 border-red-400 text-red-800" : isSelected ? "bg-violet-50 border-violet-400 text-violet-800" : "bg-gray-50 border-gray-200 hover:border-violet-300 hover:bg-violet-50 text-gray-700"}`}>
                <span className="font-medium mr-2">{opt.key}.</span>{opt.text}
              </button>
            );
          })}
        </div>
        {selected && <p className={`text-xs mt-2 font-medium ${isCorrect ? "text-green-600" : "text-red-600"}`}>{isCorrect ? "Correct!" : `Incorrect. Correct answer: ${q.correct_answer}`}</p>}
      </CardContent>
    </Card>
  );
}
