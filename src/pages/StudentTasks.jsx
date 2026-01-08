import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageContainer from "../components/PageContainer";
import api from "../api/axios";

const statusButtons = ["TODO", "IN_PROGRESS", "DONE"];

const statusConfig = {
  TODO: { icon: "📝", color: "from-gray-500/20 to-slate-500/20", textColor: "text-gray-300", borderColor: "border-gray-400/30" },
  IN_PROGRESS: { icon: "⚡", color: "from-amber-500/20 to-orange-500/20", textColor: "text-amber-300", borderColor: "border-amber-400/30" },
  DONE: { icon: "✅", color: "from-emerald-500/20 to-teal-500/20", textColor: "text-emerald-300", borderColor: "border-emerald-400/30" },
};

export default function StudentTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get("/api/student/tasks");
      setTasks(data);
    } catch (err) {
      console.error("Error loading student tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await api.patch(`/api/student/tasks/${taskId}/status`, { status });
      load();
    } catch (err) {
      alert("Error updating task status");
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mb-4 text-4xl animate-pulse">⏳</div>
            <p className="text-white/70">Loading tasks...</p>
          </div>
        </div>
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
          Task stream
        </p>
        <h1 className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-3xl font-bold text-transparent">
          My Tasks
        </h1>
      </motion.div>

      {tasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-10 rounded-3xl border border-dashed border-white/20 bg-gradient-to-br from-white/5 to-white/[0.02] p-12 text-center backdrop-blur-2xl"
        >
          <div className="text-6xl mb-4">✅</div>
          <p className="text-lg font-semibold text-white/90">No Tasks Yet</p>
          <p className="mt-2 text-white/60">
            You have no assigned tasks yet.
          </p>
        </motion.div>
      ) : (
        <div className="mt-10 space-y-5">
          {tasks.map((task, index) => {
            const statusInfo = statusConfig[task.status] || statusConfig.TODO;
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`group relative rounded-3xl border p-6 shadow-lg shadow-black/30 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  task.project?.isArchived
                    ? "border-orange-400/20 bg-gradient-to-br from-orange-400/5 to-orange-400/[0.02]"
                    : `border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02]`
                }`}
              >
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${statusInfo.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}></div>
                <div className="relative">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-3 flex items-center gap-3">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${statusInfo.color} text-2xl backdrop-blur-sm`}>
                          {statusInfo.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-xl font-bold text-white">{task.title}</h2>
                            {task.project?.isArchived && (
                              <span className="rounded-full border border-orange-400/50 bg-orange-400/10 px-3 py-1 text-xs font-bold text-orange-300 backdrop-blur-sm">
                                Archived Project
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-white/70">{task.description}</p>
                        </div>
                      </div>
                      {task.deadline && (
                        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-sm">
                          <span>📅</span>
                          <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/60 mb-1">
                      Project
                    </p>
                    <p className="text-sm font-semibold text-brand-secondary">
                      {task.project?.title}
                      {task.project?.isArchived && (
                        <span className="ml-2 text-xs text-orange-300/70">
                          (Read-only)
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {statusButtons.map((status) => {
                        const btnStatusInfo = statusConfig[status] || statusConfig.TODO;
                        return (
                          <button
                            key={status}
                            onClick={() => !task.project?.isArchived && updateStatus(task.id, status)}
                            disabled={task.project?.isArchived}
                            className={`group/btn relative overflow-hidden rounded-2xl px-5 py-2.5 text-xs font-bold uppercase tracking-wide transition-all duration-300 ${
                              task.project?.isArchived
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
                    {task.project?.isArchived ? (
                      <span className="ml-auto rounded-2xl border border-orange-400/30 bg-orange-400/10 px-5 py-2.5 text-xs font-bold text-orange-300/70 cursor-not-allowed backdrop-blur-sm">
                        View Only
                      </span>
                    ) : (
                      <Link
                        to={`/student/tasks/${task.id}/submissions`}
                        className="group/link ml-auto flex items-center gap-2 rounded-2xl border border-brand-secondary/40 bg-brand-secondary/10 px-5 py-2.5 text-xs font-bold text-brand-secondary backdrop-blur-sm transition-all duration-300 hover:bg-brand-secondary/20 hover:scale-105"
                      >
                        <span>📤</span>
                        <span>Submissions</span>
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
    </PageContainer>
  );
}
