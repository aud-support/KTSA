import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { motion } from "motion/react";
import logo from "../../assets/logo.png";
import ProfileDropdown from "./ui/ProfileDropdown";

interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
}

export function Navbar({
  onLoginClick,
  onSignupClick,
  onProfileClick,
}: {
  onLoginClick: () => void;
  onSignupClick: () => void;
  onProfileClick: () => void;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const location = useLocation();

  // ─── Check auth on mount & whenever token changes ───────────────────────────
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkAuth();

    // Listen for storage changes (e.g., login in another tab or from LoginModal)
    window.addEventListener("storage", checkAuth);
    // Custom event for same-tab login
    window.addEventListener("auth-change", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("auth-change", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("auth-change"));
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Rankings", path: "/rankings" },
    { name: "About", path: "/about" },
    { name: "News", path: "/news" },
  ];

  return (
    <nav
      ref={menuRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? "bg-ktsa-bg backdrop-blur-lg shadow-lg shadow-ktsa-accent/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img src={logo} className="w-14 h-14 rounded-4xl" alt="logo" />
            </div>
            <div>
              <div className="text-ktsa-text font-bold text-xl tracking-tight">
                KTSA
              </div>
              <div className="text-ktsa-primary text-xs tracking-wider font-bold">
                Karnataka Table Soccer Association
              </div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative transition-colors duration-300 font-medium ${
                  location.pathname === link.path
                    ? "text-ktsa-primary"
                    : "text-ktsa-text hover:text-ktsa-accent"
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-ktsa-primary to-ktsa-primary"
                    style={{ boxShadow: "0 0 10px var(--ktsa-accent)" }}
                  />
                )}
              </Link>
            ))}

            {/* ── Auth Section: show profile OR login+signup ── */}
            {user ? (
              <ProfileDropdown
                user={user}
                onLogout={handleLogout}
                onProfileClick={onProfileClick}
              />
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2 rounded-lg bg-transparent border border-ktsa-accent text-ktsa-primary/70 font-bold hover:bg-ktsa-accent hover:text-ktsa-text transition-all duration-300"
                >
                  Log In
                </button>
                <button
                  onClick={onSignupClick}
                  className="px-5 py-2 rounded-lg bg-ktsa-primary/70 text-ktsa-text font-bold hover:bg-ktsa-accent transition-all duration-300"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-ktsa-text hover:text-ktsa-accent transition-colors"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 border-t border-ktsa-accent/20 bg-ktsa-bg backdrop-blur-lg"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-3 text-ktsa-accent hover:text-ktsa-text font-bold transition-colors ${
                  location.pathname === link.path ? "text-ktsa-text" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Auth Section */}
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block mt-3 py-3 text-center border border-ktsa-accent text-ktsa-primary/70 font-bold rounded-lg w-full"
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block mt-3 py-3 text-center bg-red-500/20 border border-red-500/40 text-red-400 font-bold rounded-lg w-full"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLoginClick();
                  }}
                  className="block mt-3 py-3 text-center border border-ktsa-accent text-ktsa-primary/70 font-bold rounded-lg w-full"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onSignupClick();
                  }}
                  className="block mt-3 py-3 text-center bg-ktsa-primary/70 font-bold text-ktsa-text rounded-lg w-full"
                >
                  Sign Up
                </button>
              </>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  );
}
