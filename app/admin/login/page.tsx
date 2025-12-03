"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Home, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAdminLogin } from "@/hooks/useAdminAuth";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const router = useRouter();
  const { login } = useAdminAuth();
  const loginMutation = useAdminLogin();

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          login(data.token, data.user);
          router.push("/admin/dashboard");
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding */}
      <div className="bg-primary hidden lg:flex lg:w-1/2 lg:flex-col lg:items-center lg:justify-center lg:p-12">
        <div className="max-w-md text-center">
          <Link
            href="/"
            className="mb-8 flex items-center justify-center gap-2 text-white"
          >
            <Home className="size-12" />
            <h1 className="text-4xl font-bold">SweetHomes</h1>
          </Link>
          <h2 className="mb-4 font-[family-name:var(--font-gilda)] text-3xl text-white">
            Admin Dashboard
          </h2>
          <p className="text-white/80">
            Manage your hotel operations, rooms, bookings, and more from one
            central location.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-6 text-white/80">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-white/10">
              <svg
                className="size-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <span>Manage Bookings</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-white/10">
              <svg
                className="size-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <span>Room Management</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-white/10">
              <svg
                className="size-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <span>Analytics</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-white/10">
              <svg
                className="size-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span>Revenue Tracking</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="bg-background flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Logo */}
          <Link
            href="/"
            className="text-primary mb-8 flex items-center justify-center gap-2 lg:hidden"
          >
            <Home className="size-8" />
            <h1 className="text-2xl font-bold">SweetHomes</h1>
          </Link>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-foreground mb-2 font-[family-name:var(--font-gilda)] text-3xl">
              Welcome Back
            </h2>
            <p className="text-muted-foreground">
              Sign in to access your admin dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-foreground block text-sm font-medium"
              >
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@sweethomes.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (formErrors.email) {
                    setFormErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                className={`h-12 ${formErrors.email ? "border-destructive" : ""}`}
                disabled={loginMutation.isPending}
              />
              {formErrors.email && (
                <p className="text-destructive text-sm">{formErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-foreground block text-sm font-medium"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (formErrors.password) {
                      setFormErrors((prev) => ({
                        ...prev,
                        password: undefined,
                      }));
                    }
                  }}
                  className={`h-12 pr-12 ${formErrors.password ? "border-destructive" : ""}`}
                  disabled={loginMutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-destructive text-sm">
                  {formErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="h-12 w-full text-base"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 size-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary text-sm hover:underline"
            >
              ← Back to SweetHomes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
