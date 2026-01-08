import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageContainer from "../components/PageContainer";
import api from "../api/axios";

const cardClass =
  "group relative block rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 shadow-lg shadow-black/30 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-2 hover:border-brand-secondary/40 hover:shadow-xl hover:shadow-brand-secondary/10";

export default function StudentProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get("/api/student/projects");
      setProjects(data);
    } catch (err) {
      console.error("Error loading student projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <p className="text-white/70">Loading your projects...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
          Projects
        </p>
        <h1 className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-3xl font-bold text-transparent">
          My Projects
        </h1>
      </motion.div>

      {projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-10 rounded-3xl border border-dashed border-white/20 bg-gradient-to-br from-white/5 to-white/[0.02] p-12 text-center backdrop-blur-2xl"
        >
          <div className="text-6xl mb-4">📚</div>
          <p className="text-lg font-semibold text-white/90">No Projects Yet</p>
          <p className="mt-2 text-white/60">
            You are not assigned to any projects yet.
          </p>
        </motion.div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, index) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/student/projects/${p.id}`} className={cardClass}>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="relative">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-2xl backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                      📖
                    </div>
                    <h2 className="flex-1 text-xl font-bold text-white">{p.title}</h2>
                  </div>
                  <p className="mb-6 text-sm leading-relaxed text-white/70 line-clamp-3">
                    {p.description || "No description"}
                  </p>

                  <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-white/60">
                        Tasks
                      </span>
                      <span className="bg-gradient-to-r from-brand-accent to-brand-secondary bg-clip-text text-lg font-bold text-transparent">
                        {p.tasksCount ?? p.tasks?.length ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-white/60">
                        Deadline
                      </span>
                      <span className="text-sm font-semibold text-white/90">
                        {p.deadline ? (
                          <span className="flex items-center gap-1">
                            📅 {new Date(p.deadline).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-white/50">None</span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-white/60">
                        Teacher
                      </span>
                      <span className="text-sm font-semibold text-brand-secondary">
                        {p.teacher || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-brand-secondary transition-transform duration-300 group-hover:translate-x-1">
                    <span>View Details</span>
                    <span className="text-lg">→</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
