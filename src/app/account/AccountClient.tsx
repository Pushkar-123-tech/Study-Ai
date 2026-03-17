"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Calendar, Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface AccountClientProps {
  user: {
    id: string;
    email: string;
    name?: string | null;
  };
  profile: {
    id: string;
    email: string;
    name: string | null;
    plan: string;
    created_at: string;
  } | null;
}

export function AccountClient({ user, profile }: AccountClientProps) {
  const [name, setName] = useState(profile?.name || "");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({ name })
        .eq("id", user.id);

      if (error) throw error;
      toast.success("Profile updated successfully");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update profile";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  const isPremium = profile?.plan === "premium";

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-500 mt-1 text-sm">Manage your account information and preferences</p>
      </div>

      {/* Profile Information */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="mt-1.5 bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Update Profile
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Account Details */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">Email</span>
            </div>
            <span className="text-sm text-gray-600">{user.email}</span>
          </div>

          <Separator />

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">Member Since</span>
            </div>
            <span className="text-sm text-gray-600">
              {format(new Date(user.created_at), "MMM dd, yyyy")}
            </span>
          </div>

          <Separator />

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Crown className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">Plan</span>
            </div>
            <Badge
              className={
                isPremium
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0"
                  : "bg-gray-100 text-gray-600 border-gray-200"
              }
            >
              {isPremium ? "Premium" : "Free"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Management */}
      {!isPremium && (
        <Card className="border-0 shadow-sm bg-gradient-to-r from-violet-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Crown className="w-6 h-6 text-violet-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Upgrade to Premium</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get unlimited notes, flashcards, quizzes, and PDF export for just $5/month.
                </p>
                <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0">
                  Upgrade Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}