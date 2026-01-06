import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import api from "../api/axios";

export default function ProjectProgress() {
  const { projectId } = useParams();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProgress = async () => {
    try {
      const { data } = await api.get(`/api/projects/${projectId}/progress`);
      setProgress(data);
    } catch (err) {
      console.error("Error loading progress:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgress();
  }, [projectId]);

  if (loading) {
    return (
      <PageContainer>
        <p className="text-white/70">Loading progress...</p>
      </PageContainer>
    );
  }

  if (!progress) {
    return (
      <PageContainer>
        <p className="text-white/70">Progress not found</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <Link
              to={`/teacher/projects/${projectId}`}
              className="text-sm text-brand-secondary hover:underline mb-2 inline-block"
            >
              ← Back to Project
            </Link>
            <h1 className="text-4xl font-semibold text-white">{progress.projectTitle}</h1>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-brand-dark to-brand-surface p-8 shadow-2xl shadow-black/40">
          <h2 className="text-2xl font-semibold text-white mb-6">Overall Progress</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70">Tasks Completed</span>
                <span className="text-2xl font-bold text-white">
                  {progress.overall.approvedTasks} / {progress.overall.totalTasks}
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-accent to-brand-secondary transition-all duration-500"
                  style={{ width: `${progress.overall.progress}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-white/60">
                {progress.overall.progress.toFixed(1)}% Complete
              </p>
            </div>
          </div>
        </div>

        {progress.teams && progress.teams.length > 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
            <h2 className="text-xl font-semibold text-white mb-4">Team Progress</h2>
            <div className="space-y-4">
              {progress.teams.map((team) => (
                <div key={team.teamId} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">{team.teamName}</span>
                    <span className="text-sm text-white/70">
                      {team.approvedTasks} / {team.totalTasks}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-accent to-brand-secondary transition-all duration-500"
                      style={{ width: `${team.progress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-white/60">{team.progress.toFixed(1)}%</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {progress.students && progress.students.length > 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
            <h2 className="text-xl font-semibold text-white mb-4">Student Progress</h2>
            <div className="space-y-4">
              {progress.students.map((student) => (
                <div
                  key={student.studentId}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">{student.studentName}</span>
                    <span className="text-sm text-white/70">
                      {student.approvedTasks} / {student.totalTasks}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-accent to-brand-secondary transition-all duration-500"
                      style={{ width: `${student.progress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-white/60">{student.progress.toFixed(1)}%</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}


