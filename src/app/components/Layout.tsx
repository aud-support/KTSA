import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import ScrollToTop from "../utils/ScrollToTop";
import LoginModal from "./ui/LoginModel";
import SignupModal from "./ui/SignUpModel";
import ProfileModal from "./ui/ProfileModal";
import SettingsModal from "./ui/SettingsModal";
import { ModalContext } from "../contexts/ModalContext";

export function Layout() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("userId");
    const parsed = id ? parseInt(id, 10) : null;
    setUserId(parsed && !isNaN(parsed) ? parsed : null);

    const raw = localStorage.getItem("user");
    if (raw) setUserEmail(JSON.parse(raw).email ?? "");
  }, []);

  return (
    <ModalContext.Provider
      value={{
        openLogin: () => setIsLoginOpen(true),
        openSignup: () => setIsSignupOpen(true),
      }}
    >
      <div className="min-h-screen bg-ktsa-bg">
        <ScrollToTop />
        <Navbar
          onLoginClick={() => setIsLoginOpen(true)}
          onSignupClick={() => setIsSignupOpen(true)}
          onProfileClick={() => setProfileModalOpen(true)}
          onSettingsClick={() => setIsSettingsOpen(true)}
        />
        <main>
          <Outlet />
        </main>
        <Footer />
        {/* ✅ Modal OUTSIDE navbar */}
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onSwitchToSignup={() => {
            setIsLoginOpen(false);
            setIsSignupOpen(true);
          }}
        />
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

        {userId && (
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            userId={userId}
            userEmail={userEmail}
          />
        )}
      </div>
    </ModalContext.Provider>
  );
}
