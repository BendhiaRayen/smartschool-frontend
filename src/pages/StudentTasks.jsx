import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import api from "../api/axios";

const statusButtons = ["TODO", "IN_PROGRESS", "DONE"];

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
        <p className="text-white/70">Loading tasks...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
          Task stream
        </p>
        <h1 className="text-3xl font-semibold text-white">My tasks</h1>
      </div>

      {tasks.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-white/20 bg-white/5 p-10 text-center text-white/70">
          You have no assigned tasks yet.
        </div>
      ) : (
        <div className="mt-10 space-y-5">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">{task.title}</h2>
                  <p className="text-sm text-white/60">{task.description}</p>
                </div>
                {task.deadline && (
                  <span className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/60">
                    {new Date(task.deadline).toLocaleDateString()}
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm text-white/70">
                Project:{" "}
                <span className="text-brand-secondary">
                  {task.project?.title}
                </span>
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="flex flex-wrap gap-3">
                  {statusButtons.map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(task.id, status)}
                      className={`rounded-2xl px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                        task.status === status
                          ? "bg-gradient-to-r from-brand-accent to-brand-secondary text-brand-dark shadow-glow"
                          : "border border-white/15 text-white/70 hover:border-white/40"
                      }`}
                    >
                      {status.replace("_", " ")}
                    </button>
                  ))}
                </div>
                <Link
                  to={`/student/tasks/${task.id}/submissions`}
                  className="ml-auto rounded-2xl border border-brand-secondary/40 bg-brand-secondary/10 px-4 py-2 text-xs font-semibold text-brand-secondary transition hover:bg-brand-secondary/20"
                >
                  Submissions
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
