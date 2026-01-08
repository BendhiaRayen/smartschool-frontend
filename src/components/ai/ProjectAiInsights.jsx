import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjectAiAnalysis } from "../../api/ai";

export default function ProjectAiInsights({ projectId }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProjectAiAnalysis(projectId);
      setAnalysis(data);
    } catch (err) {
      console.error("Error loading AI insights:", err);
      if (err.response?.status === 403) {
        setError("AI insights are only available to teachers/admin.");
      } else {
        setError(err.response?.data?.message || "Error loading AI insights");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      loadAnalysis();
    }
  }, [projectId]);

  const getRiskBadgeClass = (riskLevel) => {
    switch (riskLevel) {
      case "LOW":
        return "border-green-400/50 bg-green-400/10 text-green-300";
      case "MEDIUM":
        return "border-orange-400/50 bg-orange-400/10 text-orange-300";
      case "HIGH":
        return "border-red-400/50 bg-red-400/10 text-red-300";
      default:
        return "border-white/20 bg-white/5 text-white/70";
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "HIGH":
        return "border-red-400/50 bg-red-400/10 text-red-300";
      case "MEDIUM":
        return "border-orange-400/50 bg-orange-400/10 text-orange-300";
      case "LOW":
        return "border-blue-400/50 bg-blue-400/10 text-blue-300";
      default:
        return "border-white/20 bg-white/5 text-white/70";
    }
  };

  const getStudentName = (userId) => {
    if (!analysis?.students) return `User ${userId}`;
    const student = analysis.students.find((s) => s.userId === userId);
    return student?.fullName || `User ${userId}`;
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
        <div className="flex items-center justify-center py-10">
          <p className="text-white/70">Loading AI insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-400/30 bg-red-400/10 p-6 shadow-lg shadow-black/30">
        <p className="text-red-300 mb-4">{error}</p>
        <button
          onClick={loadAnalysis}
          className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm text-red-300 hover:bg-red-400/20 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
        <p className="text-white/70 text-center py-10">
          Not enough data yet. AI insights will appear once tasks/submissions exist.
        </p>
      </div>
    );
  }

  const { projectMetrics, riskyTasks, studentsNeedingAttention, insights, suggestions } = analysis;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
            AI Insights
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Project Analytics</h2>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getRiskBadgeClass(
              projectMetrics.riskLevel
            )}`}
          >
            {projectMetrics.riskLevel} RISK
          </span>
          <span className="text-xs text-white/50">
            Score: {projectMetrics.riskScore}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-white/60 mb-1">Completion Rate</p>
          <p className="text-2xl font-bold text-white">
            {projectMetrics.completionRate.toFixed(1)}%
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-white/60 mb-1">Late Rate</p>
          <p className="text-2xl font-bold text-white">
            {projectMetrics.lateRate.toFixed(1)}%
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-white/60 mb-1">Due Soon (No Submission)</p>
          <p className="text-2xl font-bold text-white">
            {projectMetrics.dueSoonNotSubmittedCount}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-white/60 mb-1">Avg Delay (hours)</p>
          <p className="text-2xl font-bold text-white">
            {projectMetrics.avgDelayHours.toFixed(1)}
          </p>
        </div>
      </div>

      {/* Additional KPI Cards (Optional) */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <p className="text-xs text-white/60 mb-1">Total Tasks</p>
          <p className="text-xl font-semibold text-white">{projectMetrics.totalTasks}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <p className="text-xs text-white/60 mb-1">Approved Tasks</p>
          <p className="text-xl font-semibold text-white">{projectMetrics.approvedTasks}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <p className="text-xs text-white/60 mb-1">Total Submissions</p>
          <p className="text-xl font-semibold text-white">{projectMetrics.totalSubmissions}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Risky Tasks */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Risky Tasks</h3>
          {riskyTasks.length === 0 ? (
            <p className="text-white/60 text-sm">No risky tasks identified.</p>
          ) : (
            <div className="space-y-2">
              {riskyTasks.map((task) => (
                <Link
                  key={task.taskId}
                  to={`/teacher/tasks/${task.taskId}/submissions`}
                  className="block rounded-2xl border border-orange-400/20 bg-orange-400/5 p-4 hover:bg-orange-400/10 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-white text-sm">{task.title}</p>
                      <p className="text-xs text-white/60 mt-1">
                        Assigned to: {getStudentName(task.assignedToUserId)}
                      </p>
                      <p className="text-xs text-white/50 mt-1">
                        Deadline: {new Date(task.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-xs text-orange-300/70 ml-2">
                      {task.reason.replace("_", " ")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Students Needing Attention */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Students Needing Attention</h3>
          {studentsNeedingAttention.length === 0 ? (
            <p className="text-white/60 text-sm">All students are on track.</p>
          ) : (
            <div className="space-y-2">
              {studentsNeedingAttention.map((student) => (
                <div
                  key={student.userId}
                  className="rounded-2xl border border-red-400/20 bg-red-400/5 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white text-sm">{student.fullName}</p>
                      <p className="text-xs text-white/60 mt-1">
                        Reason: {student.topReason.replace("_", " ")}
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-2 py-1 text-xs font-semibold ${getRiskBadgeClass(
                        student.riskLevel
                      )}`}
                    >
                      {student.riskLevel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Insights */}
      {insights && insights.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Insights</h3>
          <ul className="space-y-2">
            {insights.map((insight, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-white/80"
              >
                <span className="text-brand-secondary mt-1">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Suggestions</h3>
          <div className="space-y-3">
            {suggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <span
                    className={`rounded-full border px-2 py-1 text-xs font-semibold ${getPriorityBadgeClass(
                      suggestion.priority
                    )}`}
                  >
                    {suggestion.priority}
                  </span>
                  <span className="text-xs text-white/40">{suggestion.code}</span>
                </div>
                <p className="text-sm font-semibold text-white mb-1">
                  {suggestion.message}
                </p>
                <p className="text-xs text-white/60">{suggestion.why}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

