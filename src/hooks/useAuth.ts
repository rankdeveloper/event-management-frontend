import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../authStore";
import toast from "react-hot-toast";

interface UseAuthOptions {
  requireAuth?: boolean;
  preventGuests?: boolean;
  redirectTo?: string;
  guestMessage?: string;
}

export function useAuth({
  requireAuth = true,
  preventGuests = false,
  redirectTo = "/dashboard",
  guestMessage = "Guest users cannot access this page. Please create an account.",
}: UseAuthOptions = {}) {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (requireAuth && !user) {
      toast.error("Please login to access this page");
      navigate("/login");
      return;
    }

    if (preventGuests && user?.isGuest) {
      toast.error(guestMessage);
      navigate(redirectTo);
      return;
    }
  }, [user, requireAuth, preventGuests, redirectTo, guestMessage, navigate]);

  return {
    user,
    isAuthenticated: !!user,
    isGuest: user?.isGuest || false,
    canAccess: requireAuth ? !!user && !(preventGuests && user.isGuest) : true,
  };
}
