import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/DashboardShell";
import { DashboardContent } from "./DashboardContent";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [
    { data: profile },
    { data: recentNotes },
    { count: totalNotes },
    { count: totalFlashcards },
    { count: totalQuizzes },
    { data: usageToday }
  ] = await Promise.all([
    supabase.from("users").select("*").eq("id", user.id).single(),
    supabase.from("notes").select("id, title, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
    supabase.from("notes").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("flashcards").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("quizzes").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("usage").select("notes_generated").eq("user_id", user.id).eq("date", new Date().toISOString().split("T")[0]).single(),
  ]);

  const stats = {
    totalNotes: totalNotes ?? 0,
    totalFlashcards: totalFlashcards ?? 0,
    totalQuizzes: totalQuizzes ?? 0,
    usedToday: usageToday?.notes_generated ?? 0,
  };

  return (
    <DashboardShell plan={profile?.plan}>
      <DashboardContent
        user={{ name: profile?.name ?? user.email ?? "Student", email: user.email ?? "", plan: profile?.plan ?? "free" }}
        stats={stats}
        recentNotes={recentNotes ?? []}
      />
    </DashboardShell>
  );
}
