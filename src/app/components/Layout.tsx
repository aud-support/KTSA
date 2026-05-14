import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import ScrollToTop from "../utils/ScrollToTop";
import LoginModal from "./ui/LoginModel";
import SignupModal from "./ui/SignUpModel";
import ProfileModal from "./ui/ProfileModal";

export function Layout() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  // read userId from localStorage here (same logic you had in Navbar)
  useEffect(() => {
    const id = localStorage.getItem("userId");
    const parsed = id ? parseInt(id, 10) : null;
    setUserId(parsed && !isNaN(parsed) ? parsed : null);
  }, []);
  return (
    <div className="min-h-screen bg-ktsa-bg">
      <ScrollToTop />
      <Navbar
        onLoginClick={() => setIsLoginOpen(true)}
        onSignupClick={() => setIsSignupOpen(true)}
        onProfileClick={() => setProfileModalOpen(true)}
      />
      <main>
        <Outlet />
      </main>
      <Footer />
      {/* ✅ Modal OUTSIDE navbar */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      {/* Signup Modal */}
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSwitchToLogin={() => {
          setIsSignupOpen(false);
          setIsLoginOpen(true);
        }}
      />

      {/* Modal lives here — outside navbar, at root level */}
      {userId && (
        <ProfileModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          userId={userId}
        />
      )}
    </div>
  );
}
