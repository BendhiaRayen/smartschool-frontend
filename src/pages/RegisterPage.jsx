import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import { useAuthStore } from "../store/auth";

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/40 outline-none";

const primaryBtn =
  "w-full rounded-2xl bg-gradient-to-r from-brand-accent to-brand-secondary px-4 py-3 font-semibold text-brand-dark shadow-glow transition hover:translate-y-0.5 disabled:opacity-60";

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
  const [showPw, setShowPw] = useState(false);

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
    <AuthShell
      eyebrow="Join SmartSchool"
      title="Bring your classroom operations into one orbit."
      description="Set up your profile, invite collaborators, and unlock a shared workspace for projects, grading, and storytelling."
      bullets={[
        "Real-time dashboards for attendance, progress, and nudges.",
        "Role-aware access for admins, teachers, and students.",
      ]}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            placeholder="First name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            required
            className={inputClass}
          />
          <input
            type="text"
            placeholder="Last name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            required
            className={inputClass}
          />
        </div>

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className={inputClass}
        />

        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={8}
            className={`${inputClass} pr-20`}
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-white/10 px-3 py-1 text-xs text-white/80 transition hover:bg-white/20"
          >
            {showPw ? "Hide" : "Show"}
          </button>
        </div>

        <button disabled={loading} className={primaryBtn}>
          {loading ? "Creating..." : "Create account"}
        </button>

        <p className="text-center text-sm text-white/70">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-secondary hover:text-white">
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
