import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/auth";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const role = user?.role;
  const firstName = user?.profile?.firstName || user?.firstName;

  useEffect(() => {
    if (role === "ADMIN") navigate("/admin-dashboard");
  }, [role, navigate]);

  const isTeacher = role === "TEACHER";
  const isStudent = role === "STUDENT";

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
          Hello, <span className="text-blue-500">{firstName}</span> 👋
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-300 mb-8"
        >
          Welcome to your SmartSchool dashboard.
        </motion.p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* PROFILE */}
          <Link to="/profile">
            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur border border-white/10 hover:bg-white/20 transition cursor-pointer">
              <h2 className="text-lg font-semibold mb-2">My Profile</h2>
              <p className="text-sm text-gray-400">Manage your personal info</p>
            </div>
          </Link>

          {/* 🧑‍🏫 TEACHER FEATURES */}
          {isTeacher && (
            <>
              <Link to="/teacher/projects">
                <div className="bg-white/10 p-6 rounded-2xl backdrop-blur border border-white/10 hover:bg-white/20 transition cursor-pointer">
                  <h2 className="text-lg font-semibold mb-2">My Projects</h2>
                  <p className="text-sm text-gray-400">
                    View and manage the projects you created.
                  </p>
                </div>
              </Link>

              <Link to="/teacher/projects/create">
                <div className="bg-white/10 p-6 rounded-2xl backdrop-blur border border-white/10 hover:bg-white/20 transition cursor-pointer">
                  <h2 className="text-lg font-semibold mb-2">Create Project</h2>
                  <p className="text-sm text-gray-400">
                    Start a new class or project.
                  </p>
                </div>
              </Link>
            </>
          )}

          {/* 🎓 STUDENT FEATURES */}
          {isStudent && (
            <>
              <Link to="/student/projects">
                <div className="bg-white/10 p-6 rounded-2xl backdrop-blur border border-white/10 hover:bg-white/20 transition cursor-pointer">
                  <h2 className="text-lg font-semibold mb-2">My Projects</h2>
                  <p className="text-sm text-gray-400">
                    See the projects you are assigned to.
                  </p>
                </div>
              </Link>

              <Link to="/student/tasks">
                <div className="bg-white/10 p-6 rounded-2xl backdrop-blur border border-white/10 hover:bg-white/20 transition cursor-pointer">
                  <h2 className="text-lg font-semibold mb-2">My Tasks</h2>
                  <p className="text-sm text-gray-400">
                    View your daily tasks and deadlines.
                  </p>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
