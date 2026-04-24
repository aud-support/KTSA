import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, Trophy } from "lucide-react";
import { motion } from "motion/react";
import logo from "../../assets/logo.png";
import emblem from "../../assets/emblem.jpg";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
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
    // { name: "Gallery", path: "/gallery" },
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
              {/* <Trophy className="w-10 h-10 text-ktsa-accent group-hover:text-ktsa-highlight transition-colors duration-300" /> */}
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
                // className={`relative text-ktsa-text hover:text-ktsa-accent transition-colors duration-300 font-medium ${
                //   location.pathname === link.path ? "text-ktsa-primary" : ""
                // }`}
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
                className={`block py-3 text-ktsa-accent hover:text-white transition-colors ${
                  location.pathname === link.path ? "text-white" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </nav>
  );
}
