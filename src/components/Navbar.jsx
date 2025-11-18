import { useAuthStore } from "../store/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="fixed w-full top-0 z-40 bg-[#0b1020]/60 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-500 hover:text-blue-400"
        >
          SmartSchool
        </Link>
        <div className="flex items-center gap-5 text-sm font-medium">
          {!user ? (
            <>
              <Link to="/login" className="hover:text-blue-400 transition">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 px-4 py-2 rounded-xl hover:bg-blue-700 transition text-white"
              >
                Create Account
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="hover:text-blue-400 transition">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
