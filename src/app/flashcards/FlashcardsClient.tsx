"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Crown, ArrowRight, RotateCcw } from "lucide-react";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  created_at: string;
  note_id: string | null;
}

interface FlashcardsClientProps {
  plan: string;
  initialFlashcards: Flashcard[];
}

export function FlashcardsClient({ plan, initialFlashcards }: FlashcardsClientProps) {
  const isPremium = plan === "premium";
  const [flashcards] = useState(initialFlashcards);
  const [studyMode, setStudyMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!isPremium) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-violet-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Flashcard Generator</h1>
          <p className="text-gray-500 mb-6">
            Flashcards are available on the Premium plan. Upgrade to generate interactive flashcards from your notes.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/pricing">
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 gap-2">
                <Crown className="w-4 h-4" /> Upgrade to Premium
              </Button>
            </Link>
            <Link href="/generate">
              <Button variant="outline">Generate Notes First</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (studyMode && flashcards.length > 0) {
    const card = flashcards[currentIndex];
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Study Mode</h1>
          <Button variant="outline" onClick={() => { setStudyMode(false); setCurrentIndex(0); setFlipped(false); }}>
            Exit Study Mode
          </Button>
        </div>

        <div className="text-center mb-4">
          <span className="text-sm text-gray-500">{currentIndex + 1} / {flashcards.length}</span>
        </div>

        <div
          className="cursor-pointer mb-6"
          style={{ perspective: "1000px" }}
          onClick={() => setFlipped(!flipped)}
        >
          <div
            className="relative h-56 transition-transform duration-500"
            style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
          >
            <div
              className="absolute inset-0 bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-2xl p-8 flex flex-col justify-center items-center text-center"
              style={{ backfaceVisibility: "hidden" }}
            >
              <Badge className="bg-violet-100 text-violet-700 border-0 mb-4">Question</Badge>
              <p className="text-lg font-medium text-gray-800">{card.question}</p>
              <p className="text-xs text-gray-400 mt-4">Click to reveal answer</p>
            </div>
            <div
              className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 flex flex-col justify-center items-center text-center"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <Badge className="bg-green-100 text-green-700 border-0 mb-4">Answer</Badge>
              <p className="text-lg text-gray-800">{card.answer}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => { setCurrentIndex(Math.max(0, currentIndex - 1)); setFlipped(false); }}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setFlipped(false)}
            className="gap-1.5"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
          <Button
            onClick={() => { setCurrentIndex(Math.min(flashcards.length - 1, currentIndex + 1)); setFlipped(false); }}
            disabled={currentIndex === flashcards.length - 1}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0"
          >
            Next
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Flashcards</h1>
          <p className="text-gray-500 mt-1 text-sm">Review all your saved flashcards</p>
        </div>
        <div className="flex gap-3">
          {flashcards.length > 0 && (
            <Button
              onClick={() => { setStudyMode(true); setCurrentIndex(0); setFlipped(false); }}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 gap-2"
            >
              <Brain className="w-4 h-4" /> Study Mode
            </Button>
          )}
          <Link href="/generate">
            <Button variant="outline" className="gap-2">
              <ArrowRight className="w-4 h-4" /> Generate New
            </Button>
          </Link>
        </div>
      </div>

      {flashcards.length === 0 ? (
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-12 text-center">
            <Brain className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">No flashcards yet</p>
            <p className="text-sm text-gray-400 mb-4">Generate notes first, then create flashcards from them</p>
            <Link href="/generate">
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0">
                Generate Notes
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {flashcards.map((card, i) => (
            <FlashcardCard key={card.id} card={card} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function FlashcardCard({ card, index }: { card: Flashcard; index: number }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="cursor-pointer" style={{ perspective: "1000px" }} onClick={() => setFlipped(!flipped)}>
      <div
        className="relative h-36 transition-transform duration-500"
        style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-xl p-5 flex flex-col justify-between"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex items-center justify-between">
            <Badge className="bg-violet-100 text-violet-700 border-0 text-xs">Q{index + 1}</Badge>
            <span className="text-xs text-gray-400">Click to flip</span>
          </div>
          <p className="text-sm font-medium text-gray-800">{card.question}</p>
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-5 flex flex-col justify-between"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <Badge className="bg-green-100 text-green-700 border-0 text-xs w-fit">Answer</Badge>
          <p className="text-sm text-gray-800">{card.answer}</p>
        </div>
      </div>
    </div>
  );
}
