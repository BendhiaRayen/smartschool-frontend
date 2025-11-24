import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import api from "../api/axios";

const cardClass =
  "rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30 transition hover:-translate-y-1 hover:border-brand-secondary/40";

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
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
          Learner view
        </p>
        <h1 className="text-3xl font-semibold text-white">My projects</h1>
      </div>

      {projects.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-white/20 bg-white/5 p-10 text-center text-white/70">
          You are not assigned to any projects yet.
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Link key={p.id} to={`/student/projects/${p.id}`} className={cardClass}>
              <h2 className="text-xl font-semibold text-white">{p.title}</h2>
              <p className="mt-2 text-sm text-white/60 line-clamp-3">
                {p.description || "No description"}
              </p>

              <div className="mt-6 space-y-2 text-sm text-white/70">
                <p>
                  Tasks:{" "}
                  <span className="text-white">
                    {p.tasksCount ?? p.tasks?.length ?? 0}
                  </span>
                </p>
                <p>
                  Deadline:{" "}
                  <span className="text-white">
                    {p.deadline ? new Date(p.deadline).toLocaleDateString() : "None"}
                  </span>
                </p>
                <p>
                  Teacher:{" "}
                  <span className="text-brand-secondary">
                    {p.teacher || "N/A"}
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
