import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Lock,
  Trash2,
  Shield,
  Eye,
  EyeOff,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Clock,
  Check,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  userEmail: string;
}

type Section = "menu" | "password" | "delete" | "referee";

// ─── Reusable field error ─────────────────────────────────────────────────────
function FieldError({ msg }: { msg: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-400">{msg}</p>;
}

// ─── Status badge (for referee request) ──────────────────────────────────────
function StatusBadge({ status }: { status: "none" | "pending" | "approved" }) {
  if (status === "none") return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
        status === "pending"
          ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
          : "bg-green-500/10 border-green-500/30 text-green-400"
      }`}
    >
      {status === "pending" ? <Clock size={11} /> : <CheckCircle size={11} />}
      {status === "pending" ? "Request Pending" : "Approved"}
    </span>
  );
}

// ─── Menu item row ────────────────────────────────────────────────────────────
function MenuItem({
  icon: Icon,
  label,
  description,
  onClick,
  danger = false,
  badge,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  onClick: () => void;
  danger?: boolean;
  badge?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-200 group text-left
        ${
          danger
            ? "border-red-500/20 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/40"
            : "border-gray-700/50 bg-white/[0.03] hover:bg-white/[0.06] hover:border-ktsa-accent/30"
        }`}
    >
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
          danger
            ? "bg-red-500/15 text-red-400 group-hover:bg-red-500/25"
            : "bg-ktsa-primary/20 text-ktsa-accent group-hover:bg-ktsa-primary/35"
        }`}
      >
        <Icon size={17} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p
            className={`text-sm font-bold ${danger ? "text-red-400" : "text-white"}`}
          >
            {label}
          </p>
          {badge}
        </div>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
      <ChevronRight
        size={15}
        className={`flex-shrink-0 transition-transform group-hover:translate-x-0.5 ${
          danger ? "text-red-500/50" : "text-gray-600"
        }`}
      />
    </button>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function SettingsModal({
  isOpen,
  onClose,
  userId,
  userEmail,
}: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [section, setSection] = useState<Section>("menu");

  // ── Change Password state ──────────────────────────────────────────────────
  const [pwForm, setPwForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [showPw, setShowPw] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({});
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);

  // ── Delete Account state ───────────────────────────────────────────────────
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Referee Request state ──────────────────────────────────────────────────
  // In real usage, fetch this status from your backend on open
  const [refereeStatus, setRefereeStatus] = useState<
    "none" | "pending" | "approved"
  >("none");
  const [refereeMessage, setRefereeMessage] = useState("");
  const [refereeLoading, setRefereeLoading] = useState(false);
  const [refereeSuccess, setRefereeSuccess] = useState(false);

  // Reset to menu when modal opens
  useEffect(() => {
    if (isOpen) {
      setSection("menu");
      setPwForm({ current: "", next: "", confirm: "" });
      setPwErrors({});
      setPwSuccess(false);
      setDeleteConfirm("");
      setRefereeMessage("");
      setRefereeSuccess(false);
    }
  }, [isOpen]);

  // Close on outside click / Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (e.button === 2) return;
      if (modalRef.current && !modalRef.current.contains(e.target as Node))
        onClose();
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (section !== "menu") setSection("menu");
        else onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, section]);

  // ── Password validation ────────────────────────────────────────────────────
  const validatePassword = () => {
    const errs: Record<string, string> = {};
    if (!pwForm.current) errs.current = "Current password is required";
    if (!pwForm.next) errs.next = "New password is required";
    else if (pwForm.next.length < 8)
      errs.next = "Must be at least 8 characters";
    if (!pwForm.confirm) errs.confirm = "Please confirm your new password";
    else if (pwForm.next !== pwForm.confirm)
      errs.confirm = "Passwords do not match";
    return errs;
  };

  const handleChangePassword = async () => {
    const errs = validatePassword();
    setPwErrors(errs);
    if (Object.keys(errs).length) return;
    setPwLoading(true);
    try {
      // Replace with your actual endpoint
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/users/${userId}/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            currentPassword: pwForm.current,
            newPassword: pwForm.next,
          }),
        },
      );
      if (!res.ok) throw new Error("Failed");
      setPwSuccess(true);
      setTimeout(() => {
        setPwSuccess(false);
        setSection("menu");
      }, 1800);
    } catch {
      setPwErrors({ current: "Incorrect current password" });
    } finally {
      setPwLoading(false);
    }
  };

  // ── Delete account ─────────────────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    if (deleteConfirm !== userEmail) return;
    setDeleteLoading(true);
    try {
      // Replace with your actual endpoint
      await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      localStorage.clear();
      window.dispatchEvent(new Event("auth-change"));
      onClose();
    } catch {
      alert("Failed to delete account. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Referee request ────────────────────────────────────────────────────────
  const handleRefereeRequest = async () => {
    if (!refereeMessage.trim()) return;
    setRefereeLoading(true);
    try {
      // Replace with your actual endpoint
      await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/referee-requests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ userId, message: refereeMessage }),
        },
      );
      setRefereeSuccess(true);
      setRefereeStatus("pending");
      setTimeout(() => {
        setRefereeSuccess(false);
        setSection("menu");
      }, 1800);
    } catch {
      alert("Failed to submit request. Please try again.");
    } finally {
      setRefereeLoading(false);
    }
  };

  if (!isOpen) return null;

  const sectionTitles: Record<Section, string> = {
    menu: "Settings",
    password: "Change Password",
    delete: "Delete Account",
    referee: "Become a Referee",
  };

  return (
    <div className="fixed inset-0 top-20 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs px-4">
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

        {/* Header */}
        <div className="mb-6">
          {section !== "menu" && (
            <button
              onClick={() => setSection("menu")}
              className="flex items-center gap-1 text-xs text-ktsa-accent/70 hover:text-ktsa-accent mb-3 transition-colors"
            >
              <ChevronRight size={13} className="rotate-180" />
              Back
            </button>
          )}
          <h2 className="text-2xl font-bold text-ktsa-accent text-center">
            {sectionTitles[section]}
          </h2>
          {section === "menu" && (
            <p className="text-sm text-gray-400 text-center mt-1">
              Manage your account preferences
            </p>
          )}
        </div>

        <AnimatePresence mode="wait">
          {/* ── Menu ── */}
          {section === "menu" && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <MenuItem
                icon={Lock}
                label="Change Password"
                description="Update your current account password"
                onClick={() => setSection("password")}
              />
              <MenuItem
                icon={Shield}
                label="Become a Referee"
                description="Request admin approval to become an official referee"
                onClick={() => setSection("referee")}
                badge={<StatusBadge status={refereeStatus} />}
              />
              <div className="pt-2 border-t border-gray-800">
                <MenuItem
                  icon={Trash2}
                  label="Delete Account"
                  description="Permanently remove your account and all data"
                  onClick={() => setSection("delete")}
                  danger
                />
              </div>
            </motion.div>
          )}

          {/* ── Change Password ── */}
          {section === "password" && (
            <motion.div
              key="password"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {(
                [
                  { key: "current", label: "Current Password" },
                  { key: "next", label: "New Password" },
                  { key: "confirm", label: "Confirm New Password" },
                ] as const
              ).map(({ key, label }) => (
                <div key={key} className="relative">
                  <label className="block text-sm text-ktsa-accent mb-1">
                    {label}
                  </label>
                  <input
                    type={showPw[key] ? "text" : "password"}
                    value={pwForm[key]}
                    onChange={(e) =>
                      setPwForm((p) => ({ ...p, [key]: e.target.value }))
                    }
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className={`w-full px-4 py-2 pr-10 rounded-lg bg-transparent border text-white placeholder-gray-500 focus:outline-none text-sm transition-colors
                      ${pwErrors[key] ? "border-red-500" : "border-gray-600 focus:border-ktsa-primary"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((p) => ({ ...p, [key]: !p[key] }))}
                    className="absolute right-3 top-8 text-gray-400 hover:text-white"
                  >
                    {showPw[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <FieldError msg={pwErrors[key] ?? ""} />
                </div>
              ))}

              <button
                onClick={handleChangePassword}
                disabled={pwLoading || pwSuccess}
                className={`w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300
                  ${
                    pwSuccess
                      ? "bg-green-500/70 text-white"
                      : "bg-ktsa-primary/70 text-ktsa-text hover:bg-ktsa-primary/60 disabled:opacity-60"
                  }`}
              >
                {pwLoading ? (
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : pwSuccess ? (
                  <>
                    <Check size={15} /> Password Updated!
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </motion.div>
          )}

          {/* ── Delete Account ── */}
          {section === "delete" && (
            <motion.div
              key="delete"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* Warning box */}
              <div className="flex gap-3 p-4 rounded-xl bg-red-500/8 border border-red-500/25">
                <AlertTriangle
                  size={18}
                  className="text-red-400 flex-shrink-0 mt-0.5"
                />
                <div className="text-xs text-red-300/80 leading-relaxed space-y-1">
                  <p className="font-bold text-red-300">
                    This action is permanent
                  </p>
                  <p>
                    Deleting your account will remove all your data, match
                    history, and rankings. This cannot be undone.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm text-ktsa-accent mb-1">
                  Type your email to confirm
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Enter{" "}
                  <span className="text-gray-300 font-mono">{userEmail}</span>{" "}
                  to continue
                </p>
                <input
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder={userEmail}
                  className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-600 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 text-sm transition-colors"
                />
              </div>

              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== userEmail || deleteLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-500/70 text-white font-semibold text-sm hover:bg-red-500/90 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {deleteLoading ? (
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    <Trash2 size={15} /> Delete My Account
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* ── Referee Request ── */}
          {section === "referee" && (
            <motion.div
              key="referee"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {refereeStatus === "approved" ? (
                <div className="flex flex-col items-center py-6 gap-3 text-center">
                  <CheckCircle size={48} className="text-green-400" />
                  <p className="text-white font-bold">
                    You're an approved referee!
                  </p>
                  <p className="text-gray-400 text-sm">
                    Your referee status has been approved by the admin.
                  </p>
                </div>
              ) : refereeStatus === "pending" ? (
                <div className="flex flex-col items-center py-6 gap-3 text-center">
                  <Clock size={48} className="text-yellow-400" />
                  <p className="text-white font-bold">Request under review</p>
                  <p className="text-gray-400 text-sm">
                    Your request has been submitted. The admin will review it
                    shortly.
                  </p>
                  <StatusBadge status="pending" />
                </div>
              ) : (
                <>
                  {/* Info box */}
                  <div className="p-4 rounded-xl bg-ktsa-primary/10 border border-ktsa-accent/20 text-xs text-gray-400 leading-relaxed space-y-1">
                    <p className="font-bold text-ktsa-accent text-sm">
                      About the referee role
                    </p>
                    <p>
                      Referees officiate KTSA matches, ensure fair play, and
                      support tournament operations. Approval is at the
                      discretion of KTSA admins.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm text-ktsa-accent mb-1">
                      Why do you want to become a referee?
                    </label>
                    <textarea
                      value={refereeMessage}
                      onChange={(e) => setRefereeMessage(e.target.value)}
                      placeholder="Tell us about your experience with foosball, your availability, and why you'd like to officiate matches..."
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-ktsa-primary text-sm transition-colors resize-none"
                    />
                    <p className="text-xs text-gray-600 mt-1 text-right">
                      {refereeMessage.length}/500
                    </p>
                  </div>

                  <button
                    onClick={handleRefereeRequest}
                    disabled={
                      !refereeMessage.trim() || refereeLoading || refereeSuccess
                    }
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300
                      ${
                        refereeSuccess
                          ? "bg-green-500/70 text-white"
                          : "bg-ktsa-primary/70 text-ktsa-text hover:bg-ktsa-primary/60 disabled:opacity-40 disabled:cursor-not-allowed"
                      }`}
                  >
                    {refereeLoading ? (
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : refereeSuccess ? (
                      <>
                        <Check size={15} /> Request Submitted!
                      </>
                    ) : (
                      <>
                        <Shield size={15} /> Submit Request
                      </>
                    )}
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
