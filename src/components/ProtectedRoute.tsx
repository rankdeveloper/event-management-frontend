import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../authStore";
import toast from "react-hot-toast";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  preventGuests?: boolean;
  redirectTo?: string;
  guestMessage?: string;
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  preventGuests = false,
  redirectTo = "/dashboard",
  guestMessage = "Guest users cannot access this page. Please create an account.",
}: ProtectedRouteProps) {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user needs to be authenticated
    if (requireAuth && !user) {
      toast.error("Please login to access this page");
      navigate("/login");
      return;
    }

    // Check if guest users are prevented
    if (preventGuests && user?.isGuest) {
      toast.error(guestMessage);
      navigate(redirectTo);
      return;
    }
  }, [user, requireAuth, preventGuests, redirectTo, guestMessage, navigate]);

  // Show loading or return null while checking
  if (requireAuth && !user) {
    return null;
  }

  if (preventGuests && user?.isGuest) {
    return null;
  }

  return <>{children}</>;
}
