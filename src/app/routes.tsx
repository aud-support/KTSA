import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Rankings } from "./pages/Rankings";
import { About } from "./pages/About";
import { News } from "./pages/News";
import { Gallery } from "./pages/Gallery";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "rankings", Component: Rankings },
      { path: "about", Component: About },
      { path: "news", Component: News },
      { path: "gallery", Component: Gallery },
    ],
  },
]);
