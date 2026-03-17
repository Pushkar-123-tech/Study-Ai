import { createServiceRoleClient } from "@/lib/supabase-server";

const FREE_DAILY_LIMIT = 5;

export async function checkRateLimit(
  userId: string,
  plan: string
): Promise<{ allowed: boolean; remaining: number; used: number }> {
  if (plan === "premium") {
    return { allowed: true, remaining: Infinity, used: 0 };
  }

  const supabase = await createServiceRoleClient();
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("usage")
    .select("notes_generated")
    .eq("user_id", userId)
    .eq("date", today)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error("Failed to check rate limit");
  }

  const used = data?.notes_generated ?? 0;
  const remaining = Math.max(0, FREE_DAILY_LIMIT - used);

  return {
    allowed: used < FREE_DAILY_LIMIT,
    remaining,
    used,
  };
}

export async function incrementUsage(userId: string): Promise<void> {
  const supabase = await createServiceRoleClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: existing } = await supabase
    .from("usage")
    .select("id, notes_generated")
    .eq("user_id", userId)
    .eq("date", today)
    .single();

  if (existing) {
    await supabase
      .from("usage")
      .update({ notes_generated: existing.notes_generated + 1 })
      .eq("id", existing.id);
  } else {
    await supabase.from("usage").insert({
      user_id: userId,
      notes_generated: 1,
      date: today,
    });
  }
}
