"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Crown, ArrowRight, CheckCircle, XCircle } from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  created_at: string;
  note_id: string | null;
}

interface QuizClientProps {
  plan: string;
  initialQuizzes: QuizQuestion[];
}

export function QuizClient({ plan, initialQuizzes }: QuizClientProps) {
  const isPremium = plan === "premium";
  const [quizzes] = useState(initialQuizzes);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!isPremium) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quiz Generator</h1>
          <p className="text-gray-500 mb-6">
            Quiz generation is available on the Premium plan. Upgrade to test your knowledge with AI-generated quizzes.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/pricing">
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 gap-2">
                <Crown className="w-4 h-4" /> Upgrade to Premium
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const score = submitted
    ? quizzes.filter((q) => answers[q.id] === q.correct_answer).length
    : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quiz</h1>
          <p className="text-gray-500 mt-1 text-sm">Test your knowledge with AI-generated questions</p>
        </div>
        <Link href="/generate">
          <Button variant="outline" className="gap-2">
            <ArrowRight className="w-4 h-4" /> Generate New Quiz
          </Button>
        </Link>
      </div>

      {submitted && quizzes.length > 0 && (
        <Card className="border-0 shadow-sm bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900 text-lg">Quiz Complete!</p>
                <p className="text-gray-600 text-sm">
                  You scored <strong>{score}/{quizzes.length}</strong> ({Math.round((score / quizzes.length) * 100)}%)
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setAnswers({}); setSubmitted(false); }}
              >
                Retry Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {quizzes.length === 0 ? (
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-12 text-center">
            <HelpCircle className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">No quiz questions yet</p>
            <p className="text-sm text-gray-400 mb-4">Generate notes first, then create a quiz from them</p>
            <Link href="/generate">
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0">
                Generate Notes
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-5">
            {quizzes.map((q, i) => (
              <QuizQuestionCard
                key={q.id}
                question={q}
                index={i}
                selected={answers[q.id] ?? null}
                submitted={submitted}
                onSelect={(val) => !submitted && setAnswers((prev) => ({ ...prev, [q.id]: val }))}
              />
            ))}
          </div>

          {!submitted && (
            <Button
              onClick={() => setSubmitted(true)}
              disabled={Object.keys(answers).length < quizzes.length}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 h-12"
            >
              Submit Quiz ({Object.keys(answers).length}/{quizzes.length} answered)
            </Button>
          )}
        </>
      )}
    </div>
  );
}

function QuizQuestionCard({
  question: q,
  index,
  selected,
  submitted,
  onSelect,
}: {
  question: QuizQuestion;
  index: number;
  selected: string | null;
  submitted: boolean;
  onSelect: (val: string) => void;
}) {
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
        <div className="flex items-start gap-3 mb-4">
          <Badge className="bg-gray-100 text-gray-600 border-0 shrink-0 mt-0.5">Q{index + 1}</Badge>
          <p className="font-semibold text-gray-900 text-sm leading-relaxed">{q.question}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {options.map((opt) => {
            const isSelected = selected === opt.key;
            const showCorrect = submitted && opt.key === q.correct_answer;
            const showWrong = submitted && isSelected && !isCorrect;
            return (
              <button
                key={opt.key}
                onClick={() => onSelect(opt.key)}
                disabled={submitted}
                className={`text-left p-3 rounded-lg border text-sm transition-all ${
                  showCorrect
                    ? "bg-green-50 border-green-400 text-green-800 font-medium"
                    : showWrong
                    ? "bg-red-50 border-red-400 text-red-800"
                    : isSelected
                    ? "bg-violet-50 border-violet-400 text-violet-800 font-medium"
                    : "bg-gray-50 border-gray-200 hover:border-violet-300 hover:bg-violet-50 text-gray-700"
                } ${submitted ? "cursor-default" : "cursor-pointer"}`}
              >
                <span className="font-semibold mr-2">{opt.key}.</span>
                {opt.text}
              </button>
            );
          })}
        </div>
        {submitted && (
          <div className={`flex items-center gap-1.5 mt-3 text-xs font-medium ${isCorrect ? "text-green-600" : "text-red-600"}`}>
            {isCorrect
              ? <><CheckCircle className="w-3.5 h-3.5" /> Correct!</>
              : <><XCircle className="w-3.5 h-3.5" /> Incorrect. Correct answer: <strong>{q.correct_answer}</strong></>
            }
          </div>
        )}
      </CardContent>
    </Card>
  );
}
