import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { X, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup?: () => void;
}

// ─── Validation helpers ───────────────────────────────────────────────────────
const validateEmail = (val: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!val) return "Email is required";
  if (!re.test(val)) return "Enter a valid email address";
  return "";
};

const validatePassword = (val: string) => {
  if (!val) return "Password is required";
  return "";
};

function FieldError({ msg }: { msg: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-400">{msg}</p>;
}

export default function LoginModal({
  isOpen,
  onClose,
  onSwitchToSignup,
}: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  const showError = (field: keyof typeof errors) =>
    touched[field] || submitAttempted ? errors[field] : "";

  const markTouched = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (e.button === 2) return;
      if (modalRef.current && !modalRef.current.contains(e.target as Node))
        onClose();
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs px-4">
      <motion.div
        ref={modalRef}
        initial={{
          opacity: 0,
          y: window.innerWidth < 768 ? 100 : 40,
          scale: window.innerWidth < 768 ? 1 : 0.95,
        }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: window.innerWidth < 768 ? 100 : 40 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="w-full max-w-md max-h-[90vh] overflow-y-auto no-scrollbar bg-black/60 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-8 relative"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={22} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-ktsa-accent text-center mb-2">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-400 text-center mb-6">
          Login to your account
        </p>

        <form
          className="space-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            setSubmitAttempted(true);
            setLoginError("");
            if (hasErrors) return;

            setIsLoading(true);
            try {
              const res = await fetch(
                `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/login`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ identifier: email, password }),
                },
              );

              if (!res.ok) {
                setLoginError("Invalid email or password. Please try again.");
                return;
              }
              const response1 = await res.json();
              console.log("Login response:", response1);
              const data = response1.data;

              // ✅ Save token AND user profile
              localStorage.setItem("token", data.token);
              localStorage.setItem(
                "user",
                JSON.stringify({
                  name: data.name,
                  email: data.email,
                  role: data.role,
                  id: data.id,
                  profilePictureUrl: data.profilePictureUrl ?? null,
                }),
              );

              localStorage.setItem("userId", String(data.id));

              // ✅ Notify Navbar (same-tab update)
              window.dispatchEvent(new Event("auth-change"));

              onClose();
            } catch (err) {
              console.error(err);
              setLoginError("Something went wrong. Please try again.");
            } finally {
              setIsLoading(false);
            }
          }}
        >
          {/* Email */}
          <div>
            <label className="block text-sm text-ktsa-accent mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setLoginError(""); }}
              onBlur={() => markTouched("email")}
              placeholder="Enter your email"
              className={`w-full px-4 py-2 rounded-lg bg-transparent border text-white focus:outline-none transition-colors
                ${showError("email") ? "border-red-500 focus:border-red-400" : "border-gray-600 focus:border-ktsa-primary"}`}
            />
            <FieldError msg={showError("email")} />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm text-ktsa-accent mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setLoginError(""); }}
              onBlur={() => markTouched("password")}
              placeholder="Enter your password"
              className={`w-full px-4 py-2 pr-10 rounded-lg bg-transparent border text-white focus:outline-none transition-colors
                ${showError("password") ? "border-red-500 focus:border-red-400" : "border-gray-600 focus:border-ktsa-primary"}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <FieldError msg={showError("password")} />
          </div>

          {/* Inline login error (wrong credentials) */}
          {loginError && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30">
              <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <p className="text-sm text-red-400">{loginError}</p>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded-lg bg-ktsa-primary/70 text-ktsa-text font-semibold hover:bg-ktsa-primary/60 hover:cursor-pointer transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Forgot Password */}
        <div className="flex justify-end py-2">
          <Link
            to="/forgot-password"
            onClick={onClose}
            className="text-sm text-ktsa-primary hover:underline hover:text-ktsa-text"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Divider */}
        <div className="my-6 text-center text-gray-400 text-sm">OR</div>

        {/* Register */}
        <p className="text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => {
              onClose();
              onSwitchToSignup?.();
            }}
            className="text-ktsa-primary hover:underline hover:text-ktsa-text"
          >
            Register
          </button>
        </p>
      </motion.div>
    </div>
  );
}
