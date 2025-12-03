"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AdminUser } from "@/types/admin";
import { adminApiClient } from "@/lib/api";

interface AdminAuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: AdminUser) => void;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined,
);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("admin_token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await adminApiClient.get<AdminUser>("/user/me");

        // Verify user is admin
        if (response.data.role !== "admin") {
          localStorage.removeItem("admin_token");
          setUser(null);
        } else {
          setUser(response.data);
          queryClient.setQueryData(["admin", "user"], response.data);
        }
      } catch {
        // Token is invalid or expired
        localStorage.removeItem("admin_token");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [queryClient]);

  const login = useCallback((token: string, userData: AdminUser) => {
    localStorage.setItem("admin_token", token);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await adminApiClient.post("/admin/logout");
      toast.success("Logged out successfully");
    } catch (error) {
      // Even if the API call fails, we still want to clear local state
      console.error("Logout API error:", error);
      toast.error("Logout completed locally");
    } finally {
      // Always clear local state regardless of API response
      localStorage.removeItem("admin_token");
      setUser(null);
      queryClient.removeQueries({ queryKey: ["admin"] });
      router.push("/admin/login");
    }
  }, [queryClient, router]);

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
