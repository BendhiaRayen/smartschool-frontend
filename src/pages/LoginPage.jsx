import { useState } from "react";
import { useAuthStore } from "../store/auth";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // For reset link form (from email)
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  // 🔹 Regular Login
  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      const user = useAuthStore.getState().user;
      if (user?.role === "ADMIN") navigate("/admin-dashboard");
      else navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Request password reset
  const handleRequestReset = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/auth/request-password-change", {
        email: resetEmail,
      });
      setResetSent(true);
    } catch (err) {
      alert(err.response?.data?.message || "Error sending email");
    }
  };

  // 🔹 Handle password reset form (when token is present)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/auth/reset-password", { token, newPassword });
      setResetSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reset password");
    }
  };

  // 🔹 If user came from the email link
  if (token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1020] via-[#101830] to-[#141c40] text-white px-6">
        <form
          onSubmit={handleResetPassword}
          className="bg-[#11162a]/80 p-8 rounded-3xl border border-white/10 shadow-xl w-full max-w-md"
        >
          <h1 className="text-2xl font-semibold mb-4 text-center">
            Reset your password 🔒
          </h1>
          {resetSuccess ? (
            <p className="text-green-400 text-center">
              Password updated! Redirecting...
            </p>
          ) : (
            <>
              <label className="text-sm text-gray-400">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 mt-1 outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-2 mt-5 font-semibold"
              >
                Update Password
              </button>
            </>
          )}
        </form>
      </div>
    );
  }

  // 🔹 Forgot password form
  if (resetMode)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1020] via-[#101830] to-[#141c40] text-white px-6">
        <form
          onSubmit={handleRequestReset}
          className="bg-[#11162a]/80 p-8 rounded-3xl border border-white/10 shadow-xl w-full max-w-md"
        >
          <h1 className="text-2xl font-semibold mb-4 text-center">
            Forgot your password? 🔑
          </h1>

          {resetSent ? (
            <p className="text-green-400 text-center">
              ✅ Verification email sent! Check your inbox.
            </p>
          ) : (
            <>
              <label className="text-sm text-gray-400">Email</label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 mt-1 outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-2 mt-5 font-semibold"
              >
                Send Reset Link
              </button>
            </>
          )}

          <p className="mt-4 text-center text-sm text-gray-400">
            <button
              type="button"
              onClick={() => setResetMode(false)}
              className="text-blue-400 hover:underline"
            >
              Back to login
            </button>
          </p>
        </form>
      </div>
    );

  // 🔹 Default login form
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1020] via-[#101830] to-[#141c40] flex items-center justify-center px-6 text-white">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-[#11162a]/80 backdrop-blur-lg p-8 rounded-3xl border border-white/10 shadow-2xl"
      >
        <h1 className="text-3xl font-semibold mb-6 text-center">Hi!!!! 👋</h1>

        {error && (
          <div className="text-red-400 bg-red-900/20 border border-red-400/20 rounded-lg p-2 text-sm mb-3 text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 mt-1 outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Password</label>
            <div className="relative mt-1">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600 pr-20"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        </div>

        <button
          disabled={loading}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 transition rounded-xl py-2 font-semibold shadow-lg"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-400">
          <button
            type="button"
            onClick={() => setResetMode(true)}
            className="text-blue-400 hover:underline"
          >
            Forgot password?
          </button>
        </p>

        <p className="mt-2 text-center text-sm text-gray-400">
          No account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Create one
          </Link>
        </p>
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() =>
              (window.location.href = "http://localhost:4000/api/auth/google")
            }
            className="flex items-center justify-center gap-2 w-full bg-white text-black py-2 rounded-xl hover:bg-gray-200 transition"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
        </div>
      </form>
    </div>
  );
}
