import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  CheckCircle,
  Calendar,
  MapPin,
  LogIn,
  UserPlus,
  Loader2,
  CheckSquare,
  Square,
  Users,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  Search,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

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
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

interface AuthUser {
  name: string;
  email: string;
  phone?: string;
}

function useCurrentUser(): { user: AuthUser | null; loading: boolean } {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const readUser = () => {
    try {
      const raw = localStorage.getItem("user");
      setUser(raw ? (JSON.parse(raw) as AuthUser) : null);
    } catch {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    readUser();
    window.addEventListener("auth-change", readUser);
    return () => window.removeEventListener("auth-change", readUser);
  }, []);

  return { user, loading };
}

// ─── Category config ──────────────────────────────────────────────────────────
const ALL_CATEGORIES = [
  { id: "Open Singles", label: "Open Singles", doubles: false },
  { id: "Open Doubles", label: "Open Doubles", doubles: true },
  { id: "Women's Singles", label: "Women's Singles", doubles: false },
  { id: "Mixed Doubles", label: "Mixed Doubles", doubles: true },
] as const;

type CategoryId = (typeof ALL_CATEGORIES)[number]["id"];

// ─── Auth Gate ────────────────────────────────────────────────────────────────
function AuthGate({
  tournament,
  onLoginClick,
  onSignupClick,
}: {
  tournament: Tournament;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}) {
  return (
    <motion.div
      key="auth-gate"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center text-center pt-2"
    >
      <div className="w-16 h-16 rounded-full bg-ktsa-primary/20 border border-ktsa-accent/30 flex items-center justify-center mb-5">
        <LogIn size={28} className="text-ktsa-accent" />
      </div>
      <h2 className="text-2xl font-bold text-ktsa-accent mb-2">
        Sign In to Register
      </h2>
      <p className="text-gray-400 text-sm mb-5 max-w-xs">
        You need to be logged in to register for a tournament. Your details will
        be auto-filled once you sign in.
      </p>
      <div className="w-full mb-7 p-4 rounded-xl border border-ktsa-accent/20 bg-ktsa-primary/10 text-left">
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
      <div className="w-full space-y-3">
        <button
          onClick={onLoginClick}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-ktsa-primary/70 text-ktsa-text font-semibold hover:bg-ktsa-primary/60 hover:cursor-pointer transition-all duration-300 text-sm"
        >
          <LogIn size={15} />
          Log In
        </button>
        <button
          onClick={onSignupClick}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-transparent border border-ktsa-accent/40 text-ktsa-accent font-semibold hover:bg-ktsa-accent/10 hover:cursor-pointer transition-all duration-300 text-sm"
        >
          <UserPlus size={15} />
          Create an Account
        </button>
      </div>
      <p className="text-gray-600 text-xs mt-5">
        Your registration spot will be held while you sign in.
      </p>
    </motion.div>
  );
}

