import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageContainer from "../components/PageContainer";
import api from "../api/axios";

const cardClass =
  "group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 shadow-lg shadow-black/30 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-2 hover:border-brand-secondary/40 hover:shadow-xl hover:shadow-brand-secondary/10";

export default function TeacherProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("active"); // active, archived, all

  const loadProjects = async () => {
    try {
      const { data } = await api.get(`/api/projects?status=${statusFilter}`);
      setProjects(data);
    } catch (err) {
      console.error("Error loading projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.delete(`/api/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Error deleting project");
    }
  };

  const handleArchive = async (id) => {
    if (!confirm("Archiving makes the project read-only. You can unarchive later. Continue?")) return;
    try {
      await api.patch(`/api/projects/${id}/archive`);
      loadProjects();
    } catch (err) {
      alert(err.response?.data?.message || "Error archiving project");
    }
  };

  const handleUnarchive = async (id) => {
    if (!confirm("Unarchive this project to make it active again?")) return;
    try {
      await api.patch(`/api/projects/${id}/unarchive`);
      loadProjects();
    } catch (err) {
      alert(err.response?.data?.message || "Error unarchiving project");
    }
  };

  useEffect(() => {
    loadProjects();
  }, [statusFilter]);

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
            Projects
          </p>
          <h1 className="mt-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-3xl font-bold text-transparent">
            My Projects
          </h1>
        </div>
        {statusFilter !== "archived" && (
          <Link
            to="/teacher/projects/create"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-accent to-brand-secondary px-6 py-3 text-sm font-bold text-brand-dark shadow-lg shadow-brand-accent/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-brand-accent/40"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="text-lg">✨</span>
              Launch Project
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-secondary to-brand-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </Link>
        )}
      </motion.div>

      {/* Status Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8 flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-sm"
      >
        {[
          { key: "active", label: "Active", icon: "📚" },
          { key: "archived", label: "Archived", icon: "📦" },
          { key: "all", label: "All", icon: "📋" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`relative flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
              statusFilter === tab.key
                ? "bg-gradient-to-r from-brand-accent to-brand-secondary text-brand-dark shadow-lg"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </motion.div>

      <div className="mt-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mb-4 text-4xl animate-pulse">⏳</div>
              <p className="text-white/70">Loading projects...</p>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-dashed border-white/20 bg-gradient-to-br from-white/5 to-white/[0.02] p-12 text-center backdrop-blur-2xl"
          >
            <div className="text-6xl mb-4">
              {statusFilter === "archived" ? "📦" : "📚"}
            </div>
            <p className="text-lg font-semibold text-white/90 mb-2">
              {statusFilter === "archived"
                ? "No Archived Projects"
                : statusFilter === "active"
                ? "No Active Projects"
                : "No Projects Yet"}
            </p>
            <p className="text-white/60">
              {statusFilter === "archived"
                ? "You haven't archived any projects yet."
                : statusFilter === "active"
                ? "Create your first project using the button above."
                : "Create your first project using the button above."}
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cardClass}
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-accent/20 to-brand-secondary/20 text-xl">
                          📚
                        </div>
                        <h2 className="text-xl font-bold text-white">
                          {project.title}
                        </h2>
                        {project.isArchived && (
                          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300 backdrop-blur-sm">
                            Archived
                          </span>
                        )}
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-white/70 line-clamp-3">
                        {project.description || "No description"}
                      </p>
                    </div>
                    {project.deadline && (
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 whitespace-nowrap backdrop-blur-sm">
                        📅 {new Date(project.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <div className="text-center">
                      <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                        Students
                      </p>
                      <p className="mt-1 bg-gradient-to-r from-brand-accent to-brand-secondary bg-clip-text text-3xl font-bold text-transparent">
                        {project.students?.length || 0}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                        Tasks
                      </p>
                      <p className="mt-1 bg-gradient-to-r from-brand-accent to-brand-secondary bg-clip-text text-3xl font-bold text-transparent">
                        {project.tasks?.length || 0}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-3">
                    <Link
                      to={`/teacher/projects/${project.id}`}
                      className="group/btn flex-1 rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-center text-sm font-semibold text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-brand-secondary/40 hover:bg-brand-secondary/10 hover:text-white"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Open Board
                        <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
                      </span>
                    </Link>
                    <div className="flex gap-2">
                      {project.isArchived ? (
                        <button
                          onClick={() => handleUnarchive(project.id)}
                          className="rounded-2xl border border-green-400/30 bg-green-400/10 px-4 py-2.5 text-sm font-semibold text-green-300 backdrop-blur-sm transition-all duration-300 hover:border-green-400/50 hover:bg-green-400/20"
                        >
                          ↺
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleArchive(project.id)}
                            className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-sm font-semibold text-amber-300 backdrop-blur-sm transition-all duration-300 hover:border-amber-400/50 hover:bg-amber-400/20"
                            title="Archive"
                          >
                            📦
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-sm font-semibold text-red-300 backdrop-blur-sm transition-all duration-300 hover:border-red-400/50 hover:bg-red-400/20"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
