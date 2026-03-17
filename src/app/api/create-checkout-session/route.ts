import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { razorpay, RAZORPAY_PLANS } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: RAZORPAY_PLANS.monthly.price, // Amount in paisa
      currency: RAZORPAY_PLANS.monthly.currency,
      receipt: `receipt_${user.id}_${Date.now()}`,
      notes: {
        userId: user.id,
        plan: "premium_monthly",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}