import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/auth";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "ADMIN") navigate("/admin-dashboard");
  }, [user]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1020] via-[#101830] to-[#141c40] text-white">
      <Navbar />
      <div className="pt-28 px-6 max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-4"
        >
          Hello, <span className="text-blue-500">{user?.firstName}</span> 👋
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-300 mb-8"
        >
          Welcome to your personalized SmartSchool dashboard.
        </motion.p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/profile">
            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur border border-white/10 hover:bg-white/20 transition cursor-pointer">
              <h2 className="text-lg font-semibold mb-2">My Profile</h2>
              <p className="text-sm text-gray-400">
                View and update your personal information.
              </p>
            </div>
          </Link>
          <div className="bg-white/10 p-6 rounded-2xl backdrop-blur border border-white/10 hover:bg-white/20 transition">
            <h2 className="text-lg font-semibold mb-2">My Classes</h2>
            <p className="text-sm text-gray-400">
              Check your enrolled courses and schedules.
            </p>
          </div>
          <div className="bg-white/10 p-6 rounded-2xl backdrop-blur border border-white/10 hover:bg-white/20 transition">
            <h2 className="text-lg font-semibold mb-2">Statistics</h2>
            <p className="text-sm text-gray-400">
              See your latest grades and attendance progress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
