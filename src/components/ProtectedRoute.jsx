import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/auth";

export default function ProtectedRoute({ children }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const hydrated = useAuthStore((s) => s.hydrated);
  const refresh = useAuthStore((s) => s.refresh);
  const location = useLocation();

  const [checking, setChecking] = useState(true);
  const triedRefresh = useRef(false);

  useEffect(() => {
    if (!hydrated) return; // wait until store is ready

    let active = true;
    const end = () => active && setChecking(false);

    // safety timeout so we never hang
    const safety = setTimeout(end, 1500);

    (async () => {
      try {
        if (!accessToken && !triedRefresh.current) {
          triedRefresh.current = true;
          await refresh().catch(() => {}); // no token/cookie -> will fail
        }
      } finally {
        clearTimeout(safety);
        end(); // ✅ always stop checking
      }
    })();

    return () => {
      active = false;
      clearTimeout(safety);
    };
  }, [hydrated, accessToken, refresh]);

  if (!hydrated || checking) {
    return <div className="p-6 text-white">Checking session...</div>;
  }

  // if still no token after check → go to login
  if (!useAuthStore.getState().accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
