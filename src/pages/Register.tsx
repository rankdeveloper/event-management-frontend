import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../authStore";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerFormSchema } from "@/lib/schema";
import { Calendar, UserPlus, Sparkles } from "lucide-react";

export default function Register() {
  type FormData = z.infer<typeof registerFormSchema>;
  const navigate = useNavigate();
  const { signUp } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(registerFormSchema),
    mode: "all",
  });

  const onSubmit = async (data: FormData) => {
    try {
      await signUp(data.email, data.password, data.username);
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to register",
      );
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 flex-col justify-between p-12 text-white">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-white/20 p-2 rounded-lg">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight">Evenza</span>
        </Link>
        <div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Start organizing
            <br />
            amazing events.
          </h2>
          <p className="text-indigo-200 text-lg leading-relaxed">
            Create your free account and start managing events in minutes. No
            credit card required.
          </p>
          <div className="mt-8 space-y-3">
            {[
              "Free to get started",
              "Unlimited event creation",
              "Real-time attendee tracking",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-indigo-100">
                <Sparkles className="h-4 w-4 text-indigo-300" />
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-indigo-300 text-sm">
          © 2025 Evenza. All rights reserved.
        </p>
      </div>

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
              <h1 className="text-2xl font-bold text-gray-900">
                Create your account
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Get started for free, no credit card needed
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  {...register("username")}
                  placeholder="johndoe"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.username
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 bg-gray-50 focus:bg-white"
                  }`}
                />
                {errors.username && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.email
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 bg-gray-50 focus:bg-white"
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  {...register("password")}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.password
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 bg-gray-50 focus:bg-white"
                  }`}
                />
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 font-medium hover:text-indigo-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
