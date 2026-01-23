"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { UserAuthProvider } from "@/contexts/UserAuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <UserAuthProvider>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster position="top-right" />
      </UserAuthProvider>
    </QueryClientProvider>
  );
}
