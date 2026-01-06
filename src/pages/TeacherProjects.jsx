import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import api from "../api/axios";

const cardClass =
  "rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30 transition hover:-translate-y-1 hover:border-brand-secondary/40";

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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
            Projects
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">
            My Projects
          </h1>
        </div>
        {statusFilter !== "archived" && (
          <Link
            to="/teacher/projects/create"
            className="rounded-2xl bg-gradient-to-r from-brand-accent to-brand-secondary px-5 py-3 text-sm font-semibold text-brand-dark shadow-glow transition hover:translate-y-0.5"
          >
            + Launch project
          </Link>
        )}
      </div>

      {/* Status Filter Tabs */}
      <div className="mt-8 flex gap-2 border-b border-white/10">
        <button
          onClick={() => setStatusFilter("active")}
          className={`px-4 py-2 text-sm font-semibold transition ${
            statusFilter === "active"
              ? "border-b-2 border-brand-secondary text-brand-secondary"
              : "text-white/60 hover:text-white"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setStatusFilter("archived")}
          className={`px-4 py-2 text-sm font-semibold transition ${
            statusFilter === "archived"
              ? "border-b-2 border-brand-secondary text-brand-secondary"
              : "text-white/60 hover:text-white"
          }`}
        >
          Archived
        </button>
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-4 py-2 text-sm font-semibold transition ${
            statusFilter === "all"
              ? "border-b-2 border-brand-secondary text-brand-secondary"
              : "text-white/60 hover:text-white"
          }`}
        >
          All
        </button>
      </div>

      <div className="mt-10">
        {loading ? (
          <p className="text-white/70">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-10 text-center text-white/60">
            {statusFilter === "archived"
              ? "No archived projects yet."
              : statusFilter === "active"
              ? "No active projects yet. Create your first launch above."
              : "No projects yet. Create your first launch above."}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2">
            {projects.map((project) => (
              <div key={project.id} className={cardClass}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold text-white">
                        {project.title}
                      </h2>
                      {project.isArchived && (
                        <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-xs font-semibold text-amber-300">
                          Archived
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-white/60 line-clamp-3">
                      {project.description || "No description"}
                    </p>
                  </div>
                  {project.deadline && (
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60 whitespace-nowrap">
                      {new Date(project.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-white/70">
                  <div>
                    Students
                    <p className="text-2xl font-semibold text-white">
                      {project.students?.length || 0}
                    </p>
                  </div>
                  <div>
                    Tasks
                    <p className="text-2xl font-semibold text-white">
                      {project.tasks?.length || 0}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <Link
                    to={`/teacher/projects/${project.id}`}
                    className="rounded-2xl border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:border-white/40 hover:text-white"
                  >
                    Open board
                  </Link>
                  <div className="flex gap-2">
                    {project.isArchived ? (
                      <button
                        onClick={() => handleUnarchive(project.id)}
                        className="rounded-2xl border border-green-400/30 px-4 py-2 text-sm text-green-300 transition hover:border-green-400 hover:text-green-200"
                      >
                        Unarchive
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleArchive(project.id)}
                          className="rounded-2xl border border-amber-400/30 px-4 py-2 text-sm text-amber-300 transition hover:border-amber-400 hover:text-amber-200"
                        >
                          Archive
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="rounded-2xl border border-red-400/30 px-4 py-2 text-sm text-red-300 transition hover:border-red-400 hover:text-red-200"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
