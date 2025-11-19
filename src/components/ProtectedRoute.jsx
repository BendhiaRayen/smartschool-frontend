import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth";

export default function ProtectedRoute({ children }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const hydrated = useAuthStore((s) => s.hydrated);
  const location = useLocation();

  // ⏳ Wait until Zustand rehydrates the store
  if (!hydrated) {
    return <div className="p-6 text-white">Checking session...</div>;
  }

  // 🚫 If no token after hydration → user is NOT logged in
  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ User is authenticated
  return <>{children}</>;
}
