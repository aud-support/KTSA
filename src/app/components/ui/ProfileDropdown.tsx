import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  LogOut,
  Settings,
  Trophy,
  ChevronDown,
  Users,
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  profilePictureUrl?: string;
  avatarUrl?: string; // legacy fallback
}

interface Props {
  user: UserProfile;
  onLogout: () => void;
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onMatchesClick: () => void;
  onTeamsClick: () => void;
}

export default function ProfileDropdown({
  user,
  onLogout,
  onProfileClick,
  onSettingsClick,
  onMatchesClick,
  onTeamsClick,
}: Props) {
  const name = user?.name ?? "";
  const email = user?.email ?? "";
  // Support both field names for backwards compatibility
  const avatarSrc = user?.profilePictureUrl || user?.avatarUrl || null;
  console.log("Navbar User:", user);
  console.log("Navbar Image:", avatarSrc);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Safely get initials
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const firstName = name ? name.split(" ")[0] : "User";

  return (
    <div ref={ref} className="relative">
      {/* Avatar button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-ktsa-accent/40 hover:border-ktsa-accent bg-ktsa-bg/60 backdrop-blur-sm transition-all duration-300"
      >
        {/* Avatar circle */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ktsa-primary to-ktsa-accent flex items-center justify-center text-ktsa-text font-bold text-sm shadow-md shadow-ktsa-accent/30 overflow-hidden">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            initials
          )}
        </div>
        <span className="hidden sm:block text-ktsa-text font-semibold text-sm max-w-[120px] truncate">
          {firstName}
        </span>
        <ChevronDown
          size={14}
          className={`text-ktsa-primary transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="absolute right-0 mt-2 w-56 bg-black/80 backdrop-blur-xl border border-ktsa-accent/20 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50"
          >
            {/* User info header */}
            <div className="px-4 py-3 border-b border-ktsa-accent/10">
              <p className="text-ktsa-text font-bold text-sm truncate">
                {name || "User"}
              </p>
              <p className="text-gray-400 text-xs truncate">{email || ""}</p>
            </div>

            {/* Menu items */}
            <div className="py-1">
              <button
                onClick={() => {
                  setOpen(false);
                  onProfileClick();
                }}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-ktsa-text hover:bg-ktsa-accent/10 transition-colors w-full"
              >
                {" "}
                <User size={15} className="text-ktsa-primary" /> My Profile
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  onMatchesClick();
                }}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-ktsa-text hover:bg-ktsa-accent/10 transition-colors w-full"
              >
                <Trophy size={15} className="text-ktsa-primary" />
                My Matches
              </button>

              <button
                onClick={() => {
                  setOpen(false);
                  onTeamsClick();
                }}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-ktsa-text hover:bg-ktsa-accent/10 transition-colors w-full"
              >
                <Users size={15} className="text-ktsa-primary" />
                My Teams
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  onSettingsClick();
                }}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-ktsa-text hover:bg-ktsa-accent/10 transition-colors w-full"
              >
                <Settings size={15} className="text-ktsa-primary" />
                Settings
              </button>
            </div>

            {/* Logout */}
            <div className="border-t border-ktsa-accent/10 py-1">
              <button
                onClick={() => {
                  setOpen(false);
                  onLogout();
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={15} />
                Log Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
