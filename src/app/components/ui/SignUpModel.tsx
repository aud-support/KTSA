import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { X, Eye, EyeOff, ChevronDown } from "lucide-react";
import { Link } from "react-router";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const stateCityMap: Record<string, string[]> = {
  Karnataka: ["Bangalore", "Mysore", "Mangalore"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  TamilNadu: ["Chennai", "Coimbatore", "Madurai"],
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS = Array.from({ length: 31 }, (_, i) =>
  String(i + 1).padStart(2, "0"),
);
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => String(currentYear - i));

// ─── Validation helpers ───────────────────────────────────────────────────────
const validateEmail = (val: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!val) return "Email is required";
  if (!re.test(val)) return "Enter a valid email address";
  return "";
};

const validatePhone = (val: string) => {
  if (!val) return "Phone number is required";
  if (!/^\d{10}$/.test(val)) return "Phone number must be exactly 10 digits";
  return "";
};

const validatePassword = (val: string) => {
  if (!val) return "Password is required";
  if (val.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(val)) return "Must contain at least one uppercase letter";
  if (!/[a-z]/.test(val)) return "Must contain at least one lowercase letter";
  if (!/[0-9]/.test(val)) return "Must contain at least one number";
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val))
    return "Must contain at least one special character";
  return "";
};

