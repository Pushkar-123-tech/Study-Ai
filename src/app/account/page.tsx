import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/DashboardShell";
import { AccountClient } from "./AccountClient";

export default async function AccountPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single();

  return (
    <DashboardShell plan={profile?.plan}>
      <AccountClient user={user} profile={profile} />
    </DashboardShell>
  );
}