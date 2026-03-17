import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/DashboardShell";
import { QuizClient } from "./QuizClient";

export default async function QuizPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("plan").eq("id", user.id).single();
  const plan = profile?.plan ?? "free";

  let quizzes: Array<{
    id: string; question: string; option_a: string; option_b: string;
    option_c: string; option_d: string; correct_answer: string; created_at: string; note_id: string | null;
  }> = [];
  if (plan === "premium") {
    const { data } = await supabase
      .from("quizzes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    quizzes = data ?? [];
  }

  return (
    <DashboardShell plan={plan}>
      <QuizClient plan={plan} initialQuizzes={quizzes} />
    </DashboardShell>
  );
}
