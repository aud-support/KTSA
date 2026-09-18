import { useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router";

const passwordRules = [
  { label: "At least 8 characters",  ok: (v: string) => v.length >= 8 },
  { label: "Uppercase letter",        ok: (v: string) => /[A-Z]/.test(v) },
  { label: "Lowercase letter",        ok: (v: string) => /[a-z]/.test(v) },
  { label: "Number",                  ok: (v: string) => /[0-9]/.test(v) },
  { label: "Special character",       ok: (v: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(v) },
];

type Step = "email" | "reset" | "done";

export function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep]           = useState<Step>("email");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [showCf, setShowCf]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const allRulesMet = passwordRules.every(r => r.ok(password));

  // ── Step 1: verify email exists ──────────────────────────────────────────
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Please enter your email address."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/users/validate-email?email=${encodeURIComponent(email.trim())}`,
      );
      const json = await res.json();
      const exists = json?.data?.valid ?? false;
      if (!exists) {
        setError("No account found with that email address.");
      } else {
        setStep("reset");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: set new password ─────────────────────────────────────────────
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allRulesMet) { setError("Password does not meet all requirements."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), newPassword: password }),
        },
      );
      if (res.ok) {
        setStep("done");
        setTimeout(() => navigate("/"), 2500);
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body.message || "Failed to reset password. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-ktsa-bg flex items-center justify-center px-4">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md bg-black/50 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-8"
      >
        {/* ── Done ── */}
        {step === "done" && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-400" />
            </div>
            <h2 className="text-xl font-black text-ktsa-text mb-2">Password updated!</h2>
            <p className="text-sm text-gray-400">Redirecting you to home…</p>
          </div>
        )}

        {/* ── Step 1: Email ── */}
        {step === "email" && (
          <>
            <Link to="/"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-ktsa-accent transition-colors mb-6">
              <ArrowLeft size={13} /> Back to home
            </Link>
            <h2 className="text-2xl font-black text-ktsa-accent mb-1">Forgot Password?</h2>
            <p className="text-sm text-gray-400 mb-6">Enter your registered email to continue.</p>

            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-ktsa-accent mb-1">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  placeholder="Enter your registered email"
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-lg bg-transparent border border-gray-600 text-white focus:outline-none focus:border-ktsa-primary transition-colors text-sm placeholder:text-gray-600"
                />
                {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-2.5 rounded-lg bg-ktsa-primary/70 text-ktsa-text font-semibold hover:bg-ktsa-primary/60 transition-all disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
                {loading
                  ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  : "Continue"}
              </button>
            </form>
          </>
        )}

        {/* ── Step 2: New password ── */}
        {step === "reset" && (
          <>
            <button onClick={() => { setStep("email"); setError(""); setPassword(""); setConfirm(""); }}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-ktsa-accent transition-colors mb-6">
              <ArrowLeft size={13} /> Change email
            </button>
            <h2 className="text-2xl font-black text-ktsa-accent mb-1">Set New Password</h2>
            <p className="text-sm text-gray-400 mb-1">
              Resetting for <span className="text-ktsa-accent font-semibold">{email}</span>
            </p>
            <p className="text-xs text-gray-500 mb-6">Choose a strong password.</p>

            <form onSubmit={handleResetSubmit} className="space-y-5">
              {/* New password */}
              <div>
                <label className="block text-sm text-ktsa-accent mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(""); }}
                    placeholder="Enter new password"
                    autoFocus
                    className="w-full px-4 py-2.5 pr-10 rounded-lg bg-transparent border border-gray-600 text-white focus:outline-none focus:border-ktsa-primary transition-colors text-sm placeholder:text-gray-600"
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {password && (
                  <ul className="mt-2 space-y-0.5">
                    {passwordRules.map(({ label, ok }) => (
                      <li key={label} className={`text-xs flex items-center gap-1.5 ${ok(password) ? "text-green-400" : "text-gray-500"}`}>
                        <span>{ok(password) ? "✓" : "○"}</span> {label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Confirm */}
              <div>
                <label className="block text-sm text-ktsa-accent mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showCf ? "text" : "password"}
                    value={confirm}
                    onChange={e => { setConfirm(e.target.value); setError(""); }}
                    placeholder="Confirm new password"
                    className={`w-full px-4 py-2.5 pr-10 rounded-lg bg-transparent border text-white focus:outline-none transition-colors text-sm placeholder:text-gray-600
                      ${confirm && confirm !== password ? "border-red-500" : confirm && confirm === password ? "border-green-500" : "border-gray-600 focus:border-ktsa-primary"}`}
                  />
                  <button type="button" onClick={() => setShowCf(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                    {showCf ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirm && password !== confirm && (
                  <p className="mt-1 text-xs text-red-400">Passwords do not match</p>
                )}
                {confirm && password === confirm && (
                  <p className="mt-1 text-xs text-green-400">✓ Passwords match</p>
                )}
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-2.5 rounded-lg bg-ktsa-primary/70 text-ktsa-text font-semibold hover:bg-ktsa-primary/60 transition-all disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
                {loading
                  ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  : "Update Password"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
