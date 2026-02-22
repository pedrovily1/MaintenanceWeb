import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail, KeyRound } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SetPasswordScreenProps {
  onComplete: () => void;
}

export const SetPasswordScreen: React.FC<SetPasswordScreenProps> = ({ onComplete }) => {
  // Step 1: OTP verification, Step 2: Set password
  const [step, setStep] = useState<"otp" | "password">("otp");

  // OTP fields
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpType, setOtpType] = useState<"invite" | "recovery">("invite");

  // Password fields
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!otpCode.trim()) {
      setError("Please enter the confirmation code from your email");
      return;
    }

    setLoading(true);

    try {
      console.log("[SetPassword] Verifying OTP:", { email, type: otpType, tokenLength: otpCode.length });

      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otpCode.trim(),
        type: otpType,
      });

      console.log("[SetPassword] OTP verification result:", { data, error: verifyError });

      if (verifyError) {
        throw verifyError;
      }

      if (data?.session) {
        console.log("[SetPassword] OTP verified — session established, moving to password step");
        setStep("password");
      } else {
        setError("Verification succeeded but no session was created. Please try again.");
      }
    } catch (err: any) {
      console.error("[SetPassword] OTP verification error:", err);
      if (err.message?.includes("otp_expired") || err.message?.includes("expired")) {
        setError("Code has expired. Please request a new invite.");
      } else if (err.message?.includes("otp_disabled")) {
        setError("Verification is not enabled. Contact your administrator.");
      } else {
        setError(err.message || "Invalid code. Please check and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      console.log("[SetPassword] Setting password...");

      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        throw updateError;
      }

      console.log("[SetPassword] Password set successfully");
      onComplete();
    } catch (err: any) {
      console.error("[SetPassword] Error setting password:", err);
      setError(err.message || "Failed to set password. Please try again.");
      setLoading(false);
    }
  };

  return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0B0F14] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#111826] to-[#0B0F14] z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] z-0 pointer-events-none" />

        <div className="relative z-10 mb-8 flex flex-col items-center">
          <div className="relative translate-x-16">
            <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full" />
            <img src="/logo.svg" alt="OMP Logo" className="h-20 w-90 relative z-5" />
          </div>
        </div>

        <div className="relative z-10 w-full max-w-[400px] bg-[#111826] border border-white/10 rounded-lg shadow-2xl p-8 mx-4">

          {step === "otp" ? (
              <>
                <h2 className="text-xl font-semibold text-white mb-2">Welcome</h2>
                <p className="text-sm text-[#9AA4B2] mb-8">
                  Enter your email and the confirmation code from your invite email.
                </p>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  {error && (
                      <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 px-3 py-2 rounded">
                        {error}
                      </div>
                  )}

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9AA4B2]" />
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#0B0F14] border border-white/10 rounded px-10 py-3 text-[#E6EAF2] placeholder-[#9AA4B2] focus:outline-none focus:border-[#2F6BFF] transition-colors"
                        required
                        autoFocus
                    />
                  </div>

                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9AA4B2]" />
                    <input
                        type="text"
                        placeholder="Confirmation code"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-[#0B0F14] border border-white/10 rounded px-10 py-3 text-[#E6EAF2] placeholder-[#9AA4B2] focus:outline-none focus:border-[#2F6BFF] transition-colors tracking-widest text-center text-lg"
                        required
                        maxLength={8}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                    />
                  </div>

                  {/* Toggle for recovery vs invite — hidden by default, shows if user needs it */}
                  <div className="flex items-center justify-center gap-4 text-xs">
                    <button
                        type="button"
                        onClick={() => setOtpType("invite")}
                        className={`px-3 py-1 rounded transition-colors ${
                            otpType === "invite"
                                ? "bg-[#2F6BFF]/20 text-[#2F6BFF] border border-[#2F6BFF]/30"
                                : "text-[#9AA4B2] hover:text-[#E6EAF2]"
                        }`}
                    >
                      New Account
                    </button>
                    <button
                        type="button"
                        onClick={() => setOtpType("recovery")}
                        className={`px-3 py-1 rounded transition-colors ${
                            otpType === "recovery"
                                ? "bg-[#2F6BFF]/20 text-[#2F6BFF] border border-[#2F6BFF]/30"
                                : "text-[#9AA4B2] hover:text-[#E6EAF2]"
                        }`}
                    >
                      Password Reset
                    </button>
                  </div>

                  <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#2F6BFF] hover:bg-[#4d82ff] text-white font-bold py-3 rounded transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-60"
                  >
                    {loading ? "Verifying..." : "Verify Code"}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-white/5 text-center">
                  <p className="text-xs text-[#9AA4B2]">
                    Check your email for a confirmation code. It may take a few minutes.
                  </p>
                </div>
              </>
          ) : (
              <>
                <h2 className="text-xl font-semibold text-white mb-2">Set Your Password</h2>
                <p className="text-sm text-[#9AA4B2] mb-8">
                  Create a password for your account
                </p>

                <form onSubmit={handleSetPassword} className="space-y-6">
                  {error && (
                      <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 px-3 py-2 rounded">
                        {error}
                      </div>
                  )}

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9AA4B2]" />
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password (min. 8 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#0B0F14] border border-white/10 rounded px-10 py-3 text-[#E6EAF2] placeholder-[#9AA4B2] focus:outline-none focus:border-[#2F6BFF] transition-colors"
                        required
                        minLength={8}
                        autoFocus
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA4B2] hover:text-[#E6EAF2] transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9AA4B2]" />
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-[#0B0F14] border border-white/10 rounded px-10 py-3 text-[#E6EAF2] placeholder-[#9AA4B2] focus:outline-none focus:border-[#2F6BFF] transition-colors"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA4B2] hover:text-[#E6EAF2] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#2F6BFF] hover:bg-[#4d82ff] text-white font-bold py-3 rounded transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-60"
                  >
                    {loading ? "Setting password..." : "Set Password"}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-white/5 text-center">
                  <p className="text-xs text-[#9AA4B2]">
                    This is a one-time setup. You'll use this password to log in from now on.
                  </p>
                </div>
              </>
          )}
        </div>

        <p className="relative z-10 mt-12 text-[10px] text-[#9AA4B2]/50">
          &copy; {new Date().getFullYear()} OMP. All rights reserved.
        </p>
      </div>
  );
};