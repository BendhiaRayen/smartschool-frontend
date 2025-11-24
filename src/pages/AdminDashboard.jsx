import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuthStore } from "../store/auth";
import PageContainer from "../components/PageContainer";

const badgeMap = {
  ADMIN: "text-brand-secondary",
  TEACHER: "text-brand-accent",
  STUDENT: "text-white/70",
};

export default function AdminDashboard() {
  const { user, accessToken } = useAuthStore();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
    else if (user.role !== "ADMIN") navigate("/dashboard");
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/api/users", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUsers(data);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await api.put(
        `/api/users/${id}`,
        { role },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Error updating role");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <PageContainer>
      <section className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-brand-dark to-brand-surface px-6 py-8 shadow-2xl shadow-black/40">
          <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
            Admin control
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-white">
            Govern your SmartSchool workspace with clarity.
          </h1>
          <p className="mt-3 text-white/70">
            Promote teachers, onboard students, and keep access aligned using a
            single, auditable surface.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-secondary">
                Directory
              </p>
              <h2 className="text-2xl font-semibold text-white">
                {users.length} user{users.length === 1 ? "" : "s"}
              </h2>
            </div>
            <div className="flex gap-3 text-xs text-white/60">
              <span className="rounded-full border border-white/10 px-3 py-1">
                Admin: {users.filter((u) => u.role === "ADMIN").length}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1">
                Teachers: {users.filter((u) => u.role === "TEACHER").length}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1">
                Students: {users.filter((u) => u.role === "STUDENT").length}
              </span>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/5">
            <table className="min-w-full divide-y divide-white/5 text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/60">
                <tr>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => {
                  const first = u.profile?.firstName || "";
                  const last = u.profile?.lastName || "";
                  const displayName = first || last ? `${first} ${last}`.trim() : "—";

                  return (
                    <tr
                      key={u.id}
                      className="bg-white/[0.02] transition hover:bg-white/[0.07]"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-white">{displayName}</p>
                        <p className="text-xs text-white/50">ID: {u.id}</p>
                      </td>
                      <td className="px-4 py-3 text-white/80">{u.email}</td>
                      <td className="px-4 py-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-brand-dark/70 px-3 py-2 text-sm text-white focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/50"
                        >
                          <option value="STUDENT">Student</option>
                          <option value="TEACHER">Teacher</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                        <p className={`mt-1 text-xs font-semibold ${badgeMap[u.role]}`}>
                          {u.role}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="rounded-2xl bg-red-500/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-red-500"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {users.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-white/60">
                No users found yet.
              </p>
            )}
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
