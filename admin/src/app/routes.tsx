import { Routes, Route, Navigate } from "react-router";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import TournamentListPage from "./pages/tournaments/TournamentListPage";
import TournamentEditPage from "./pages/tournaments/TournamentEditPage";
import NewsPage from "./pages/cms/NewsPage";
import SponsorsPage from "./pages/cms/SponsorsPage";
import TournamentDetailPage from "./pages/tournaments/Tournamentdetailpage";
import {
  HomepagePage,
  AboutPage,
  ContactPage,
  TournamentRulesPage,
  FooterPage,
} from "./pages/cms/CMSPages";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />

        <Route path="tournaments" element={<TournamentListPage />} />
        <Route path="tournaments/new" element={<TournamentEditPage />} />
        {/* <Route path="/tournaments/:id" element={<TournamentDetailPage />} /> */}
        <Route path="tournaments/:id" element={<TournamentEditPage />} />
        {/* <Route path="tournaments/rules" element={<TournamentRulesPage />} />

        <Route path="cms/homepage" element={<HomepagePage />} />
        <Route path="cms/about" element={<AboutPage />} />
        <Route path="cms/contact" element={<ContactPage />} />
        <Route path="cms/news" element={<NewsPage />} />
        <Route path="cms/sponsors" element={<SponsorsPage />} />
        <Route path="cms/footer" element={<FooterPage />} /> */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
