import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/AdminDashboard";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import GoogleSuccessPage from "./pages/GoogleSuccessPage";
import TeacherProjects from "./pages/TeacherProjects";
import CreateProject from "./pages/CreateProject";
import TeacherProjectDetails from "./pages/TeacherProjectDetails";
import StudentProjects from "./pages/StudentProjects";
import StudentProjectDetails from "./pages/StudentProjectDetails";
import StudentTasks from "./pages/StudentTasks";

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
  { path: "/google-success", element: <GoogleSuccessPage /> },

  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin-dashboard",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher/projects",
    element: (
      <ProtectedRoute>
        <TeacherProjects />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher/projects/create",
    element: (
      <ProtectedRoute>
        <CreateProject />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher/projects/:id",
    element: (
      <ProtectedRoute>
        <TeacherProjectDetails />
      </ProtectedRoute>
    ),
  },

  {
    path: "/student/projects",
    element: (
      <ProtectedRoute>
        <StudentProjects />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/projects/:id",
    element: (
      <ProtectedRoute>
        <StudentProjectDetails />
      </ProtectedRoute>
    ),
  },

  {
    path: "/student/tasks",
    element: (
      <ProtectedRoute>
        <StudentTasks />
      </ProtectedRoute>
    ),
  },
]);
