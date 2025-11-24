import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import api from "../api/axios";

const cardClass =
  "rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30 transition hover:-translate-y-1 hover:border-brand-secondary/40";

export default function TeacherProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      const { data } = await api.get("/api/projects");
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

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <PageContainer>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
            Project studio
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">
            My initiatives
          </h1>
        </div>
        <Link
          to="/teacher/projects/create"
          className="rounded-2xl bg-gradient-to-r from-brand-accent to-brand-secondary px-5 py-3 text-sm font-semibold text-brand-dark shadow-glow transition hover:translate-y-0.5"
        >
          + Launch project
        </Link>
      </div>

      <div className="mt-10">
        {loading ? (
          <p className="text-white/70">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-10 text-center text-white/60">
            No projects yet. Create your first launch above.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2">
            {projects.map((project) => (
              <div key={project.id} className={cardClass}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {project.title}
                    </h2>
                    <p className="mt-2 text-sm text-white/60 line-clamp-3">
                      {project.description || "No description"}
                    </p>
                  </div>
                  {project.deadline && (
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
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
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="rounded-2xl border border-red-400/30 px-4 py-2 text-sm text-red-300 transition hover:border-red-400 hover:text-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
