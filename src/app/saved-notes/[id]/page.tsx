import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect, notFound } from "next/navigation";
import { DashboardShell } from "@/components/DashboardShell";
import { NoteDetailClient } from "./NoteDetailClient";

export default async function NoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("plan").eq("id", user.id).single();
  const { data: note } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!note) notFound();

  return (
    <DashboardShell plan={profile?.plan}>
      <NoteDetailClient note={note} plan={profile?.plan ?? "free"} />
    </DashboardShell>
  );
}
