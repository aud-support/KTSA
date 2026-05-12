import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Pencil,
  Check,
  ChevronDown,
} from "lucide-react";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phoneNumber: number;
  gender: string;
  dateOfBirth: string | null;
  city: string;
  state: string;
  role: string;
  createdAt: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

// ─── Reusable Custom Dropdown (copied from SignupModal) ───────────────────────
interface DropdownProps {
  label?: string;
  value: string;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  onChange: (val: string) => void;
}

const stateCityMap: Record<string, string[]> = {
  Karnataka: ["Bangalore", "Mysore", "Mangalore"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  TamilNadu: ["Chennai", "Coimbatore", "Madurai"],
};

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

// ─── Info Row (read-only display) ─────────────────────────────────────────────
function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-lg border border-gray-700/50 bg-white/[0.03]">
      <Icon size={16} className="text-ktsa-primary mt-0.5 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-ktsa-accent mb-0.5">{label}</p>
        <p className="text-sm text-white font-medium truncate">
          {value || <span className="text-gray-500 font-normal">Not set</span>}
        </p>
      </div>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function ProfileModal({ isOpen, onClose, userId }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Edit form state — populated once user is fetched
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    gender: "",
    state: "",
    city: "",
  });

  // ── Fetch user on open ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !userId) return;
    setLoading(true);
    setError("");
    setEditMode(false);

    fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/users/${userId}`)
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) throw new Error(json.message || "Failed to load");
        const u: UserProfile = json.data;
        setUser(u);
        setForm({
          name: u.name ?? "",
          phoneNumber: u.phoneNumber ? String(u.phoneNumber) : "",
          gender: u.gender
            ? u.gender.charAt(0).toUpperCase() + u.gender.slice(1).toLowerCase()
            : "",
          state: u.state ?? "",
          city: u.city ?? "",
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [isOpen, userId]);

  // ── Close on outside click ────────────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (e.button === 2) return;
      if (modalRef.current && !modalRef.current.contains(e.target as Node))
        onClose();
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // ── Save handler ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        phoneNumber: Number(form.phoneNumber),
        gender: form.gender.toUpperCase(),
        state: form.state,
        city: form.city,
      };

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/users/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      // Reflect updated values locally
      setUser((prev) =>
        prev
          ? {
              ...prev,
              name: form.name,
              phoneNumber: Number(form.phoneNumber),
              gender: form.gender.toUpperCase(),
              state: form.state,
              city: form.city,
            }
          : prev,
      );

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setEditMode(false);
      }, 1200);
    } catch (err: any) {
      alert(err.message || "Error saving changes");
    } finally {
      setSaving(false);
    }
  };

  const cities = form.state ? (stateCityMap[form.state] ?? []) : [];

  const formatDate = (iso: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatJoined = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  if (!isOpen) return null;

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
          My Profile
        </h2>
        <p className="text-sm text-gray-400 text-center mb-6">
          {user
            ? `Member since ${formatJoined(user.createdAt)}`
            : "Loading your details…"}
        </p>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="w-8 h-8 rounded-full border-2 border-ktsa-primary border-t-transparent animate-spin" />
            <p className="text-sm text-gray-400">Fetching profile…</p>
          </div>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <div className="py-10 text-center">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={() => setUser(null)}
              className="mt-4 text-xs text-ktsa-primary underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* ── Content ── */}
        {!loading && !error && user && (
          <div className="space-y-5">
            {/* Avatar + name */}
            <div className="flex flex-col items-center gap-3 mb-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-ktsa-primary to-ktsa-accent flex items-center justify-center text-ktsa-text font-bold text-xl shadow-md shadow-ktsa-accent/30">
                {initials}
              </div>
              {!editMode ? (
                <div className="text-center">
                  <p className="text-white font-bold text-lg">{user.name}</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-ktsa-primary/20 border border-ktsa-primary/30 text-ktsa-primary text-xs font-semibold tracking-wide">
                    {user.role}
                  </span>
                </div>
              ) : (
                <div className="w-full">
                  <label className="block text-sm text-ktsa-accent mb-1">
                    Full Name
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="Full name"
                    className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-600 text-white focus:outline-none focus:border-ktsa-primary"
                  />
                </div>
              )}
            </div>

            {/* Read-only fields */}
            {!editMode ? (
              <div className="space-y-2.5">
                <InfoRow icon={Mail} label="Email" value={user.email} />
                <InfoRow
                  icon={Phone}
                  label="Phone"
                  value={user.phoneNumber ? `+91 ${user.phoneNumber}` : ""}
                />
                <InfoRow
                  icon={User}
                  label="Gender"
                  value={
                    user.gender
                      ? user.gender.charAt(0) +
                        user.gender.slice(1).toLowerCase()
                      : ""
                  }
                />
                <InfoRow
                  icon={Calendar}
                  label="Date of Birth"
                  value={formatDate(user.dateOfBirth)}
                />
                <InfoRow
                  icon={MapPin}
                  label="Location"
                  value={
                    user.city && user.state
                      ? `${user.city}, ${user.state}`
                      : user.city || user.state || ""
                  }
                />
                <InfoRow icon={Shield} label="Role" value={user.role} />
              </div>
            ) : (
              /* ── Edit fields ── */
              <div className="space-y-5">
                {/* Phone */}
                <div>
                  <label className="block text-sm text-ktsa-accent mb-1">
                    Phone
                  </label>
                  <div className="flex items-center">
                    <span className="flex items-center px-3 py-2 rounded-l-lg border border-r-0 border-gray-600 bg-white/5 text-gray-300 text-sm font-medium select-none whitespace-nowrap">
                      +91
                    </span>
                    <input
                      value={form.phoneNumber}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          phoneNumber: e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10),
                        }))
                      }
                      placeholder="10-digit number"
                      maxLength={10}
                      inputMode="numeric"
                      className="flex-1 px-4 py-2 rounded-r-lg bg-transparent border border-gray-600 text-white focus:outline-none focus:border-ktsa-primary"
                    />
                  </div>
                </div>

                {/* Gender */}
                <CustomDropdown
                  label="Gender"
                  value={form.gender}
                  options={["Male", "Female", "Other"]}
                  onChange={(val) => setForm((p) => ({ ...p, gender: val }))}
                />

                {/* State + City */}
                <div className="grid grid-cols-2 gap-3">
                  <CustomDropdown
                    label="State"
                    value={form.state}
                    options={Object.keys(stateCityMap)}
                    onChange={(val) =>
                      setForm((p) => ({ ...p, state: val, city: "" }))
                    }
                  />
                  <CustomDropdown
                    label="City"
                    value={form.city}
                    options={cities}
                    disabled={!form.state}
                    onChange={(val) => setForm((p) => ({ ...p, city: val }))}
                  />
                </div>

                {/* Read-only reminder */}
                <p className="text-xs text-gray-500 text-center">
                  Email and date of birth cannot be changed.
                </p>
              </div>
            )}

            {/* ── Action buttons ── */}
            <div className="pt-1 space-y-2">
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-ktsa-primary/70 text-ktsa-text font-semibold hover:bg-ktsa-primary/60 hover:cursor-pointer transition-all duration-300"
                >
                  <Pencil size={15} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex-1 py-2 rounded-lg border border-gray-600 text-gray-300 font-semibold hover:border-gray-400 hover:text-white transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || saveSuccess}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold transition-all duration-300
                      ${
                        saveSuccess
                          ? "bg-green-500/70 text-white"
                          : "bg-ktsa-primary/70 text-ktsa-text hover:bg-ktsa-primary/60 hover:cursor-pointer"
                      }`}
                  >
                    {saving ? (
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : saveSuccess ? (
                      <>
                        <Check size={15} /> Saved!
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
