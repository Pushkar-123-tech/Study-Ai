import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/DashboardShell";
import { GenerateNotesClient } from "./GenerateNotesClient";

export default async function GeneratePage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [
    { data: profile },
    { data: usageToday }
  ] = await Promise.all([
    supabase.from("users").select("plan").eq("id", user.id).single(),
    supabase
      .from("usage")
      .select("notes_generated")
      .eq("user_id", user.id)
      .eq("date", new Date().toISOString().split("T")[0])
      .single()
  ]);

  return (
    <DashboardShell plan={profile?.plan}>
      <GenerateNotesClient
        plan={profile?.plan ?? "free"}
        usedToday={usageToday?.notes_generated ?? 0}
      />
    </DashboardShell>
  );
}
