import { useEffect, useState } from "react";
import api from "../api/axios";
import PageContainer from "../components/PageContainer";
import { useAuthStore } from "../store/auth";

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/40 outline-none disabled:border-white/5 disabled:text-white/40";

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
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/70">
          Loading profile...
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-12">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-brand-dark to-brand-surface p-8 shadow-2xl shadow-black/40">
          <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
            Identity
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-white">
            Profile Settings
          </h1>
          <p className="mt-3 text-white/70">
            Update your personal information and manage your account settings.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form
            onSubmit={handleUpdate}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg shadow-black/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
                  Profile details
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Personal info
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditing((prev) => !prev)}
                className="rounded-2xl border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:border-white/40 hover:text-white"
              >
                {editing ? "Lock fields" : "Edit fields"}
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
                  className="rounded-2xl border border-white/10 px-5 py-2 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={!editing || loading}
                className="rounded-2xl bg-gradient-to-r from-brand-accent to-brand-secondary px-6 py-3 text-sm font-semibold text-brand-dark shadow-glow transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
              <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
                Account overview
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white">
                Account Information
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li>
                  Email: <span className="text-white">{user?.email}</span>
                </li>
                <li>
                  Role:{" "}
                  <span className="text-brand-secondary">
                    {user?.role ?? "—"}
                  </span>
                </li>
                <li>
                  Provider:{" "}
                  <span className="text-brand-secondary">
                    {user?.provider || "LOCAL"}
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-white/10 bg-brand-dark/70 p-6 shadow-inner shadow-black/50">
              <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
                Security
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white">
                Password controls
              </h3>
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
                    className="w-full rounded-2xl border border-brand-secondary/40 bg-brand-secondary/20 px-4 py-3 text-sm font-semibold text-brand-secondary transition hover:border-brand-secondary hover:bg-brand-secondary/30"
                  >
                    Update password
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
