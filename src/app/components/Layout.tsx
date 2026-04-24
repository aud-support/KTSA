import { Outlet } from "react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import ScrollToTop from "../utils/ScrollToTop";

export function Layout() {
  return (
    <div className="min-h-screen bg-ktsa-bg">
      <ScrollToTop />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