// ─── Main Modal ──────────────────────────────────────────────────────────────
export default function RegistrationModal({
  tournament,
  onClose,
  onLoginClick,
  onSignupClick,
}: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useCurrentUser();

  // ── Form state ──
  const [playerName, setPlayerName] = useState("");
  const [email, setEmail] = useState("");

  // Multi-select categories
  const [selectedCategories, setSelectedCategories] = useState<Set<CategoryId>>(
    new Set()
  );

  // Partner toggle — shown when any doubles category is selected
  const [hasPartner, setHasPartner] = useState(false);

  // Partner / team fields
  const [partnerEmail, setPartnerEmail] = useState("");
  const [partnerEmailError, setPartnerEmailError] = useState("");
  const [partnerEmailValid, setPartnerEmailValid] = useState<boolean | null>(null);
  const [partnerEmailChecking, setPartnerEmailChecking] = useState(false);
  const [existingTeamForPair, setExistingTeamForPair] = useState<{ teamId: number; teamName: string } | null>(null);
  const [teamName, setTeamName] = useState("");
  const [teamNameError, setTeamNameError] = useState("");

  // Existing team toggle & search
  const [hasExistingTeam, setHasExistingTeam] = useState(false);
  const [teamSearchQuery, setTeamSearchQuery] = useState("");
  const [teamSearchResults, setTeamSearchResults] = useState<{ teamId: number; teamName: string }[]>([]);
  const [teamSearchLoading, setTeamSearchLoading] = useState(false);
  const [teamSearchOpen, setTeamSearchOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<{ teamId: number; teamName: string } | null>(null);
  const teamSearchRef = useRef<HTMLDivElement>(null);
  const teamDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Need a partner toggle & role preference
  const [needPartner, setNeedPartner] = useState(false);
  const [rolePreference, setRolePreference] = useState<"Defender" | "Attacker" | "All-rounder" | "">("");

  // Helper: reset all three doubles sub-states
  const resetDoublesState = () => {
    setHasPartner(false);
    setPartnerEmail("");
    setPartnerEmailError("");
    setPartnerEmailValid(null);
    setExistingTeamForPair(null);
    setTeamName("");
    setTeamNameError("");
    setHasExistingTeam(false);
    setTeamSearchQuery("");
    setTeamSearchResults([]);
    setSelectedTeam(null);
    setNeedPartner(false);
    setRolePreference("");
  };

  // Auto-fill from auth
  useEffect(() => {
    if (user) {
      setPlayerName(user.name ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

  // Close on outside click / Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (e.button === 2) return;
      if (modalRef.current && !modalRef.current.contains(e.target as Node))
        onClose();
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

  // ── Derived state ──
  const hasDoublesSelected = ALL_CATEGORIES.some(
    (c) => c.doubles && selectedCategories.has(c.id)
  );

  // When all doubles are deselected, reset all doubles sub-state
  useEffect(() => {
    if (!hasDoublesSelected) {
      resetDoublesState();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasDoublesSelected]);

  // ── Category checkbox toggle ──
  const toggleCategory = (id: CategoryId) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ── Partner email validation (on blur / Enter) ──
  const validatePartnerEmail = useCallback(async (emailVal: string) => {
    if (!emailVal.trim()) {
      setPartnerEmailError("Partner email is required");
      setPartnerEmailValid(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) {
      setPartnerEmailError("Enter a valid email address");
      setPartnerEmailValid(false);
      return;
    }
    if (emailVal.toLowerCase() === email.toLowerCase()) {
      setPartnerEmailError("You cannot register with yourself as a partner");
      setPartnerEmailValid(false);
      return;
    }
    setPartnerEmailChecking(true);
    setPartnerEmailError("");
    setExistingTeamForPair(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/users/validate-email?email=${encodeURIComponent(emailVal)}`
      );
      const data = await res.json();
      if (data?.data?.valid) {
        setPartnerEmailValid(true);
        setPartnerEmailError("");

        // Check if these two players already have a team together
        try {
          const teamRes = await fetch(
            `${import.meta.env.VITE_BACKEND_BASE_URL}/api/team/by-players?p1=${encodeURIComponent(email)}&p2=${encodeURIComponent(emailVal)}`
          );
          const teamData = await teamRes.json();
          if (teamData?.data) {
            setExistingTeamForPair(teamData.data); // { teamId, teamName, ... }
          } else {
            setExistingTeamForPair(null);
          }
        } catch {
          setExistingTeamForPair(null);
        }
      } else {
        setPartnerEmailValid(false);
        setPartnerEmailError("This email is not a registered player");
      }
    } catch {
      setPartnerEmailValid(false);
      setPartnerEmailError("Could not verify email. Try again.");
    } finally {
      setPartnerEmailChecking(false);
    }
  }, [email]);

  // Close team search dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (teamSearchRef.current && !teamSearchRef.current.contains(e.target as Node)) {
        setTeamSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced team search
  const handleTeamSearchChange = (val: string) => {
    setTeamSearchQuery(val);
    if (selectedTeam) setSelectedTeam(null);
    if (teamDebounceRef.current) clearTimeout(teamDebounceRef.current);
    if (val.trim().length < 1) {
      setTeamSearchResults([]);
      setTeamSearchOpen(false);
      return;
    }
    teamDebounceRef.current = setTimeout(async () => {
      setTeamSearchLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/team/search?q=${encodeURIComponent(val)}`
        );
        const data = await res.json();
        setTeamSearchResults(data?.data ?? []);
        setTeamSearchOpen(true);
      } catch {
        setTeamSearchResults([]);
      } finally {
        setTeamSearchLoading(false);
      }
    }, 300);
  };

  // ── Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCategories.size === 0) {
      toast.error("Please select at least one category");
      return;
    }

    const doubleCategories = ALL_CATEGORIES.filter(
      (c) => c.doubles && selectedCategories.has(c.id)
    );

    // Validate partner fields if doubles selected with partner
    if (doubleCategories.length > 0 && hasPartner) {
      if (!partnerEmailValid) {
        toast.error("Please enter a valid partner email");
        return;
      }
      if (doubleCategories.length > 1) {
        toast.error(
          "A team can only enter one doubles category per tournament. Please select a single doubles category."
        );
        return;
      }
    }

    // Validate existing team — also limited to one doubles category
    if (doubleCategories.length > 0 && hasExistingTeam) {
      if (!selectedTeam) {
        toast.error("Please select a team from the search results");
        return;
      }
      if (doubleCategories.length > 1) {
        toast.error(
          "A team can only enter one doubles category per tournament. Please select a single doubles category."
        );
        return;
      }
    }

    // Validate need-partner role preference
    if (doubleCategories.length > 0 && needPartner && !rolePreference) {
      toast.error("Please select your role preference");
      return;
    }

    setLoading(true);

    const BASE = import.meta.env.VITE_BACKEND_BASE_URL;
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const requests: Promise<Response>[] = [];

      for (const cat of selectedCategories) {
        const catConfig = ALL_CATEGORIES.find((c) => c.id === cat)!;

        if (catConfig.doubles && hasExistingTeam && selectedTeam) {
          // Register with an existing team
          requests.push(
            fetch(`${BASE}/api/registration/double/existing-team/${tournament.id}`, {
              method: "POST",
              headers,
              body: JSON.stringify({
                existingTeamId: selectedTeam.teamId,
                category: cat,
              }),
            })
          );
        } else if (catConfig.doubles && hasPartner) {
          // Register with a new partner
          requests.push(
            fetch(`${BASE}/api/registration/double/${tournament.id}`, {
              method: "POST",
              headers,
              body: JSON.stringify({
                playerOneEmail: email,
                playerTwoEmail: partnerEmail,
                category: cat,
                teamName: teamName.trim(),
              }),
            })
          );
        } else if (catConfig.doubles && needPartner) {
          // Free-agent: looking for a partner
          requests.push(
            fetch(`${BASE}/api/registration/double/need-partner/${tournament.id}`, {
              method: "POST",
              headers,
              body: JSON.stringify({
                playerOneEmail: email,
                category: cat,
                partnerPreference: rolePreference,
              }),
            })
          );
        } else {
          // Single registration
          requests.push(
            fetch(`${BASE}/api/registration/single/${tournament.id}`, {
              method: "POST",
              headers,
              body: JSON.stringify({
                playerOneEmail: email,
                category: cat,
              }),
            })
          );
        }
      }

      const responses = await Promise.all(requests);

      // Pair each response with its category for meaningful error messages
      const categories = Array.from(selectedCategories);
      const results = await Promise.all(
        responses.map(async (res, i) => ({
          category: categories[i],
          ok: res.ok,
          data: await res.json().catch(() => ({})),
        }))
      );

      const failed = results.filter((r) => !r.ok);

      if (failed.length > 0) {
        if (failed.length === 1) {
          // Single failure — show the exact backend message
          const msg = failed[0].data?.message || "Registration failed. Please try again.";
          toast.error(msg);
        } else {
          // Multiple failures — show each category's error separately
          failed.forEach((f) => {
            const msg = f.data?.message || "Registration failed";
            toast.error(`${f.category}: ${msg}`);
          });
        }

        // If some succeeded, still show partial success
        const succeeded = results.filter((r) => r.ok);
        if (succeeded.length > 0) {
          toast.success(
            `Registered for: ${succeeded.map((s) => s.category).join(", ")}`
          );
          setSubmitted(true);
        }
        return;
      }

      setSubmitted(true);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
          {/* ── 1. Auth loading ── */}
          {authLoading && (
            <motion.div
              key="auth-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 gap-4"
            >
              <Loader2 size={32} className="text-ktsa-accent animate-spin" />
              <p className="text-gray-400 text-sm">Checking your session…</p>
            </motion.div>
          )}

          {/* ── 2. Not logged in ── */}
          {!authLoading && !user && (
            <AuthGate
              tournament={tournament}
              onLoginClick={onLoginClick}
              onSignupClick={onSignupClick}
            />
          )}

          {/* ── 3. Registration form ── */}
          {!authLoading && user && !submitted && (
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

              {/* Auto-fill notice */}
              <div className="mb-4 px-3 py-2 rounded-lg bg-ktsa-accent/10 border border-ktsa-accent/25 flex items-center gap-2">
                <CheckCircle size={13} className="text-ktsa-accent flex-shrink-0" />
                <p className="text-xs text-ktsa-accent/80">
                  Details auto-filled from your account
                </p>
              </div>

              {/* Tournament Info */}
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
                {/* ── Category Checkboxes ── */}
                <div>
                  <label className="block text-sm text-ktsa-accent mb-2">
                    Category{" "}
                    <span className="text-gray-500 text-xs font-normal">
                      (select all that apply)
                    </span>
                  </label>
                  <div className="space-y-2">
                    {ALL_CATEGORIES.map((cat) => {
                      const checked = selectedCategories.has(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategory(cat.id)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 text-left
                            ${
                              checked
                                ? "border-ktsa-accent/60 bg-ktsa-accent/10 text-white"
                                : "border-gray-700 bg-transparent text-gray-400 hover:border-gray-500 hover:text-gray-200"
                            }`}
                        >
                          {checked ? (
                            <CheckSquare size={16} className="text-ktsa-accent flex-shrink-0" />
                          ) : (
                            <Square size={16} className="text-gray-600 flex-shrink-0" />
                          )}
                          <span>{cat.label}</span>
                          {cat.doubles && (
                            <span className="ml-auto text-xs text-gray-500 font-normal">
                              Doubles
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── Player Name ── */}
                <div>
                  <label className="block text-sm text-ktsa-accent mb-1">
                    Your Full Name
                  </label>
                  <input
                    required
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-ktsa-primary text-sm"
                  />
                </div>

                {/* ── Email ── */}
                <div>
                  <label className="block text-sm text-ktsa-accent mb-1">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-ktsa-primary text-sm"
                  />
                </div>

                {/* ── Have a Partner? / Have a Team? / Need a Partner? Toggles — only when doubles selected ── */}
                {hasDoublesSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    {/* ── Toggle row: Have a Partner? ── */}
                    <div className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-colors
                      ${hasPartner ? "border-ktsa-accent/40 bg-ktsa-primary/10" : "border-gray-700 bg-transparent"}`}>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-ktsa-accent" />
                        <span className="text-sm font-medium text-white">Have a Partner?</span>
                      </div>
                      <button
                        type="button"
                        aria-label="Toggle have partner"
                        onClick={() => {
                          if (hasPartner) {
                            resetDoublesState();
                          } else {
                            resetDoublesState();
                            setHasPartner(true);
                          }
                        }}
                      >
                        {hasPartner
                          ? <ToggleRight size={28} className="text-ktsa-accent" />
                          : <ToggleLeft size={28} className="text-gray-500" />}
                      </button>
                    </div>

                    {/* Partner fields */}
                    {hasPartner && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4 pl-1"
                      >
                        {/* Partner Email */}
                        <div>
                          <label className="block text-sm text-ktsa-accent mb-1">
                            Partner's Email
                          </label>
                          <div className="relative">
                            <input
                              required
                              type="email"
                              value={partnerEmail}
                              onChange={(e) => {
                                setPartnerEmail(e.target.value);
                                setPartnerEmailValid(null);
                                setPartnerEmailError("");
                                setExistingTeamForPair(null);
                              }}
                              onBlur={() => validatePartnerEmail(partnerEmail)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  validatePartnerEmail(partnerEmail);
                                }
                              }}
                              placeholder="Enter partner's email"
                              className={`w-full px-4 py-2 pr-9 rounded-lg bg-transparent border text-white placeholder-gray-500 focus:outline-none text-sm transition-colors
                                ${partnerEmailValid === true ? "border-green-500" : partnerEmailValid === false ? "border-red-500" : "border-gray-600 focus:border-ktsa-primary"}`}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              {partnerEmailChecking && <Loader2 size={14} className="text-gray-400 animate-spin" />}
                              {!partnerEmailChecking && partnerEmailValid === true && <CheckCircle size={14} className="text-green-500" />}
                              {!partnerEmailChecking && partnerEmailValid === false && <AlertCircle size={14} className="text-red-500" />}
                            </div>
                          </div>
                          {partnerEmailError && <p className="text-xs text-red-400 mt-1">{partnerEmailError}</p>}
                          {partnerEmailValid === true && !existingTeamForPair && (
                            <p className="text-xs text-green-400 mt-1">Valid registered player ✓</p>
                          )}
                        </div>

                        {/* Existing team banner — shown when pair already has a team */}
                        {existingTeamForPair && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-green-500/10 border border-green-500/30"
                          >
                            <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-green-400 font-medium">
                                Existing team found: "{existingTeamForPair.teamName}"
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                Your team will be used automatically — no need to enter a name.
                              </p>
                            </div>
                          </motion.div>
                        )}

                        {/* Team Name — only shown when no existing team for this pair */}
                        {!existingTeamForPair && (
                          <div>
                            <label className="block text-sm text-ktsa-accent mb-1">
                              Team Name{" "}
                              <span className="text-gray-500 text-xs font-normal">(optional)</span>
                            </label>
                            <input
                              type="text"
                              value={teamName}
                              onChange={(e) => { setTeamName(e.target.value); setTeamNameError(""); }}
                              placeholder="Leave blank to auto-generate from player names"
                              className={`w-full px-4 py-2 rounded-lg bg-transparent border text-white placeholder-gray-500 focus:outline-none text-sm transition-colors
                                ${teamNameError ? "border-red-500" : "border-gray-600 focus:border-ktsa-primary"}`}
                            />
                            {teamNameError && <p className="text-xs text-red-400 mt-1">{teamNameError}</p>}
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* ── Toggle row: Have a Team? ── */}
                    <div className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-colors
                      ${hasExistingTeam ? "border-ktsa-accent/40 bg-ktsa-primary/10" : "border-gray-700 bg-transparent"}`}>
                      <div className="flex items-center gap-2">
                        <Shield size={16} className="text-ktsa-accent" />
                        <span className="text-sm font-medium text-white">Have a Team?</span>
                      </div>
                      <button
                        type="button"
                        aria-label="Toggle have team"
                        onClick={() => {
                          if (hasExistingTeam) {
                            resetDoublesState();
                          } else {
                            resetDoublesState();
                            setHasExistingTeam(true);
                          }
                        }}
                      >
                        {hasExistingTeam
                          ? <ToggleRight size={28} className="text-ktsa-accent" />
                          : <ToggleLeft size={28} className="text-gray-500" />}
                      </button>
                    </div>

                    {/* Team search field */}
                    {hasExistingTeam && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pl-1"
                      >
                        <label className="block text-sm text-ktsa-accent mb-1">Search Team</label>
                        <div ref={teamSearchRef} className="relative">
                          <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            <input
                              type="text"
                              value={selectedTeam ? selectedTeam.teamName : teamSearchQuery}
                              onChange={(e) => {
                                if (selectedTeam) setSelectedTeam(null);
                                handleTeamSearchChange(e.target.value);
                              }}
                              onFocus={() => { if (teamSearchResults.length > 0) setTeamSearchOpen(true); }}
                              placeholder="Enter team name to search..."
                              className={`w-full pl-9 pr-8 py-2 rounded-lg bg-transparent border text-white placeholder-gray-500 focus:outline-none text-sm transition-colors
                                ${selectedTeam ? "border-green-500" : "border-gray-600 focus:border-ktsa-primary"}`}
                            />
                            {teamSearchLoading && (
                              <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
                            )}
                            {selectedTeam && (
                              <button
                                type="button"
                                onClick={() => { setSelectedTeam(null); setTeamSearchQuery(""); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                              >
                                <X size={14} />
                              </button>
                            )}
                          </div>

                          {/* Dropdown */}
                          {teamSearchOpen && !selectedTeam && (
                            <div className="absolute z-50 top-full mt-1 w-full bg-black/90 border border-ktsa-accent/20 rounded-lg overflow-hidden shadow-xl max-h-48 overflow-y-auto">
                              {teamSearchResults.length > 0 ? (
                                teamSearchResults.map((team) => (
                                  <button
                                    key={team.teamId}
                                    type="button"
                                    onClick={() => { setSelectedTeam(team); setTeamSearchOpen(false); }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-ktsa-primary/30 transition-colors flex items-center gap-2"
                                  >
                                    <Shield size={13} className="text-ktsa-accent flex-shrink-0" />
                                    {team.teamName}
                                  </button>
                                ))
                              ) : (
                                <p className="px-4 py-3 text-sm text-gray-500">No teams found</p>
                              )}
                            </div>
                          )}
                        </div>

                        {selectedTeam ? (
                          <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                            <CheckCircle size={12} /> Team "{selectedTeam.teamName}" selected
                          </p>
                        ) : (
                          <p className="text-xs text-gray-600 mt-1">Type to search existing teams by name</p>
                        )}
                      </motion.div>
                    )}

                    {/* ── Toggle row: Need a Partner? ── */}
                    <div className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-colors
                      ${needPartner ? "border-ktsa-accent/40 bg-ktsa-primary/10" : "border-gray-700 bg-transparent"}`}>
                      <div className="flex items-center gap-2">
                        <UserPlus size={16} className="text-ktsa-accent" />
                        <div>
                          <span className="text-sm font-medium text-white">Need a Partner?</span>
                          <p className="text-xs text-gray-500">We'll find someone for you</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        aria-label="Toggle need partner"
                        onClick={() => {
                          if (needPartner) {
                            resetDoublesState();
                          } else {
                            resetDoublesState();
                            setNeedPartner(true);
                          }
                        }}
                      >
                        {needPartner
                          ? <ToggleRight size={28} className="text-ktsa-accent" />
                          : <ToggleLeft size={28} className="text-gray-500" />}
                      </button>
                    </div>

                    {/* Role preference — shown when "Need a Partner?" is ON */}
                    {needPartner && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pl-1"
                      >
                        <label className="block text-sm text-ktsa-accent mb-2">
                          Your Role Preference <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(["Defender", "Attacker", "All-rounder"] as const).map((role) => (
                            <button
                              key={role}
                              type="button"
                              onClick={() => setRolePreference(role)}
                              className={`py-2 rounded-lg text-xs font-semibold border transition-all duration-200
                                ${rolePreference === role
                                  ? "bg-ktsa-primary/70 border-ktsa-primary text-white"
                                  : "bg-transparent border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white"}`}
                            >
                              {role}
                            </button>
                          ))}
                        </div>
                        {rolePreference && (
                          <p className="text-xs text-ktsa-accent/70 mt-1.5">
                            You'll be matched with a compatible partner
                          </p>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || selectedCategories.size === 0}
                  className="w-full py-2.5 rounded-lg bg-ktsa-primary/70 text-ktsa-text font-semibold hover:bg-ktsa-primary/60 hover:cursor-pointer transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={14} className="animate-spin" />
                      Submitting…
                    </span>
                  ) : selectedCategories.size === 0 ? (
                    "Select a Category to Register"
                  ) : (
                    `Register for ${selectedCategories.size} ${selectedCategories.size === 1 ? "Category" : "Categories"}`
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* ── 4. Success ── */}
          {!authLoading && user && submitted && (
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
              {selectedCategories.size > 0 && (
                <div className="flex flex-wrap justify-center gap-1.5 mb-3">
                  {Array.from(selectedCategories).map((cat) => (
                    <span
                      key={cat}
                      className="px-2 py-0.5 rounded-full text-xs bg-ktsa-accent/20 text-ktsa-accent border border-ktsa-accent/30"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-gray-500 text-xs mb-8">
                A confirmation will be sent to{" "}
                <span className="text-gray-300">{email}</span>
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
