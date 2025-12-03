"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import AdminSidebar from "@/components/admin/Sidebar";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary size-10 animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-background min-h-screen">
      <AdminSidebar />
      <main
        className={cn(
          "min-h-screen transition-all duration-300",
          "lg:ml-64", // When sidebar is not collapsed
          "pt-16 lg:pt-0", // Top padding for mobile (menu button)
        )}
      >
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
