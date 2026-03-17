"use client";

import { useState, useRef, Suspense, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles, Loader2, FileText, Brain, HelpCircle,
  Download, Crown, Copy, Check, Upload, X
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface GenerateNotesClientProps {
  plan: string;
  usedToday: number;
}

export const GenerateNotesClient = memo(function GenerateNotesClient({ plan, usedToday }: GenerateNotesClientProps) {
  const isPremium = plan === "premium";
  const freeLimit = 5;
  const remaining = Math.max(0, freeLimit - usedToday);

  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [savedNoteId, setSavedNoteId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [flashcardsLoading, setFlashcardsLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<Array<{ id: string; question: string; answer: string }>>([]);
  const [quizQuestions, setQuizQuestions] = useState<Array<{
    id: string; question: string; option_a: string; option_b: string;
    option_c: string; option_d: string; correct_answer: string;
  }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");

  const handleGenerate = useCallback(async () => {
    if (!text.trim()) {
      toast.error("Please enter some study material first");
      return;
    }
    if (!isPremium && remaining === 0) {
      toast.error("Daily limit reached. Upgrade to Premium for unlimited notes.");
      return;
    }
    setLoading(true);
    setGeneratedContent("");
    setFlashcards([]);
    setQuizQuestions([]);
    setSavedNoteId(null);

    try {
      const res = await fetch("/api/generate-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, title }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setGeneratedContent(data.content);
      setSavedNoteId(data.note.id);
      toast.success("Notes generated and saved!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to generate notes";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [text, title, isPremium, remaining]);

  async function handleGenerateFlashcards() {
    if (!isPremium) {
      toast.error("Flashcards are a Premium feature. Please upgrade.");
      return;
    }
    setFlashcardsLoading(true);
    try {
      const res = await fetch("/api/generate-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: generatedContent, noteId: savedNoteId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFlashcards(data.flashcards);
      toast.success("Flashcards generated!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to generate flashcards";
      toast.error(message);
    } finally {
      setFlashcardsLoading(false);
    }
  }

  async function handleGenerateQuiz() {
    if (!isPremium) {
      toast.error("Quiz generation is a Premium feature. Please upgrade.");
      return;
    }
    setQuizLoading(true);
    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: generatedContent, noteId: savedNoteId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setQuizQuestions(data.questions);
      toast.success("Quiz generated!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to generate quiz";
      toast.error(message);
    } finally {
      setQuizLoading(false);
    }
  }

  async function handleExportPDF() {
    if (!isPremium) {
      toast.error("PDF export is a Premium feature. Please upgrade.");
      return;
    }
    try {
      const res = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title || "Study Notes", content: generatedContent, flashcards }),
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title || "study-notes"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded!");
    } catch {
      toast.error("Failed to export PDF");
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard");
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf" && !file.type.startsWith("text/")) {
      toast.error("Please upload a PDF or text file");
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setText(result);
      toast.info("File content loaded. Review and generate notes.");
    };
    reader.readAsText(file);
  }

  const charCount = text.length;
  const maxChars = isPremium ? 50000 : 5000;
  const charPercent = Math.min(100, (charCount / maxChars) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Generate Notes</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Paste study material, upload a file, or enter a topic to generate AI-powered notes.
        </p>
      </div>

      {/* Usage indicator */}
      {!isPremium && (
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Daily Notes Usage</span>
              <span className="text-sm text-gray-500">{usedToday} / {freeLimit} used</span>
            </div>
            <Progress value={(usedToday / freeLimit) * 100} className="h-2" />
            {remaining === 0 && (
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-red-600">Daily limit reached</p>
                <Link href="/pricing">
                  <Button size="sm" variant="outline" className="h-7 text-xs text-violet-600 border-violet-300">
                    <Crown className="w-3 h-3 mr-1" /> Upgrade
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input panel */}
        <div className="space-y-4">
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Study Material</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">Title (optional)</Label>
                <Input
                  id="title"
                  placeholder="e.g., Biology Chapter 3 — Cell Division"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              {/* File upload */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-dashed gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload File (.txt)
                </Button>
                {fileName && (
                  <div className="flex items-center gap-2 mt-2 px-2 py-1.5 bg-blue-50 rounded-lg">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-xs text-blue-700 flex-1 truncate">{fileName}</span>
                    <button onClick={() => { setFileName(""); setText(""); }}>
                      <X className="w-3.5 h-3.5 text-blue-500 hover:text-blue-700" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="text" className="text-sm font-medium text-gray-700">Study Material</Label>
                <Textarea
                  id="text"
                  placeholder="Paste your study material here, or type a topic you want notes on..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="mt-1.5 min-h-[280px] resize-none"
                  maxLength={maxChars}
                />
                <div className="flex justify-between mt-1">
                  <span className={`text-xs ${charCount > maxChars * 0.9 ? "text-red-500" : "text-gray-400"}`}>
                    {charCount.toLocaleString()} / {maxChars.toLocaleString()} characters
                  </span>
                  {!isPremium && (
                    <span className="text-xs text-gray-400">Free: 5K max</span>
                  )}
                </div>
                {!isPremium && charCount > 0 && (
                  <Progress value={charPercent} className="h-1 mt-1" />
                )}
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading || (!isPremium && remaining === 0)}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 hover:opacity-90 gap-2"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Generate Notes</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Output panel */}
        <div className="space-y-4">
          {loading ? (
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4 rounded" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ) : generatedContent ? (
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet-600" />
                    Generated Notes
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 gap-1.5 text-xs">
                      {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                    {isPremium && (
                      <Button variant="ghost" size="sm" onClick={handleExportPDF} className="h-8 gap-1.5 text-xs">
                        <Download className="w-3.5 h-3.5" />
                        PDF
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-gray-700 max-h-[350px] overflow-y-auto pr-1">
                  <Suspense fallback={<Skeleton className="h-32 w-full" />}>
                    <ReactMarkdown>{generatedContent}</ReactMarkdown>
                  </Suspense>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-sm bg-white border-dashed">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-gray-400 text-sm">Your generated notes will appear here</p>
              </CardContent>
            </Card>
          )}

          {/* Post-generation actions */}
          {generatedContent && (
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleGenerateFlashcards}
                disabled={flashcardsLoading || !isPremium}
                className="gap-2 relative"
              >
                {flashcardsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                Flashcards
                {!isPremium && <Badge className="absolute -top-2 -right-2 bg-violet-600 text-white text-xs border-0 px-1">Pro</Badge>}
              </Button>
              <Button
                variant="outline"
                onClick={handleGenerateQuiz}
                disabled={quizLoading || !isPremium}
                className="gap-2 relative"
              >
                {quizLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <HelpCircle className="w-4 h-4" />}
                Generate Quiz
                {!isPremium && <Badge className="absolute -top-2 -right-2 bg-violet-600 text-white text-xs border-0 px-1">Pro</Badge>}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Flashcards display */}
      {flashcards.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Generated Flashcards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flashcards.map((card, i) => (
              <FlashcardItem key={card.id} card={card} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Quiz display */}
      {quizQuestions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Generated Quiz</h2>
          <div className="space-y-4">
            {quizQuestions.map((q, i) => (
              <QuizItem key={q.id} question={q} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

const FlashcardItem = memo(function FlashcardItem({ card, index }: { card: { question: string; answer: string }; index: number }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className="cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className="relative h-32 transition-transform duration-500"
        style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-xl p-4 flex flex-col justify-between"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex items-center justify-between">
            <Badge className="bg-violet-100 text-violet-700 border-0 text-xs">Q{index + 1}</Badge>
            <span className="text-xs text-gray-400">Click to flip</span>
          </div>
          <p className="text-sm font-medium text-gray-800">{card.question}</p>
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-4 flex flex-col justify-between"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <Badge className="bg-green-100 text-green-700 border-0 text-xs w-fit">Answer</Badge>
          <p className="text-sm text-gray-800">{card.answer}</p>
        </div>
      </div>
    </div>
  );
});

const QuizItem = memo(function QuizItem({ question: q, index }: {
  question: {
    question: string; option_a: string; option_b: string;
    option_c: string; option_d: string; correct_answer: string;
  };
  index: number;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const options = [
    { key: "A", text: q.option_a },
    { key: "B", text: q.option_b },
    { key: "C", text: q.option_c },
    { key: "D", text: q.option_d },
  ];
  const isCorrect = selected === q.correct_answer;

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardContent className="p-5">
        <p className="text-sm font-semibold text-gray-900 mb-3">
          <span className="text-violet-600 mr-2">Q{index + 1}.</span>
          {q.question}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {options.map((opt) => {
            const isSelected = selected === opt.key;
            const showCorrect = selected !== null && opt.key === q.correct_answer;
            const showWrong = isSelected && !isCorrect;
            return (
              <button
                key={opt.key}
                onClick={() => !selected && setSelected(opt.key)}
                className={`text-left p-3 rounded-lg border text-sm transition-all ${
                  showCorrect
                    ? "bg-green-50 border-green-400 text-green-800 font-medium"
                    : showWrong
                    ? "bg-red-50 border-red-400 text-red-800"
                    : isSelected
                    ? "bg-violet-50 border-violet-400 text-violet-800"
                    : "bg-gray-50 border-gray-200 hover:border-violet-300 hover:bg-violet-50 text-gray-700"
                }`}
              >
                <span className="font-medium mr-2">{opt.key}.</span>
                {opt.text}
              </button>
            );
          })}
        </div>
        {selected && (
          <p className={`text-xs mt-2 font-medium ${isCorrect ? "text-green-600" : "text-red-600"}`}>
            {isCorrect ? "Correct!" : `Incorrect. The correct answer is ${q.correct_answer}.`}
          </p>
        )}
      </CardContent>
    </Card>
  );
});
