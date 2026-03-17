"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Brain,
  FileText,
  Zap,
  CheckCircle,
  Star,
  Menu,
  X,
  Sparkles,
  GraduationCap,
  Download,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "AI-Powered Notes",
    description:
      "Paste any study material and get structured, bullet-pointed notes instantly.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Brain,
    title: "Smart Flashcards",
    description:
      "Auto-generate interactive flashcards from your notes to reinforce learning.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Zap,
    title: "Quiz Generator",
    description:
      "Test your knowledge with AI-generated multiple choice quizzes.",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
  },
  {
    icon: Download,
    title: "PDF Export",
    description:
      "Download your notes and flashcards as clean, printable PDFs.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Monitor your study sessions with usage analytics and statistics.",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    icon: GraduationCap,
    title: "Student Friendly",
    description:
      "Designed by students, for students — clean UI and intuitive workflow.",
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
];

const testimonials = [
  {
    name: "Sarah M.",
    role: "Pre-Med Student",
    avatar: "SM",
    text: "StudyAI cut my study prep time in half. I paste my lecture notes and get perfectly structured summaries in seconds.",
    rating: 5,
  },
  {
    name: "James K.",
    role: "Computer Science",
    avatar: "JK",
    text: "The quiz generator is incredible. It actually finds the key concepts and creates challenging questions.",
    rating: 5,
  },
  {
    name: "Priya R.",
    role: "Law Student",
    avatar: "PR",
    text: "I use it every day to prep for exams. The flashcards are spot on and the notes are so well organized.",
    rating: 5,
  },
];

const pricingFree = [
  "5 notes per day",
  "Up to 5,000 characters per note",
  "Basic note summarization",
  "Save notes",
];

const pricingPremium = [
  "Unlimited notes",
  "Flashcard generator",
  "Quiz generator",
  "PDF export",
  "Priority AI generation",
  "All future features",
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">StudyAI</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                Pricing
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                Testimonials
              </a>
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 hover:opacity-90">
                  Start Free
                </Button>
              </Link>
            </div>

            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-3 border-t border-gray-100 pt-4">
            <a href="#features" className="block text-gray-600 hover:text-gray-900 text-sm font-medium">Features</a>
            <a href="#pricing" className="block text-gray-600 hover:text-gray-900 text-sm font-medium">Pricing</a>
            <a href="#testimonials" className="block text-gray-600 hover:text-gray-900 text-sm font-medium">Testimonials</a>
            <div className="flex gap-3 pt-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">Login</Button>
              </Link>
              <Link href="/signup" className="flex-1">
                <Button size="sm" className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0">Start Free</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-indigo-50 to-white pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-violet-200/30 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-100">
            <Sparkles className="w-3 h-3 mr-1" />
            Powered by GPT-4o
          </Badge>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
            Turn Your Study Material
            <br />
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Into Smart Notes
            </span>
            <br />
            with AI
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Paste your study material, upload a PDF, or enter a topic — and let AI
            generate structured notes, interactive flashcards, and quiz questions in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 hover:opacity-90 h-14 px-8 text-base font-semibold shadow-lg shadow-violet-200">
                Start Free — No Credit Card
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-14 px-8 text-base font-semibold">
                Login to Dashboard
              </Button>
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-4">5 free notes per day • No credit card required</p>

          {/* Hero preview card */}
          <div className="mt-16 max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl shadow-gray-200 border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-gray-400 font-mono">StudyAI — Generate Notes</span>
            </div>
            <div className="p-6 text-left">
              <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100">
                <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Input Material</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  The mitochondria is the powerhouse of the cell. It produces ATP through cellular respiration, converting glucose and oxygen into energy...
                </p>
              </div>
              <div className="flex gap-3 mb-4">
                <Button size="sm" className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Generate Notes
                </Button>
              </div>
              <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl p-4 border border-violet-100">
                <p className="text-xs text-violet-600 mb-2 font-semibold uppercase tracking-wide">AI Generated Notes</p>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-800">Mitochondria — Key Concepts</p>
                  <p className="text-xs text-gray-600">• Known as the &quot;powerhouse of the cell&quot;</p>
                  <p className="text-xs text-gray-600">• Produces ATP via cellular respiration</p>
                  <p className="text-xs text-gray-600">• Converts glucose + oxygen → energy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-100">Features</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to study smarter
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              StudyAI combines AI note-generation, flashcards, and quizzes into one seamless workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-700 border-green-200 hover:bg-green-100">How It Works</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Three steps to better studying
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Paste Your Material", desc: "Paste text, upload a PDF, or type a topic you want to learn about." },
              { step: "02", title: "AI Generates Content", desc: "Our GPT-4o powered AI creates structured notes, flashcards, and quiz questions." },
              { step: "03", title: "Study & Export", desc: "Review your materials, test yourself, and export as PDF for offline studying." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-sm">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-100">Pricing</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-gray-600">Start free, upgrade when you need more.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free */}
            <Card className="border-2 border-gray-200 bg-white">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Free</h3>
                <p className="text-gray-500 text-sm mb-6">Perfect for getting started</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">$0</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {pricingFree.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button variant="outline" className="w-full">Get Started Free</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Premium */}
            <Card className="border-2 border-violet-600 bg-gradient-to-br from-violet-600 to-indigo-600 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-yellow-400 text-yellow-900 border-0 text-xs font-bold">POPULAR</Badge>
              </div>
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-1">Premium</h3>
                <p className="text-violet-200 text-sm mb-6">For serious students</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">$5</span>
                  <span className="text-violet-200 ml-1">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {pricingPremium.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-violet-100">
                      <CheckCircle className="w-4 h-4 text-violet-200 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button className="w-full bg-white text-violet-700 hover:bg-violet-50 font-semibold">
                    Start Premium
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-100">Testimonials</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Loved by students worldwide</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">&quot;{t.text}&quot;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-br from-violet-600 to-indigo-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to study smarter?
          </h2>
          <p className="text-violet-200 text-lg mb-8">
            Join thousands of students using StudyAI to ace their exams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-violet-700 hover:bg-violet-50 h-14 px-8 font-semibold">
                Start Free Today
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-14 px-8 font-semibold border-white text-white hover:bg-white/10">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-bold">StudyAI</span>
          </div>
          <p className="text-sm">© 2025 StudyAI. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            <Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
