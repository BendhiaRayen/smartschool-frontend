import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import api from "../api/axios";

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/40 outline-none";

const primaryBtn =
  "w-full rounded-2xl bg-gradient-to-r from-brand-accent to-brand-secondary px-4 py-3 font-semibold text-brand-dark shadow-glow transition hover:translate-y-0.5 disabled:opacity-60";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!token) return alert("Missing reset token");

    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/reset-password", {
        token,
        newPassword,
      });
      setMessage(data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Reset your SmartSchool password"
      description="Keep your workspace secure by choosing a unique phrase—this protects every student and project tied to your account."
      bullets={[
        "Need at least 8 characters with letters and numbers.",
        "You’ll be redirected to sign in with the new password.",
      ]}
    >
      <form onSubmit={handleReset} className="space-y-4">
        {message && (
          <div className="rounded-2xl border border-brand-secondary/30 bg-brand-secondary/10 p-3 text-sm text-brand-secondary">
            {message}
          </div>
        )}

        <label className="text-sm text-white/60">New password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className={inputClass}
        />

        <button type="submit" disabled={loading} className={primaryBtn}>
          {loading ? "Updating..." : "Update password"}
        </button>
      </form>
    </AuthShell>
  );
}
