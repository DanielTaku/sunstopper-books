/**
 * AdminLogin.tsx
 * 
 * Admin gateway login page with password authentication.
 * Provides secure access to the admin panel after deployment.
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { Lock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const loginMutation = trpc.adminAuth.login.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      toast.error("Please enter the admin password");
      return;
    }

    setIsLoading(true);

    try {
      await loginMutation.mutateAsync({ password });
      toast.success("Admin access granted!");
      setLocation("/admin");
    } catch (error: any) {
      toast.error(error.message || "Invalid password");
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.15_0.01_60)] via-[oklch(0.2_0.015_65)] to-[oklch(0.25_0.02_70)] flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[oklch(0.72_0.12_75)]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[oklch(0.72_0.12_75)]/5 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 bg-white/95 backdrop-blur-sm border border-[oklch(0.87_0.025_80)] shadow-2xl">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="w-8 h-8 text-[oklch(0.72_0.12_75)]" />
              <h1 className="text-2xl font-bold text-[oklch(0.15_0.01_60)]">
                Sun Stopper
              </h1>
            </div>
            <p className="text-[oklch(0.45_0.03_80)]">Admin Portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-[oklch(0.15_0.01_60)] mb-2">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[oklch(0.55_0.025_80)]" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="pl-10 bg-[oklch(0.97_0.015_85)] border border-[oklch(0.87_0.025_80)] text-[oklch(0.15_0.01_60)] placeholder-[oklch(0.65_0.02_80)] focus:border-[oklch(0.72_0.12_75)] focus:ring-2 focus:ring-[oklch(0.72_0.12_75)]/20"
                  disabled={isLoading}
                  autoFocus
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[oklch(0.72_0.12_75)] hover:bg-[oklch(0.65_0.12_75)] text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Access Admin Panel"}
            </Button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              💡 <strong>Tip:</strong> This admin gateway provides secure access to manage your book library after deployment.
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-[oklch(0.55_0.025_80)]">
              Secure Admin Access
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
