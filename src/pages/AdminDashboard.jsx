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
  const [stats, setStats] = useState(null);
  const [timeSeries, setTimeSeries] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);
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

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      setStatsError(null);
      const [statsData, timeSeriesData] = await Promise.all([
        api.get("/api/admin/dashboard/stats", {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        api.get("/api/admin/dashboard/stats/timeseries?range=30d", {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      ]);
      setStats(statsData.data);
      setTimeSeries(timeSeriesData.data);
    } catch (err) {
      console.error("❌ Error fetching stats:", err);
      setStatsError(err.response?.data?.message || "Error loading statistics");
    } finally {
      setStatsLoading(false);
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
    fetchStats();
  }, []);

  return (
    <PageContainer>
      <section className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-brand-dark to-brand-surface px-6 py-8 shadow-2xl shadow-black/40">
          <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
            Admin control
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-white">
            Admin Dashboard
          </h1>
          <p className="mt-3 text-white/70">
            System statistics and user management.
          </p>
        </div>

        {/* STATISTICS SECTION */}
        {statsLoading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/70">
            Loading statistics...
          </div>
        ) : statsError ? (
          <div className="rounded-3xl border border-red-400/30 bg-red-400/10 p-6">
            <p className="text-red-300 mb-4">{statsError}</p>
            <button
              onClick={fetchStats}
              className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm text-red-300 hover:bg-red-400/20"
            >
              Retry
            </button>
          </div>
        ) : stats ? (
          <>
            {/* KPI CARDS */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Users Card */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
                <p className="text-xs uppercase tracking-[0.3em] text-brand-secondary mb-2">
                  Users
                </p>
                <p className="text-3xl font-bold text-white">{stats.users.totalUsers}</p>
                <div className="mt-4 space-y-1 text-sm text-white/60">
                  <p>Students: {stats.users.totalStudents}</p>
                  <p>Teachers: {stats.users.totalTeachers}</p>
                  <p>Admins: {stats.users.totalAdmins}</p>
                </div>
              </div>

              {/* Projects Card */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
                <p className="text-xs uppercase tracking-[0.3em] text-brand-secondary mb-2">
                  Projects
                </p>
                <p className="text-3xl font-bold text-white">{stats.projects.totalProjects}</p>
                <div className="mt-4 space-y-1 text-sm text-white/60">
                  <p>Active: {stats.projects.activeProjects}</p>
                  <p>Archived: {stats.projects.archivedProjects}</p>
                </div>
              </div>

              {/* Tasks Card */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
                <p className="text-xs uppercase tracking-[0.3em] text-brand-secondary mb-2">
                  Tasks
                </p>
                <p className="text-3xl font-bold text-white">{stats.tasks.totalTasks}</p>
                <div className="mt-4 space-y-1 text-sm text-white/60">
                  <p>Approved: {stats.tasks.approvedTasks}</p>
                  <p>In Progress: {stats.tasks.tasksByWorkflowStatus.IN_PROGRESS}</p>
                </div>
              </div>

              {/* Submissions Card */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
                <p className="text-xs uppercase tracking-[0.3em] text-brand-secondary mb-2">
                  Submissions
                </p>
                <p className="text-3xl font-bold text-white">{stats.submissions.totalSubmissionsAllTime}</p>
                <div className="mt-4 space-y-1 text-sm text-white/60">
                  <p>This Week: {stats.submissions.submissionsThisWeek}</p>
                  <p>Late This Week: {stats.submissions.lateSubmissionsThisWeek}</p>
                </div>
              </div>
            </div>

            {/* CHARTS SECTION */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Submissions Chart */}
              {timeSeries && (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Submissions (Last 30 Days)
                  </h3>
                  <div className="space-y-2">
                    {timeSeries.submissionsPerDay.map((day, idx) => {
                      const maxCount = Math.max(...timeSeries.submissionsPerDay.map((d) => d.count), 1);
                      const percentage = (day.count / maxCount) * 100;
                      return (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="text-xs text-white/60 w-20">
                            {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                          <div className="flex-1 bg-white/5 rounded-full h-6 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-brand-accent to-brand-secondary transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-white/80 w-8 text-right">{day.count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tasks by Status Chart */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
                <h3 className="text-xl font-semibold text-white mb-4">Tasks by Review Status</h3>
                <div className="space-y-3">
                  {Object.entries(stats.tasks.tasksByReviewStatus)
                    .filter(([status, count]) => count > 0)
                    .map(([status, count]) => {
                      const total = Object.values(stats.tasks.tasksByReviewStatus).reduce((a, b) => a + b, 0);
                      const percentage = total > 0 ? (count / total) * 100 : 0;
                      return (
                        <div key={status}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-white/80">{status || "No Status"}</span>
                            <span className="text-sm font-semibold text-white">{count}</span>
                          </div>
                          <div className="bg-white/5 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-brand-accent to-brand-secondary"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* MOST ACTIVE PROJECTS TABLE */}
            {stats.mostActiveProjects.length > 0 && (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
                <h3 className="text-xl font-semibold text-white mb-4">Most Active Projects (Last 30 Days)</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/5 text-sm">
                    <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/60">
                      <tr>
                        <th className="px-4 py-3 text-left">Project Name</th>
                        <th className="px-4 py-3 text-right">Submissions (30d)</th>
                        <th className="px-4 py-3 text-right">Total Tasks</th>
                        <th className="px-4 py-3 text-right">Approved Tasks</th>
                        <th className="px-4 py-3 text-right">Approval Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {stats.mostActiveProjects.map((project) => (
                        <tr
                          key={project.projectId}
                          className="bg-white/[0.02] transition hover:bg-white/[0.07]"
                        >
                          <td className="px-4 py-3 font-medium text-white">{project.projectName}</td>
                          <td className="px-4 py-3 text-right text-white/80">{project.submissionsCount}</td>
                          <td className="px-4 py-3 text-right text-white/80">{project.tasksCount}</td>
                          <td className="px-4 py-3 text-right text-white/80">{project.approvedTasksCount}</td>
                          <td className="px-4 py-3 text-right text-brand-secondary">
                            {project.approvedTasksPercentage.toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : null}

        {/* USER MANAGEMENT SECTION */}
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
