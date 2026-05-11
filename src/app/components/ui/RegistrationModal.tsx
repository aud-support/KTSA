import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle, Calendar, MapPin, ChevronDown } from "lucide-react";

interface Tournament {
  id: number;
  title: string;
  date: string;
  location: string;
  status: "Upcoming" | "Live" | "Completed";
  image: string;
  _key?: string;
}

interface Props {
  tournament: Tournament;
  onClose: () => void;
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
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
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

export default function RegistrationModal({ tournament, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    playerName: "",
    email: "",
    phone: "",
    partnerName: "",
    category: "",
    experience: "",
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (e.button === 2) return;
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const setField = (field: string, val: string) => {
    if (field === "state") {
      setForm((prev) => ({ ...prev, state: val, city: "" }));
    } else {
      setForm((prev) => ({ ...prev, [field]: val }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Replace with your actual API call
    await new Promise((r) => setTimeout(r, 1000)); // simulated delay
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="fixed top-20 inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs px-4">
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
        className="w-full max-w-md max-h-[85vh] overflow-y-auto no-scrollbar bg-black/60 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-8 relative"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={22} />
        </button>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Header */}
              <h2 className="text-2xl font-bold text-ktsa-accent text-center mb-1">
                Tournament Registration
              </h2>
              <p className="text-sm text-gray-400 text-center mb-4">
                Fill in your details to register
              </p>

              {/* Tournament Info Card */}
              <div className="mb-6 p-4 rounded-xl border border-ktsa-accent/20 bg-ktsa-primary/10">
                <p className="text-ktsa-accent font-bold text-sm mb-2">
                  {tournament.title}
                </p>
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                  <Calendar size={12} className="text-ktsa-accent" />
                  <span>{tournament.date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <MapPin size={12} className="text-ktsa-accent" />
                  <span>{tournament.location}</span>
                </div>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Category + Experience row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    {/* Category */}
                    <CustomDropdown
                      label="Category"
                      value={form.category}
                      options={[
                        "Open Singles",
                        "Open Doubles",
                        "Women's Singles",
                        "Mixed Doubles",
                      ]}
                      onChange={(val) => setField("category", val)}
                    />
                  </div>
                  <div>
                    {/* Experience */}
                    <CustomDropdown
                      label="Experience"
                      value={form.experience}
                      options={["Beginner", "Intermediate", "Advanced"]}
                      onChange={(val) => setField("experience", val)}
                    />
                  </div>
                </div>
                {/* Player Name */}
                <div>
                  <label className="block text-sm text-ktsa-accent mb-1">
                    Your Full Name
                  </label>
                  <input
                    required
                    name="playerName"
                    value={form.playerName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-ktsa-primary text-sm"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-ktsa-accent mb-1">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-ktsa-primary text-sm"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm text-ktsa-accent mb-1">
                    Phone Number
                  </label>
                  <input
                    required
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-ktsa-primary text-sm"
                  />
                </div>

                {/* Partner Name */}
                <div>
                  <label className="block text-sm text-ktsa-accent mb-1">
                    Partner's Name{" "}
                    <span className="text-gray-500 text-xs">(if doubles)</span>
                  </label>
                  <input
                    name="partnerName"
                    value={form.partnerName}
                    onChange={handleChange}
                    placeholder="Enter partner's name (optional)"
                    className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-ktsa-primary text-sm"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-ktsa-primary/70 text-ktsa-text font-semibold hover:bg-ktsa-primary/60 hover:cursor-pointer transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? "Submitting..." : "Register Now"}
                </button>
              </form>
            </motion.div>
          ) : (
            /* Success State */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.1,
                }}
              >
                <CheckCircle size={64} className="text-ktsa-accent mb-4" />
              </motion.div>
              <h2 className="text-2xl font-bold text-ktsa-accent mb-2">
                Registration Submitted!
              </h2>
              <p className="text-gray-400 text-sm mb-2">
                You've registered for{" "}
                <span className="text-white font-semibold">
                  {tournament.title}
                </span>
              </p>
              <p className="text-gray-500 text-xs mb-8">
                A confirmation will be sent to{" "}
                <span className="text-gray-300">{form.email}</span>
              </p>
              <button
                onClick={onClose}
                className="px-8 py-2.5 rounded-full bg-ktsa-primary/70 text-ktsa-text font-semibold hover:bg-ktsa-primary/60 transition-all duration-300 text-sm"
              >
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
