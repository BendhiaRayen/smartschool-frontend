import { useAuthStore } from "../store/auth";
import { Link, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 z-50 w-full">
      <div className="mx-auto max-w-6xl px-6 pt-6">
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-brand-dark/70 px-5 py-4 text-sm text-white/80 shadow-lg shadow-black/30 backdrop-blur-2xl">
          <Link
            to="/"
            className="flex items-center gap-3 text-lg font-semibold tracking-tight text-white"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-accent to-brand-secondary text-base font-bold text-brand-dark shadow-glow">
              SS
            </span>
            <div className="leading-tight">
              <span className="block font-semibold">SmartSchool</span>
              <span className="text-[11px] uppercase tracking-[0.35em] text-brand-secondary">
                Platform
              </span>
            </div>
          </Link>

          <div className="hidden items-center gap-6 text-[0.95rem] tracking-tight md:flex">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#personas" className="transition hover:text-white">
              Roles
            </a>
            <a href="#insights" className="transition hover:text-white">
              Insights
            </a>
          </div>

          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="rounded-xl border border-white/20 px-4 py-2 text-white/80 transition hover:border-white/40 hover:text-white"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-gradient-to-r from-brand-accent to-brand-secondary px-4 py-2 font-semibold text-brand-dark shadow-glow transition hover:scale-[1.02]"
                >
                  Create account
                </Link>
              </>
            ) : (
              <>
                <NotificationBell />
                <Link
                  to="/dashboard"
                  className="rounded-xl border border-white/20 px-4 py-2 text-white/80 transition hover:border-white/40 hover:text-white"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-xl bg-white/10 px-4 py-2 font-medium text-white transition hover:bg-white/20"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
