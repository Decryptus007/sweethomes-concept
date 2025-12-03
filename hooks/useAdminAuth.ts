import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/api";
import type {
  AdminLoginPayload,
  AdminLoginResponse,
  AdminUser,
} from "@/types/admin";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

// Admin Login
export const useAdminLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AdminLoginResponse,
    AxiosError<{ message: string }>,
    AdminLoginPayload
  >({
    mutationFn: async (payload) => {
      const formData = new FormData();
      formData.append("email", payload.email);
      formData.append("password", payload.password);

      const response = await adminApiClient.post<AdminLoginResponse>(
        "/admin/login",
        formData,
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Store the token
      localStorage.setItem("admin_token", data.token);
      // Cache the user data
      queryClient.setQueryData(["admin", "user"], data.user);
      toast.success(`Welcome back, ${data.user.name.split(" ")[0]}!`);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    },
  });
};

// Get Current Admin User
export const useAdminUser = () => {
  return useQuery<AdminUser, AxiosError<{ message: string }>>({
    queryKey: ["admin", "user"],
    queryFn: async () => {
      const response = await adminApiClient.get<AdminUser>("/user/me");
      return response.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Admin Logout (handled by AdminAuthContext now)
// Keeping this for potential future use or removal
export const useAdminLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Clear the token
      localStorage.removeItem("admin_token");
      // Clear all admin-related queries
      queryClient.removeQueries({ queryKey: ["admin"] });
      return true;
    },
  });
};
