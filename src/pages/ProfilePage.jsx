import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/auth";

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
        // 🔹 Fetch user first to get provider (LOCAL/GOOGLE)
        const userData = await api.get("/api/auth/me");
        useAuthStore.setState({ user: userData.data.user });

        // 🔹 Then fetch the profile
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
      setProfile(data);
      setForm({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        phone: data.phone || "",
        bio: data.bio || "",
      });
      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!profile)
    return (
      <div className="text-center mt-20 text-gray-400">Loading profile...</div>
    );

  return (
    <div className="min-h-screen bg-[var(--bg)] text-white">
      <Navbar />
      <div className="max-w-2xl mx-auto mt-24 bg-white/10 p-6 rounded-2xl shadow-lg border border-white/10">
        <h1 className="text-3xl font-semibold mb-6">My Profile</h1>

        {/* 🔹 Profile Form */}
        <form onSubmit={handleUpdate} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400">First Name</label>
              <input
                type="text"
                value={form.firstName}
                disabled={!editing}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                className={`w-full rounded-xl px-4 py-2 mt-1 bg-black/30 border ${
                  editing
                    ? "border-blue-500 focus:ring-2 focus:ring-blue-600"
                    : "border-white/10 text-gray-400"
                } outline-none`}
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Last Name</label>
              <input
                type="text"
                value={form.lastName}
                disabled={!editing}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className={`w-full rounded-xl px-4 py-2 mt-1 bg-black/30 border ${
                  editing
                    ? "border-blue-500 focus:ring-2 focus:ring-blue-600"
                    : "border-white/10 text-gray-400"
                } outline-none`}
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400">Phone</label>
            <input
              type="text"
              value={form.phone}
              disabled={!editing}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={`w-full rounded-xl px-4 py-2 mt-1 bg-black/30 border ${
                editing
                  ? "border-blue-500 focus:ring-2 focus:ring-blue-600"
                  : "border-white/10 text-gray-400"
              } outline-none`}
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Bio</label>
            <textarea
              rows={3}
              value={form.bio}
              disabled={!editing}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className={`w-full rounded-xl px-4 py-2 mt-1 bg-black/30 border ${
                editing
                  ? "border-blue-500 focus:ring-2 focus:ring-blue-600"
                  : "border-white/10 text-gray-400"
              } outline-none resize-none`}
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            {!editing ? (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-6 py-2 rounded-xl bg-gray-500/30 hover:bg-gray-600/30 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 rounded-xl bg-green-600 hover:bg-green-700 transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}
          </div>
        </form>

        {/* 🔹 Change Password Section */}
        <hr className="my-10 border-gray-700" />

        {!isGoogleUser ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
            <p className="text-gray-400 mb-6">
              Enter your current password and a new password to update it
              securely.
            </p>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!currentPassword || !newPassword) {
                  alert("Please fill in both fields.");
                  return;
                }
                try {
                  const { data } = await api.post("/api/auth/change-password", {
                    currentPassword,
                    newPassword,
                  });
                  alert(data.message || "Password updated successfully!");
                  setCurrentPassword("");
                  setNewPassword("");
                } catch (err) {
                  alert(
                    err.response?.data?.message || "Error updating password"
                  );
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm text-gray-400">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 mt-1 outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter your current password"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 mt-1 outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter your new password"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl mt-4 transition"
              >
                Update Password
              </button>
            </form>
          </>
        ) : (
          <p className="text-gray-400 text-sm italic">
            You logged in with Google. Password changes are disabled.
          </p>
        )}
      </div>
    </div>
  );
}
