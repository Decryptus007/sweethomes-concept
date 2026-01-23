"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { userLogin } from "@/lib/api";
import { useUserAuth } from "@/hooks/useUserAuth";
import toast from "react-hot-toast";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useUserAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await userLogin({
        email: formData.email,
        password: formData.password,
      });

      login(response.data.token, response.data.user);
      toast.success("Logged in successfully!");

      // Reset form
      setFormData({ email: "", password: "" });
      onClose();
    } catch (error: unknown) {
      console.error("Login error:", error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          toast.error(axiosError.response.data.message);
        } else {
          toast.error("Login failed. Please check your credentials.");
        }
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ email: "", password: "" });
      setShowPassword(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader className="text-center">
          <DialogTitle>Welcome Back</DialogTitle>
          <DialogDescription>
            Sign in to your SweetHomes account
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset disabled={isSubmitting} className="space-y-4">
            {isSubmitting && (
              <div className="bg-accent/50 absolute inset-0 z-10 flex items-center justify-center rounded-lg">
                <div className="bg-background flex items-center gap-3 rounded-lg px-4 py-2 shadow-lg">
                  <div className="border-primary size-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                  <span className="text-foreground text-sm font-medium">
                    Signing in...
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-foreground block text-sm font-medium"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="your@email.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-foreground block text-sm font-medium"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, password: e.target.value }))
                  }
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-blue-800 text-sm">
                💡 <strong>Tip:</strong> If you booked with us before, use your email as both username and password.
              </p>
            </div>
          </fieldset>

          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full"
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}