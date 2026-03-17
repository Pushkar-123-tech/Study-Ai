import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/DashboardShell";
import { SavedNotesClient } from "./SavedNotesClient";

export default async function SavedNotesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [
    { data: profile },
    { data: notes }
  ] = await Promise.all([
    supabase.from("users").select("plan").eq("id", user.id).single(),
    supabase.from("notes").select("id, title, summary, created_at").eq("user_id", user.id).order("created_at", { ascending: false })
  ]);

  return (
    <DashboardShell plan={profile?.plan ?? "free"}>
      <SavedNotesClient initialNotes={notes ?? []} />
    </DashboardShell>
  );
}
