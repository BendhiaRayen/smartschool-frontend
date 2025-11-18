import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1020] via-[#101830] to-[#141c40] text-white px-6">
      <form
        onSubmit={handleReset}
        className="bg-[#11162a]/80 p-8 rounded-3xl border border-white/10 shadow-xl w-full max-w-md"
      >
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Reset your password 🔒
        </h1>

        {message && (
          <div
            className={`text-center mb-3 ${
              message.includes("success") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </div>
        )}

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
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-2 mt-5 font-semibold"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
