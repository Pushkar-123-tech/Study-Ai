"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Brain,
  HelpCircle,
  BookMarked,
  User,
  CreditCard,
  LogOut,
  BookOpen,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/generate", label: "Generate Notes", icon: FileText },
  { href: "/flashcards", label: "Flashcards", icon: Brain },
  { href: "/quiz", label: "Quiz", icon: HelpCircle },
  { href: "/saved-notes", label: "Saved Notes", icon: BookMarked },
  { href: "/account", label: "Account", icon: User },
  { href: "/pricing", label: "Pricing", icon: CreditCard },
];

interface SidebarProps {
  plan?: string;
  onClose?: () => void;
}

export function Sidebar({ plan, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">StudyAI</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 md:hidden">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Plan badge */}
      <div className="px-4 py-3">
        <Badge
          className={cn(
            "text-xs font-semibold",
            plan === "premium"
              ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0"
              : "bg-gray-100 text-gray-600 border-gray-200"
          )}
        >
          {plan === "premium" ? "✦ Premium" : "Free Plan"}
        </Badge>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all",
                active
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm shadow-violet-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
