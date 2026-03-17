import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/DashboardShell";
import { FlashcardsClient } from "./FlashcardsClient";

export default async function FlashcardsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("plan").eq("id", user.id).single();
  const plan = profile?.plan ?? "free";

  let flashcards: Array<{ id: string; question: string; answer: string; created_at: string; note_id: string | null }> = [];
  if (plan === "premium") {
    const { data } = await supabase
      .from("flashcards")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    flashcards = data ?? [];
  }

  return (
    <DashboardShell plan={plan}>
      <FlashcardsClient plan={plan} initialFlashcards={flashcards} />
    </DashboardShell>
  );
}
