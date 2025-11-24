import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import AuthShell from "../components/AuthShell";
import { useAuthStore } from "../store/auth";

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/40 outline-none";

const primaryBtn =
  "w-full rounded-2xl bg-gradient-to-r from-brand-accent to-brand-secondary px-4 py-3 font-semibold text-brand-dark shadow-glow transition hover:translate-y-0.5 disabled:opacity-60";

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

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      const user = useAuthStore.getState()?.user;
      if (!user) throw new Error("Invalid user data");
      if (user.role === "ADMIN") navigate("/admin-dashboard");
      else navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

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

  if (token) {
    return (
      <AuthShell
        title="Set a fresh password."
        description="You followed a secure link. Choose a new password and we’ll get you back into your projects."
        bullets={[
          "The link expires after one use.",
          "Strong passwords keep family and student data safe.",
        ]}
      >
        {resetSuccess ? (
          <p className="text-center text-brand-secondary">
            Password updated! Redirecting...
          </p>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <label className="text-sm text-white/60">New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className={inputClass}
            />
            <button type="submit" className={primaryBtn}>
              Update password
            </button>
          </form>
        )}
      </AuthShell>
    );
  }

  if (resetMode) {
    return (
      <AuthShell
        title="Need a reset link?"
        description="Enter the email tied to SmartSchool and we’ll send a one-tap recovery link."
        bullets={[
          "Links stay active for 15 minutes.",
          "Check spam if it doesn’t arrive immediately.",
        ]}
      >
        <form onSubmit={handleRequestReset} className="space-y-4">
          {resetSent ? (
            <p className="rounded-2xl border border-brand-secondary/30 bg-brand-secondary/10 p-3 text-sm text-brand-secondary">
              Verification email sent! Check your inbox.
            </p>
          ) : (
            <>
              <label className="text-sm text-white/60">Email</label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                className={inputClass}
              />
              <button type="submit" className={primaryBtn}>
                Send reset link
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setResetMode(false)}
            className="w-full rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/80 transition hover:border-white/40 hover:text-white"
          >
            Back to login
          </button>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Welcome back. Let’s sync your learning universe."
      description="Sign in to orchestrate projects, track outcomes, and keep every stakeholder aligned."
      bullets={[
        "SSO via Google keeps things fast and secure.",
        "Switch roles seamlessly if you teach and learn.",
      ]}
    >
      <form onSubmit={onSubmit} className="space-y-5">
        {error && (
          <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div>
          <label className="text-sm text-white/60">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-sm text-white/60">Password</label>
          <div className="relative mt-1">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`${inputClass} pr-20`}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/60 hover:text-white"
            >
              {showPw ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button disabled={loading} className={primaryBtn}>
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <div className="flex flex-wrap items-center justify-between text-sm text-white/70">
          <button
            type="button"
            onClick={() => setResetMode(true)}
            className="text-brand-secondary hover:text-white"
          >
            Forgot password?
          </button>
          <p>
            No account?{" "}
            <Link to="/register" className="text-brand-secondary hover:text-white">
              Create one
            </Link>
          </p>
        </div>

        <div className="pt-4">
          <button
            type="button"
            onClick={() =>
              (window.location.href = "http://localhost:4000/api/auth/google")
            }
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white px-4 py-3 font-medium text-brand-dark transition hover:-translate-y-0.5"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="h-5 w-5"
            />
            Continue with Google
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
