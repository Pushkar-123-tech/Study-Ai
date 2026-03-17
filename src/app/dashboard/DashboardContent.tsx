"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Brain, HelpCircle, Sparkles, BookMarked, Crown, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface DashboardContentProps {
  user: { name: string; email: string; plan: string };
  stats: {
    totalNotes: number;
    totalFlashcards: number;
    totalQuizzes: number;
    usedToday: number;
  };
  recentNotes: Array<{ id: string; title: string; created_at: string }>;
}

export function DashboardContent({ user, stats, recentNotes }: DashboardContentProps) {
  const isPremium = user.plan === "premium";
  const freeLimit = 5;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.name.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Ready to study smarter today?</p>
        </div>
        <Link href="/generate">
          <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 hover:opacity-90 gap-2">
            <Sparkles className="w-4 h-4" />
            Generate Notes
          </Button>
        </Link>
      </div>

      {/* Premium upsell */}
      {!isPremium && (
        <Card className="border-violet-200 bg-gradient-to-r from-violet-50 to-indigo-50">
          <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <Crown className="w-5 h-5 text-violet-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">Upgrade to Premium</p>
                <p className="text-xs text-gray-600">Get unlimited notes, flashcards, quizzes & PDF export for $5/month</p>
              </div>
            </div>
            <Link href="/pricing">
              <Button size="sm" className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 shrink-0">
                Upgrade Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500 font-medium">Total Notes</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalNotes}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
                <Brain className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500 font-medium">Flashcards</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalFlashcards}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-yellow-50 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-yellow-600" />
              </div>
              <span className="text-sm text-gray-500 font-medium">Quizzes</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalQuizzes}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-500 font-medium">Today&apos;s Usage</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {isPremium ? "∞" : `${stats.usedToday}/${freeLimit}`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/generate">
            <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer hover-lift">
              <CardContent className="p-5">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Generate Notes</h3>
                <p className="text-xs text-gray-500">Convert study material into structured notes</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/flashcards">
            <Card className={`border-0 shadow-sm bg-white hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer hover-lift ${!isPremium ? "opacity-75" : ""}`}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                    <Brain className="w-5 h-5 text-purple-600" />
                  </div>
                  {!isPremium && <Badge className="bg-violet-100 text-violet-700 border-0 text-xs">Premium</Badge>}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Flashcards</h3>
                <p className="text-xs text-gray-500">Create and study interactive flashcards</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/quiz">
            <Card className={`border-0 shadow-sm bg-white hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer hover-lift ${!isPremium ? "opacity-75" : ""}`}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-yellow-600" />
                  </div>
                  {!isPremium && <Badge className="bg-violet-100 text-violet-700 border-0 text-xs">Premium</Badge>}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Take a Quiz</h3>
                <p className="text-xs text-gray-500">Test your knowledge with AI-generated quizzes</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent notes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Notes</h2>
          <Link href="/saved-notes" className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentNotes.length === 0 ? (
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-8 text-center">
              <BookMarked className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No notes yet. Generate your first note!</p>
              <Link href="/generate" className="mt-3 inline-block">
                <Button size="sm" className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 mt-2">
                  <Sparkles className="w-3 h-3 mr-1.5" />
                  Generate Notes
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {recentNotes.map((note) => (
              <Link key={note.id} href={`/saved-notes/${note.id}`}>
                <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{note.title}</p>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
