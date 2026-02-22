import React, { useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface LoginProps {
  onSetPassword: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSetPassword }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestName, setRequestName] = useState("");
  const [requestEmail, setRequestEmail] = useState("");
  const [requestRole, setRequestRole] = useState("Technician");
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: window.location.origin,
    });

    if (error) {
      setForgotError(error.message);
    } else {
      setForgotSuccess(true);
    }
    setForgotLoading(false);
  };

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestError(null);
    setRequestLoading(true);

    const { error } = await supabase
        .from('pending_invites')
        .insert({
          email: requestEmail,
          full_name: requestName,
          role: requestRole,
        });

    if (error) {
      setRequestError(error.message);
    } else {
      setRequestSuccess(true);
    }
    setRequestLoading(false);
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
          <h2 className="text-xl font-semibold text-white mb-8">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 px-3 py-2 rounded">
                  {error}
                </div>
            )}

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
                  onClick={() => { setShowForgotModal(true); setForgotSuccess(false); setForgotError(null); }}
              >
                Forgot Password?
              </button>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2F6BFF] hover:bg-[#4d82ff] text-white font-bold py-3 rounded transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Log In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5">
            <button
                type="button"
                className="w-full text-center text-sm text-[#2F6BFF] hover:text-[#4d82ff] transition-colors py-2"
                onClick={onSetPassword}
            >
              Have an invite code? Set up your account →
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 text-center">
            <p className="text-sm text-[#9AA4B2]">
              Don&apos;t have an account?{" "}
              <button
                  type="button"
                  className="text-[#2F6BFF] hover:underline"
                  onClick={() => { setShowRequestModal(true); setRequestSuccess(false); setRequestError(null); }}
              >
                Request Access
              </button>
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-12 flex space-x-6">
          <button className="text-xs text-[#9AA4B2] hover:text-[#E6EAF2] transition-colors">Privacy Policy</button>
          <button className="text-xs text-[#9AA4B2] hover:text-[#E6EAF2] transition-colors">Support</button>
          <button className="text-xs text-[#9AA4B2] hover:text-[#E6EAF2] transition-colors">Terms of Service</button>
        </div>

        <p className="relative z-10 mt-4 text-[10px] text-[#9AA4B2]/50">
          &copy; {new Date().getFullYear()} OMP. All rights reserved.
        </p>

        {/* Forgot Password Modal */}
        {showForgotModal && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center" onClick={() => setShowForgotModal(false)}>
              <div className="bg-[#111826] border border-white/10 rounded-lg shadow-2xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-semibold text-white mb-1">Reset Password</h3>
                <p className="text-sm text-[#9AA4B2] mb-5">Enter your email and we'll send you a reset code.</p>

                {forgotSuccess ? (
                    <div className="text-center py-4">
                      <div className="text-green-400 text-4xl mb-3">✓</div>
                      <div className="text-white font-medium mb-1">Code Sent</div>
                      <div className="text-sm text-[#9AA4B2] mb-4">Check your email for the reset code, then click below to enter it.</div>
                      <button
                          className="text-sm bg-[#2F6BFF] hover:bg-[#4d82ff] text-white font-bold px-6 py-2 rounded transition-colors"
                          onClick={() => {
                            setShowForgotModal(false);
                            onSetPassword();
                          }}
                      >
                        Enter Reset Code
                      </button>
                    </div>
                ) : (
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      {forgotError && (
                          <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-3 py-2 rounded">
                            {forgotError}
                          </div>
                      )}

                      <div>
                        <input
                            type="email"
                            required
                            value={forgotEmail}
                            onChange={e => setForgotEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full bg-[#0B0F14] border border-white/10 rounded px-3 py-2 text-[#E6EAF2] placeholder-[#9AA4B2] focus:outline-none focus:border-[#2F6BFF] transition-colors text-sm"
                            autoFocus
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setShowForgotModal(false)}
                            className="flex-1 border border-white/10 text-[#9AA4B2] hover:text-white rounded py-2 text-sm transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={forgotLoading}
                            className="flex-1 bg-[#2F6BFF] hover:bg-[#4d82ff] text-white font-bold py-2 rounded text-sm transition-colors disabled:opacity-60"
                        >
                          {forgotLoading ? "Sending…" : "Send Code"}
                        </button>
                      </div>
                    </form>
                )}
              </div>
            </div>
        )}

        {/* Request Access Modal */}
        {showRequestModal && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center" onClick={() => setShowRequestModal(false)}>
              <div className="bg-[#111826] border border-white/10 rounded-lg shadow-2xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-semibold text-white mb-1">Request Access</h3>
                <p className="text-sm text-[#9AA4B2] mb-5">An administrator will review your request and send you an invite.</p>

                {requestSuccess ? (
                    <div className="text-center py-4">
                      <div className="text-green-400 text-4xl mb-3">✓</div>
                      <div className="text-white font-medium mb-1">Request Sent</div>
                      <div className="text-sm text-[#9AA4B2] mb-4">You'll receive an email once your account is approved.</div>
                      <button
                          className="text-sm text-[#2F6BFF] hover:underline"
                          onClick={() => setShowRequestModal(false)}
                      >
                        Back to Login
                      </button>
                    </div>
                ) : (
                    <form onSubmit={handleRequestAccess} className="space-y-4">
                      {requestError && (
                          <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-3 py-2 rounded">
                            {requestError}
                          </div>
                      )}

                      <div>
                        <label className="text-xs text-[#9AA4B2] uppercase font-semibold block mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            value={requestName}
                            onChange={e => setRequestName(e.target.value)}
                            placeholder="Your full name"
                            className="w-full bg-[#0B0F14] border border-white/10 rounded px-3 py-2 text-[#E6EAF2] placeholder-[#9AA4B2] focus:outline-none focus:border-[#2F6BFF] transition-colors text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-[#9AA4B2] uppercase font-semibold block mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={requestEmail}
                            onChange={e => setRequestEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full bg-[#0B0F14] border border-white/10 rounded px-3 py-2 text-[#E6EAF2] placeholder-[#9AA4B2] focus:outline-none focus:border-[#2F6BFF] transition-colors text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-[#9AA4B2] uppercase font-semibold block mb-1">Role</label>
                        <select
                            value={requestRole}
                            onChange={e => setRequestRole(e.target.value)}
                            className="w-full bg-[#0B0F14] border border-white/10 rounded px-3 py-2 text-[#E6EAF2] focus:outline-none focus:border-[#2F6BFF] transition-colors text-sm"
                        >
                          <option value="Technician">Technician</option>
                          <option value="Manager">Manager</option>
                          <option value="Admin">Admin</option>
                          <option value="Viewer">Viewer</option>
                        </select>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setShowRequestModal(false)}
                            className="flex-1 border border-white/10 text-[#9AA4B2] hover:text-white rounded py-2 text-sm transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={requestLoading}
                            className="flex-1 bg-[#2F6BFF] hover:bg-[#4d82ff] text-white font-bold py-2 rounded text-sm transition-colors disabled:opacity-60"
                        >
                          {requestLoading ? "Sending…" : "Send Request"}
                        </button>
                      </div>
                    </form>
                )}
              </div>
            </div>
        )}
      </div>
  );
};