// ─── Error message component ─────────────────────────────────────────────────
function FieldError({ msg }: { msg: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-400">{msg}</p>;
}

// ─── Reusable Custom Dropdown ────────────────────────────────────────────────
interface DropdownProps {
  label?: string;
  value: string;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  onChange: (val: string) => void;
}

function CustomDropdown({
  label,
  value,
  options,
  placeholder = "Select",
  disabled = false,
  onChange,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {label && (
        <label className="block text-sm text-ktsa-accent mb-1">{label}</label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-4 py-2 rounded-lg border text-sm font-medium transition-colors bg-transparent
          ${
            disabled
              ? "border-gray-700 text-gray-600 cursor-not-allowed opacity-40"
              : "border-gray-600 text-white hover:border-ktsa-primary focus:outline-none"
          }`}
      >
        <span className={value ? "text-white" : "text-gray-500"}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 text-gray-400 flex-shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute top-full mt-1 left-0 z-50 w-full bg-ktsa-bg border border-ktsa-accent/30 rounded-lg overflow-y-auto max-h-48"
          style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                value === opt
                  ? "bg-ktsa-accent/20 text-ktsa-accent"
                  : "text-ktsa-text hover:bg-ktsa-primary/40"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Modal ──────────────────────────────────────────────────────────────
export default function SignupModal({
  isOpen,
  onClose,
  onSwitchToLogin,
}: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    number: "",
    gender: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    state: "",
    city: "",
    password: "",
  });

  // Track which fields have been touched (blurred)
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const markTouched = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  // Compute errors
  const errors = {
    email: validateEmail(form.email),
    number: validatePhone(form.number),
    password: validatePassword(form.password),
  };

  const showError = (field: keyof typeof errors) =>
    touched[field] || submitAttempted ? errors[field] : "";

  const cities = form.state ? (stateCityMap[form.state] ?? []) : [];

  const getDob = () => {
    if (form.dobDay && form.dobMonth && form.dobYear) {
      const monthIndex = String(MONTHS.indexOf(form.dobMonth) + 1).padStart(
        2,
        "0",
      );
      return `${form.dobYear}-${monthIndex}-${form.dobDay}`;
    }
    return "";
  };

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // For number field, allow digits only
    if (name === "number") {
      setForm({ ...form, [name]: value.replace(/\D/g, "").slice(0, 10) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const setField = (field: string, val: string) => {
    if (field === "state") {
      setForm((prev) => ({ ...prev, state: val, city: "" }));
    } else {
      setForm((prev) => ({ ...prev, [field]: val }));
    }
  };

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
        className="w-full max-w-md max-h-[90vh] overflow-y-auto no-scrollbar bg-black/60 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-8 relative"
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
          Create Account
        </h2>
        <p className="text-sm text-gray-400 text-center mb-6">
          Sign up to get started
        </p>

        <form
          className="space-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            setSubmitAttempted(true);
            if (hasErrors) return;

            const payload = {
              name: form.name,
              email: form.email,
              password: form.password,
              phoneNumber: Number(form.number),
              dateOfBirth: getDob(),
              city: form.city,
              state: form.state,
              role: "PLAYER",
              gender: form.gender.toUpperCase(),
            };

            try {
              const res = await fetch(
                `${import.meta.env.VITE_BACKEND_BASE_URL}/api/users`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                },
              );
              const data = await res.json();
              if (!res.ok) throw new Error(data.message || "Signup failed");
              alert("Signup successful!");
              onClose();
            } catch (err) {
              console.error(err);
              alert("Error during signup");
            }
          }}
        >
          {/* Full Name */}
          <div>
            <label className="block text-sm text-ktsa-accent mb-1">
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-600 text-white focus:outline-none focus:border-ktsa-primary"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-ktsa-accent mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={() => markTouched("email")}
              placeholder="Enter your email"
              className={`w-full px-4 py-2 rounded-lg bg-transparent border text-white focus:outline-none transition-colors
                ${showError("email") ? "border-red-500 focus:border-red-400" : "border-gray-600 focus:border-ktsa-primary"}`}
            />
            <FieldError msg={showError("email")} />
          </div>

          {/* Phone — +91 prefix is purely decorative */}
          <div>
            <label className="block text-sm text-ktsa-accent mb-1">Phone</label>
            <div className="flex items-center">
              {/* +91 badge */}
              <span className="flex items-center px-3 py-2 rounded-l-lg border border-r-0 border-gray-600 bg-white/5 text-gray-300 text-sm font-medium select-none whitespace-nowrap">
                +91
              </span>
              <input
                name="number"
                value={form.number}
                onChange={handleChange}
                onBlur={() => markTouched("number")}
                placeholder="10-digit number"
                maxLength={10}
                inputMode="numeric"
                className={`flex-1 px-4 py-2 rounded-r-lg bg-transparent border text-white focus:outline-none transition-colors
                  ${showError("number") ? "border-red-500 focus:border-red-400" : "border-gray-600 focus:border-ktsa-primary"}`}
              />
            </div>
            <FieldError msg={showError("number")} />
          </div>

          {/* Gender */}
          <CustomDropdown
            label="Gender"
            value={form.gender}
            options={["Male", "Female"]}
            onChange={(val) => setField("gender", val)}
          />

          {/* Date of Birth */}
          <div>
            <label className="block text-sm text-ktsa-accent mb-1">
              Date of Birth
            </label>
            <div className="grid grid-cols-3 gap-2">
              <CustomDropdown
                value={form.dobDay}
                options={DAYS}
                placeholder="Day"
                onChange={(val) => setField("dobDay", val)}
              />
              <CustomDropdown
                value={form.dobMonth}
                options={MONTHS}
                placeholder="Month"
                onChange={(val) => setField("dobMonth", val)}
              />
              <CustomDropdown
                value={form.dobYear}
                options={YEARS}
                placeholder="Year"
                onChange={(val) => setField("dobYear", val)}
              />
            </div>
          </div>

          {/* State + City */}
          <div className="grid grid-cols-2 gap-3">
            <CustomDropdown
              label="State"
              value={form.state}
              options={Object.keys(stateCityMap)}
              onChange={(val) => setField("state", val)}
            />
            <CustomDropdown
              label="City"
              value={form.city}
              options={cities}
              disabled={!form.state}
              onChange={(val) => setField("city", val)}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm text-ktsa-accent mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
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
            {/* Password strength hints */}
            {form.password && (
              <ul className="mt-2 space-y-0.5">
                {[
                  {
                    label: "At least 8 characters",
                    ok: form.password.length >= 8,
                  },
                  {
                    label: "Uppercase letter",
                    ok: /[A-Z]/.test(form.password),
                  },
                  {
                    label: "Lowercase letter",
                    ok: /[a-z]/.test(form.password),
                  },
                  { label: "Number", ok: /[0-9]/.test(form.password) },
                  {
                    label: "Special character",
                    ok: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
                      form.password,
                    ),
                  },
                ].map(({ label, ok }) => (
                  <li
                    key={label}
                    className={`text-xs flex items-center gap-1.5 ${ok ? "text-green-400" : "text-gray-500"}`}
                  >
                    <span>{ok ? "✓" : "○"}</span> {label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-ktsa-primary/70 text-ktsa-text font-semibold hover:bg-ktsa-primary/60 hover:cursor-pointer transition-all duration-300"
          >
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 text-center text-gray-400 text-sm">OR</div>

        {/* Switch to Login */}
        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            onClick={() => {
              onClose();
              onSwitchToLogin();
            }}
            className="text-ktsa-primary hover:underline hover:text-ktsa-text"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
