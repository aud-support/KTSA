import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Rankings } from "./pages/Rankings";
import { About } from "./pages/About";
import { News } from "./pages/News";
import { NewsDetail } from "./pages/NewsDetail";
import { Gallery } from "./pages/Gallery";
import { Services } from "./pages/Services";
import { Tournaments } from "./pages/Tournaments";
import { TournamentResults } from "./pages/TournamentResults";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "rankings", Component: Rankings },
      { path: "about", Component: About },
      { path: "news", Component: News },
      { path: "news/:id", Component: NewsDetail },
      { path: "gallery", Component: Gallery },
      { path: "services", Component: Services },
      { path: "tournaments", Component: Tournaments },
      { path: "tournaments/:id/results", Component: TournamentResults },
      { path: "*", Component: NotFound },
    ],
  },
]);
