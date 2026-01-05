import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import api from "../api/axios";

const statusButtons = ["TODO", "IN_PROGRESS", "DONE"];

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
        <p className="text-white/70">Loading project...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-brand-dark to-brand-surface p-8 shadow-2xl shadow-black/40">
          <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
            Project brief
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-white">{project.title}</h1>
          <p className="mt-4 text-white/70">{project.description}</p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/70">
            {project.deadline && (
              <span className="rounded-2xl border border-white/10 px-4 py-2">
                Deadline: {new Date(project.deadline).toLocaleDateString()}
              </span>
            )}
            <span className="rounded-2xl border border-white/10 px-4 py-2">
              Teacher:{" "}
              <span className="text-brand-secondary">
                {project.teacher?.profile?.firstName}{" "}
                {project.teacher?.profile?.lastName}
              </span>
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
                Taskboard
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">My tasks</h2>
            </div>
          </div>

          {project.tasks.length === 0 ? (
            <p className="mt-6 text-white/60">No tasks assigned yet.</p>
          ) : (
            <div className="mt-6 space-y-5">
              {project.tasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {task.title}
                      </h3>
                      <p className="text-sm text-white/60">{task.description}</p>
                    </div>
                    {task.deadline && (
                      <span className="text-xs uppercase tracking-wide text-white/60">
                        {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>

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
                      View Submissions
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
