import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1020] via-[#101830] to-[#141c40] text-white overflow-hidden">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl sm:text-6xl font-extrabold mb-6"
        >
          Welcome to <span className="text-blue-500">SmartSchool</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg text-gray-300 max-w-2xl mb-10"
        >
          The next generation school management system — manage students,
          teachers, profiles and grades with ease and style.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-5"
        >
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition"
          >
            Get Started
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
