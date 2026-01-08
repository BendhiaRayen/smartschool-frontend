import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import PageContainer from "../components/PageContainer";
import { useAuthStore } from "../store/auth";

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/40 outline-none transition-all duration-300 disabled:border-white/5 disabled:text-white/40 disabled:cursor-not-allowed";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const isGoogleUser = user?.provider === "GOOGLE";

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    bio: "",
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const userData = await api.get("/api/auth/me");
        useAuthStore.setState({ user: userData.data.user });

        const { data } = await api.get("/api/profile/me");
        setProfile(data.profile);
        setForm({
          firstName: data.profile?.firstName || "",
          lastName: data.profile?.lastName || "",
          phone: data.profile?.phone || "",
          bio: data.profile?.bio || "",
        });
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };

    load();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.patch("/api/profile/me", form);
      const updated = data?.profile ?? data;
      setProfile(updated);
      setForm({
        firstName: updated?.firstName || "",
        lastName: updated?.lastName || "",
        phone: updated?.phone || "",
        bio: updated?.bio || "",
      });
      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mb-4 text-4xl animate-pulse">⏳</div>
            <p className="text-white/70">Loading profile...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-dark via-brand-dark to-brand-surface p-8 shadow-2xl shadow-black/40"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 via-transparent to-brand-secondary/5"></div>
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
              Identity
            </p>
            <h1 className="mt-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-3xl font-bold text-transparent">
              Profile Settings
            </h1>
            <p className="mt-3 text-lg text-white/80">
              Update your personal information and manage your account settings.
            </p>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleUpdate}
            className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 shadow-lg shadow-black/30 backdrop-blur-2xl"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-xl backdrop-blur-sm">
                      👤
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
                        Profile details
                      </p>
                      <h2 className="mt-1 text-2xl font-bold text-white">
                        Personal info
                      </h2>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditing((prev) => !prev)}
                  className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    editing
                      ? "border-amber-400/30 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20"
                      : "border-white/15 bg-white/5 text-white/80 hover:border-brand-secondary/40 hover:bg-brand-secondary/10 hover:text-white"
                  }`}
                >
                  {editing ? "🔒 Lock" : "✏️ Edit"}
                </button>
              </div>

            <div className="mt-6 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-white/60">First name</label>
                  <input
                    type="text"
                    value={form.firstName}
                    disabled={!editing}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60">Last name</label>
                  <input
                    type="text"
                    value={form.lastName}
                    disabled={!editing}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-white/60">Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  disabled={!editing}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-sm text-white/60">Bio</label>
                <textarea
                  rows={4}
                  value={form.bio}
                  disabled={!editing}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

              <div className="mt-8 flex flex-wrap justify-end gap-3">
                {editing && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setForm({
                        firstName: profile?.firstName || "",
                        lastName: profile?.lastName || "",
                        phone: profile?.phone || "",
                        bio: profile?.bio || "",
                      });
                    }}
                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/70 transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:text-white"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!editing || loading}
                  className="group/btn relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-accent to-brand-secondary px-6 py-3 text-sm font-bold text-brand-dark shadow-lg shadow-brand-accent/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-xl hover:shadow-brand-accent/40"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>💾</span>
                        <span>Save changes</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 shadow-lg shadow-black/30 backdrop-blur-2xl">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-xl backdrop-blur-sm">
                    📋
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
                      Account overview
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-white">
                      Account Information
                    </h3>
                  </div>
                </div>
                <div className="mt-4 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white/60">Email</span>
                    <span className="text-sm font-semibold text-white">{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white/60">Role</span>
                    <span className="rounded-full border border-brand-secondary/30 bg-brand-secondary/10 px-3 py-1 text-xs font-bold text-brand-secondary">
                      {user?.role ?? "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white/60">Provider</span>
                    <span className="text-sm font-semibold text-brand-secondary">
                      {user?.provider || "LOCAL"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-brand-dark/70 to-brand-dark/50 p-6 shadow-inner shadow-black/50 backdrop-blur-2xl">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 text-xl backdrop-blur-sm">
                    🔒
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
                      Security
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-white">
                      Password controls
                    </h3>
                  </div>
                </div>
              {isGoogleUser ? (
                <p className="mt-3 text-sm text-white/60">
                  You signed in with Google. Manage your password inside Google
                  Workspace and it will sync here automatically.
                </p>
              ) : (
                <form
                  className="mt-5 space-y-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!currentPassword || !newPassword) {
                      alert("Please fill in both fields.");
                      return;
                    }
                    try {
                      const { data } = await api.post(
                        "/api/auth/change-password",
                        {
                          currentPassword,
                          newPassword,
                        }
                      );
                      alert(data.message || "Password updated successfully!");
                      setCurrentPassword("");
                      setNewPassword("");
                    } catch (err) {
                      alert(
                        err.response?.data?.message ||
                          "Error updating password"
                      );
                    }
                  }}
                >
                  <div>
                    <label className="text-sm text-white/60">
                      Current password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="text-sm text-white/60">
                      New password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <button
                    type="submit"
                    className="group/btn w-full rounded-2xl border border-brand-secondary/40 bg-brand-secondary/20 px-4 py-3 text-sm font-bold text-brand-secondary transition-all duration-300 hover:border-brand-secondary hover:bg-brand-secondary/30 hover:scale-105"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>🔑</span>
                      <span>Update password</span>
                    </span>
                  </button>
                </form>
              )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageContainer>
  );
}
