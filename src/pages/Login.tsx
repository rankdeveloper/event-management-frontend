import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../authStore";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginFormSchema } from "@/lib/schema";
import { Calendar, LogIn, Users } from "lucide-react";

export default function Login() {
  const { signIn, signInAsGuest } = useAuthStore();
  const navigate = useNavigate();

  type FormData = z.infer<typeof loginFormSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(loginFormSchema), mode: "all" });

  const onSubmit = async (data: FormData) => {
    try {
      await signIn(data.email, data.password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to login");
    }
  };

  const loginGuest = async () => {
    try {
      await signInAsGuest();
      toast.success("Signed in as Guest");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to login as Guest");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 flex-col justify-between p-12 text-white">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-white/20 p-2 rounded-lg">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight">Evenza</span>
        </Link>
        <div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Manage events<br />like a pro.
          </h2>
          <p className="text-indigo-200 text-lg leading-relaxed">
            Create, manage, and track your events with ease. Join thousands of organizers who trust Evenza.
          </p>
          <div className="flex items-center gap-3 mt-8">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-9 w-9 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center">
                  <Users className="h-4 w-4 text-white/70" />
                </div>
              ))}
            </div>
            <p className="text-indigo-200 text-sm">Join 10,000+ event organizers</p>
          </div>
        </div>
        <p className="text-indigo-300 text-sm">© 2025 Evenza. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Evenza</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
              <p className="text-gray-500 text-sm mt-1">Sign in to your account to continue</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.email ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:bg-white"
                  }`}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                </div>
                <input
                  type="password"
                  autoComplete="current-password"
                  {...register("password")}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.password ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:bg-white"
                  }`}
                />
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <LogIn className="h-4 w-4" />
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs text-gray-400 bg-white px-2">or</div>
            </div>

            <button
              onClick={loginGuest}
              className="w-full py-2.5 px-4 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Continue as Guest
            </button>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-600 font-medium hover:text-indigo-700">
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
