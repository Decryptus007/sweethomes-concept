import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { Providers } from "@/lib/providers";
import { Toaster } from "react-hot-toast";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <AdminAuthProvider>{children}</AdminAuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </Providers>
  );
}
