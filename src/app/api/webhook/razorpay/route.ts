import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { razorpay } from "@/lib/razorpay";
import { headers } from "next/headers";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = (await headers()).get("x-razorpay-signature");

    // Verify Razorpay webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Webhook signature verification failed");
      return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
    }

    const event = JSON.parse(body);
    const supabase = await createServerSupabaseClient();

    switch (event.event) {
      case "payment.captured": {
        const payment = event.payload.payment.entity;
        const orderId = payment.order_id;

        // Get order details to find user ID
        const order = await razorpay.orders.fetch(orderId);
        const userId = order.notes?.userId;

        if (userId) {
          // Update user plan to premium
          await supabase
            .from("users")
            .update({ plan: "premium" })
            .eq("id", userId);
        }
        break;
      }

      case "subscription.activated": {
        const subscription = event.payload.subscription.entity;
        const userId = subscription.notes?.userId;

        if (userId) {
          await supabase
            .from("users")
            .update({ plan: "premium" })
            .eq("id", userId);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}