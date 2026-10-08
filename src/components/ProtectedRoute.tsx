import { ReactNode, useEffect, useRef } from "react";
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
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (loading || hasTriggeredRef.current) return;

    if (requireAuth && !user) {
      hasTriggeredRef.current = true;
      toast.error("Please login to access this page");
      navigate("/login", { replace: true });
      return;
    }

    if (preventGuests && user?.isGuest) {
      hasTriggeredRef.current = true;
      toast.error(guestMessage);
      navigate(redirectTo, { replace: true });
    }
  }, [
    user,
    loading,
    requireAuth,
    preventGuests,
    redirectTo,
    guestMessage,
    navigate,
  ]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-gray-500">
        Loading...
      </div>
    );
  }

  if (requireAuth && !user) {
    return null;
  }

  if (preventGuests && user?.isGuest) {
    return null;
  }

  return <>{children}</>;
}
