import React, { useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        shouldCreateUser: false,
      },
    });

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0B0F14] overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#111826] to-[#0B0F14] z-0" />

        {/* Subtle radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] z-0 pointer-events-none" />

        {/* Logo Area */}
        <div className="relative z-10 mb-8 flex flex-col items-center">
          <div className="relative translate-x-16">
            <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full" />
            <img src="/logo.svg" alt="OMP Logo" className="h-20 w-90 relative z-5" />
          </div>
        </div>

        {/* Login Card */}
        <div className="relative z-10 w-full max-w-[400px] bg-[#111826] border border-white/10 rounded-lg shadow-2xl p-8 mx-4">
          <h2 className="text-xl font-semibold text-white mb-8">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 px-3 py-2 rounded">
                  {error}
                </div>
            )}

            {/* Email */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9AA4B2]" />
              <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0B0F14] border border-white/10 rounded px-10 py-3 text-[#E6EAF2] placeholder-[#9AA4B2] focus:outline-none focus:border-[#2F6BFF] transition-colors"
                  required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9AA4B2]" />
              <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0B0F14] border border-white/10 rounded px-10 py-3 text-[#E6EAF2] placeholder-[#9AA4B2] focus:outline-none focus:border-[#2F6BFF] transition-colors"
                  required
              />
              <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA4B2] hover:text-[#E6EAF2] transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="w-4 h-4 bg-[#0B0F14] border-white/10 rounded accent-[#2F6BFF]"
                />
                <span className="text-sm text-[#9AA4B2] group-hover:text-[#E6EAF2] transition-colors">
                Remember Me
              </span>
              </label>
              <button
                  type="button"
                  className="text-sm text-[#9AA4B2] hover:text-[#2F6BFF] transition-colors"
                  onClick={() => alert("Password reset coming soon")}
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2F6BFF] hover:bg-[#4d82ff] text-white font-bold py-3 rounded transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Log In"}
            </button>
          </form>

          {/* Signup */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-[#9AA4B2]">
              Don&apos;t have an account?{" "}
              <button
                  type="button"
                  className="text-[#2F6BFF] hover:underline"
                  onClick={() => alert("Contact administrator to create an account")}
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="relative z-10 mt-12 flex space-x-6">
          <button className="text-xs text-[#9AA4B2] hover:text-[#E6EAF2] transition-colors">
            Privacy Policy
          </button>
          <button className="text-xs text-[#9AA4B2] hover:text-[#E6EAF2] transition-colors">
            Support
          </button>
          <button className="text-xs text-[#9AA4B2] hover:text-[#E6EAF2] transition-colors">
            Terms of Service
          </button>
        </div>

        <p className="relative z-10 mt-4 text-[10px] text-[#9AA4B2]/50">
          &copy; {new Date().getFullYear()} OMP. All rights reserved.
        </p>
      </div>
  );
};