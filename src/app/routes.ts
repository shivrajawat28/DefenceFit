import { createBrowserRouter } from "react-router";
import HomePage from "./pages/HomePage";
import MedicalCheckFlow from "./pages/MedicalCheckFlow";
import ResultDashboard from "./pages/ResultDashboard";
import ArticlesPage from "./pages/ArticlesPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/medical-check",
    Component: MedicalCheckFlow,
  },
  {
    path: "/medical-check/:examId",
    Component: MedicalCheckFlow,
  },
  {
    path: "/results",
    Component: ResultDashboard,
  },
  {
    path: "/articles",
    Component: ArticlesPage,
  },
  {
    path: "/admin",
    Component: AdminLogin,
  },
  {
    path: "/admin/dashboard",
    Component: AdminDashboard,
  },
]);
