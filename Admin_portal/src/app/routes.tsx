import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Tournaments } from "./pages/Tournaments";
import { TournamentForm } from "./pages/TournamentForm";
import { TournamentMatches } from "./pages/TournamentMatches";
import { Rules } from "./pages/Rules";
import { Homepage } from "./pages/Homepage";
import { AboutUs } from "./pages/AboutUs";
import { Contact } from "./pages/Contact";
import { Articles } from "./pages/Articles";
import { Sponsors } from "./pages/Sponsors";
import { FooterSocial } from "./pages/FooterSocial";

const ProtectedLayout = () => (
  <ProtectedRoute>
    <Layout />
  </ProtectedRoute>
);

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: ProtectedLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "tournaments", Component: Tournaments },
      { path: "tournaments/new", Component: TournamentForm },
      { path: "tournaments/:id/edit", Component: TournamentForm },
      { path: "homepage", Component: Homepage },
      { path: "about", Component: AboutUs },
    ],
  },
]);
