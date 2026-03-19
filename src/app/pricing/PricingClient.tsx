"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Razorpay type declarations
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    email: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface PricingClientProps {
  plan: string;
  isLoggedIn: boolean;
}

const freeFeatures = [
  "5 notes per day",
  "Up to 5,000 characters per note",
  "Basic note summarization",
  "Save notes",
];

const premiumFeatures = [
  "Unlimited notes",
  "Flashcard generator",
  "Quiz generator",
  "PDF export",
  "Priority AI generation",
  "All future features",
];

export function PricingClient({ plan, isLoggedIn }: PricingClientProps) {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const isPremium = plan === "premium";

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const { orderId, amount, currency, key } = await response.json();

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      const options = {
        key,
        amount,
        currency,
        order_id: orderId,
        name: "StudyAI",
        description: "Premium Subscription",
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        handler: function (_response: RazorpayResponse) {
          // Payment successful
          toast.success("Payment successful! Your account has been upgraded to Premium.");
          window.location.href = "/dashboard?success=true";
        },
        prefill: {
          email: "", // You might want to get this from user data
        },
        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Upgrade error:", error);
      toast.error("Failed to start upgrade process. Please try again.");
    } finally {
      setIsUpgrading(false);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pricing</h1>
            <p className="text-gray-500 mt-1 text-sm">Manage your subscription</p>
          </div>
        </div>

        {isPremium ? (
          <Card className="border-0 shadow-sm bg-gradient-to-r from-violet-50 to-indigo-50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Premium Plan Active</h2>
              <p className="text-gray-600 mb-6">You have access to all features. Thank you for supporting StudyAI!</p>
              <Badge className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 px-4 py-1">
                Active Subscription
              </Badge>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free */}
            <Card className="border-2 border-gray-200 bg-white">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">Free</CardTitle>
                <p className="text-gray-500 text-sm">Perfect for getting started</p>
                <div className="mt-4">
                  <span className="text-3xl font-extrabold text-gray-900">₹500</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {freeFeatures.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full" disabled>
                  Current Plan
                </Button>
              </CardContent>
            </Card>

            {/* Premium */}
            <Card className="border-2 border-violet-600 bg-gradient-to-br from-violet-600 to-indigo-600 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-yellow-400 text-yellow-900 border-0 text-xs font-bold">POPULAR</Badge>
              </div>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">Premium</CardTitle>
                <p className="text-violet-200 text-sm">For serious students</p>
                <div className="mt-4">
                  <span className="text-3xl font-extrabold">₹500</span>
                  <span className="text-violet-200 ml-1">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {premiumFeatures.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-violet-100">
                      <CheckCircle className="w-4 h-4 text-violet-200 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-white text-violet-700 hover:bg-violet-50 font-semibold"
                  onClick={handleUpgrade}
                  disabled={isUpgrading}
                >
                  {isUpgrading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Upgrade Now"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // Standalone pricing page for non-logged-in users
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-white py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-100">Pricing</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h1>
          <p className="text-lg text-gray-600">Start free, upgrade when you need more.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free */}
          <Card className="border-2 border-gray-200 bg-white">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">Free</CardTitle>
              <p className="text-gray-500 text-sm">Perfect for getting started</p>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-gray-900">$0</span>
                <span className="text-gray-500 ml-1">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                {freeFeatures.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button variant="outline" className="w-full">Get Started Free</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Premium */}
          <Card className="border-2 border-violet-600 bg-gradient-to-br from-violet-600 to-indigo-600 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Badge className="bg-yellow-400 text-yellow-900 border-0 text-xs font-bold">POPULAR</Badge>
            </div>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">Premium</CardTitle>
              <p className="text-violet-200 text-sm">For serious students</p>
              <div className="mt-4">
                <span className="text-3xl font-extrabold">₹500</span>
                <span className="text-violet-200 ml-1">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                {premiumFeatures.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-violet-100">
                    <CheckCircle className="w-4 h-4 text-violet-200 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button className="w-full bg-white text-violet-700 hover:bg-violet-50 font-semibold">
                  Start Premium
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}