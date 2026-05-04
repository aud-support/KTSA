import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { X, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Close on outside click + disable scroll
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <motion.div
        ref={modalRef}
        initial={{
          opacity: 0,
          y: window.innerWidth < 768 ? 100 : 40,
          scale: window.innerWidth < 768 ? 1 : 0.95,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: window.innerWidth < 768 ? 100 : 40,
        }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 18,
        }}
        className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-8 relative"
      >
        {/* ❌ Close Button */}
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

        {/* Form */}
        <form className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm text-ktsa-accent mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-600 text-white focus:outline-none focus:border-ktsa-primary"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm text-ktsa-accent mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-600 text-white focus:outline-none focus:border-ktsa-primary"
            />

            {/* Toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-ktsa-primary/70 text-ktsa-text font-semibold hover:bg-ktsa-primary/60 hover:cursor-pointer transition-all duration-300"
          >
            Login
          </button>
        </form>

        {/* Forgot Password */}
        <div className="flex justify-end py-2">
          <Link
            to="/forgot-password"
            onClick={onClose}
            className="text-sm text-ktsa-primary hover:underline  hover:text-ktsa-text"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Divider */}
        <div className="my-6 text-center text-gray-400 text-sm">OR</div>

        {/* Register */}
        <p className="text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link
            to="/register"
            onClick={onClose}
            className="text-ktsa-primary hover:underline  hover:text-ktsa-text"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
