import { useState } from "react";
import { useAuthStore } from "../store/auth";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false); // 👈 Added toggle state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1020] via-[#101830] to-[#141c40] flex items-center justify-center px-6 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#11162a]/80 backdrop-blur-lg p-8 rounded-3xl border border-white/10 shadow-2xl"
      >
        <h1 className="text-3xl font-semibold mb-6 text-center">
          Create an Account 🚀
        </h1>

        {error && (
          <div className="text-red-400 bg-red-900/20 border border-red-400/20 rounded-lg p-2 text-sm mb-3 text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            required
            className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="text"
            placeholder="Last name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            required
            className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="mt-4 w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
        />

        {/* Password with show/hide toggle */}
        <div className="mt-4 relative">
          <input
            type={showPw ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={8}
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 pr-20 outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            {showPw ? "Hide" : "Show"}
          </button>
        </div>

        <button
          disabled={loading}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 transition rounded-xl py-2 font-semibold shadow-lg disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
