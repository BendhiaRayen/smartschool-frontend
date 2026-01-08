import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageContainer from "../components/PageContainer";
import api from "../api/axios";

const statusButtons = ["TODO", "IN_PROGRESS", "DONE"];

const statusConfig = {
  TODO: { icon: "📝", color: "from-gray-500/20 to-slate-500/20", textColor: "text-gray-300", borderColor: "border-gray-400/30" },
  IN_PROGRESS: { icon: "⚡", color: "from-amber-500/20 to-orange-500/20", textColor: "text-amber-300", borderColor: "border-amber-400/30" },
  DONE: { icon: "✅", color: "from-emerald-500/20 to-teal-500/20", textColor: "text-emerald-300", borderColor: "border-emerald-400/30" },
};

export default function StudentProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get(`/api/student/projects/${id}`);
      setProject(data);
    } catch (err) {
      console.error("Error loading project:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await api.patch(`/api/student/tasks/${taskId}/status`, { status });
      load();
    } catch (err) {
      alert("Error updating status");
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading || !project) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mb-4 text-4xl animate-pulse">⏳</div>
            <p className="text-white/70">Loading project...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden rounded-3xl border p-8 shadow-2xl shadow-black/40 ${
            project.isArchived
              ? "border-orange-400/20 bg-gradient-to-br from-orange-400/10 to-brand-surface"
              : "border-white/10 bg-gradient-to-br from-brand-dark via-brand-dark to-brand-surface"
          }`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${
            project.isArchived 
              ? "from-orange-400/5 via-transparent to-orange-400/5"
              : "from-brand-accent/5 via-transparent to-brand-secondary/5"
          }`}></div>
          <div className="relative">
            <div className="mb-4 flex items-center gap-3 flex-wrap">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-accent/20 to-brand-secondary/20 text-xl backdrop-blur-sm">
                📚
              </div>
              <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
                Project brief
              </p>
              {project.isArchived && (
                <span className="rounded-full border border-orange-400/50 bg-orange-400/10 px-3 py-1 text-xs font-bold text-orange-300 backdrop-blur-sm">
                  Archived Project
                </span>
              )}
            </div>
            <h1 className="mt-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-4xl font-bold text-transparent">{project.title}</h1>
            {project.isArchived && (
              <p className="mt-2 text-sm text-orange-300/80">
              This project is archived and read-only. You can view tasks and submissions but cannot make changes.
            </p>
            )}
            <p className="mt-4 text-lg text-white/80">{project.description}</p>
            <div className="mt-6 flex flex-wrap gap-4">
              {project.deadline && (
                <span className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 backdrop-blur-sm">
                  <span>📅</span>
                  <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                </span>
              )}
              <span className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 backdrop-blur-sm">
                <span>👨‍🏫</span>
                <span>Teacher:{" "}
                  <span className="text-brand-secondary">
                    {project.teacher?.profile?.firstName}{" "}
                    {project.teacher?.profile?.lastName}
                  </span>
                </span>
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 shadow-lg shadow-black/30 backdrop-blur-2xl"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          <div className="relative">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-xl backdrop-blur-sm">
                ✅
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
                  Taskboard
                </p>
                <h2 className="mt-1 text-2xl font-bold text-white">My tasks</h2>
              </div>
            </div>

            {project.tasks.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-white/20 bg-white/5 p-8 text-center">
                <div className="text-4xl mb-2">📝</div>
                <p className="text-white/60">No tasks assigned yet.</p>
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                {project.tasks.map((task, index) => {
                  const taskStatusInfo = statusConfig[task.status] || statusConfig.TODO;
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className={`group/task relative rounded-2xl border p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${
                        project.isArchived
                          ? "border-orange-400/20 bg-gradient-to-br from-orange-400/5 to-orange-400/[0.02]"
                          : "border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02]"
                      }`}
                    >
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${taskStatusInfo.color} opacity-0 transition-opacity duration-300 group-hover/task:opacity-100`}></div>
                      <div className="relative">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-2">
                              <span className="text-xl">{taskStatusInfo.icon}</span>
                              <h3 className="text-xl font-bold text-white">
                                {task.title}
                              </h3>
                            </div>
                            <p className="text-sm leading-relaxed text-white/70">{task.description}</p>
                          </div>
                          {task.deadline && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-sm">
                              <span>📅</span>
                              <span>{new Date(task.deadline).toLocaleDateString()}</span>
                            </span>
                          )}
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <div className="flex flex-wrap gap-2">
                            {statusButtons.map((status) => {
                              const btnStatusInfo = statusConfig[status] || statusConfig.TODO;
                              return (
                                <button
                                  key={status}
                                  onClick={() => !project.isArchived && updateStatus(task.id, status)}
                                  disabled={project.isArchived}
                                  className={`group/btn relative overflow-hidden rounded-2xl px-5 py-2.5 text-xs font-bold uppercase tracking-wide transition-all duration-300 ${
                                    project.isArchived
                                      ? "border border-white/10 bg-white/5 text-white/30 cursor-not-allowed"
                                      : task.status === status
                                      ? "bg-gradient-to-r from-brand-accent to-brand-secondary text-brand-dark shadow-lg shadow-brand-accent/30"
                                      : `border ${btnStatusInfo.borderColor} bg-white/5 ${btnStatusInfo.textColor} hover:bg-white/10 hover:scale-105`
                                  }`}
                                >
                                  <span className="relative z-10 flex items-center gap-2">
                                    <span>{btnStatusInfo.icon}</span>
                                    <span>{status.replace("_", " ")}</span>
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                          {project.isArchived ? (
                            <span className="ml-auto rounded-2xl border border-orange-400/30 bg-orange-400/10 px-5 py-2.5 text-xs font-bold text-orange-300/70 cursor-not-allowed backdrop-blur-sm">
                              View Only
                            </span>
                          ) : (
                            <Link
                              to={`/student/tasks/${task.id}/submissions`}
                              className="group/link ml-auto flex items-center gap-2 rounded-2xl border border-brand-secondary/40 bg-brand-secondary/10 px-5 py-2.5 text-xs font-bold text-brand-secondary backdrop-blur-sm transition-all duration-300 hover:bg-brand-secondary/20 hover:scale-105"
                            >
                              <span>📤</span>
                              <span>View Submissions</span>
                              <span className="transition-transform duration-300 group-hover/link:translate-x-1">→</span>
                            </Link>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </PageContainer>
  );
}
