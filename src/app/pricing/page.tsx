import { createServerSupabaseClient } from "@/lib/supabase-server";
import { DashboardShell } from "@/components/DashboardShell";
import { PricingClient } from "./PricingClient";

export default async function PricingPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  let plan = "free";
  if (user) {
    const { data: profile } = await supabase.from("users").select("plan").eq("id", user.id).single();
    plan = profile?.plan ?? "free";
  }

  if (!user) {
    // Show pricing as standalone (not in dashboard)
    return <PricingClient plan={plan} isLoggedIn={false} />;
  }

  return (
    <DashboardShell plan={plan}>
      <PricingClient plan={plan} isLoggedIn={true} />
    </DashboardShell>
  );
}
