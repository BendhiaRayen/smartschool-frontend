import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import PageContainer from "../components/PageContainer";
import api from "../api/axios";

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/40 outline-none transition-all duration-300";

export default function TaskSubmissions() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [form, setForm] = useState({
    type: "TEXT",
    content: "",
    comment: "",
    file: null,
  });

  const loadTask = async () => {
    try {
      // Try to get task from student tasks list
      const { data } = await api.get(`/api/student/tasks`);
      const foundTask = data.find((t) => t.id === Number(taskId));
      if (foundTask) {
        setTask(foundTask);
      } else {
        // If not found, try to get from project tasks
        const projects = await api.get(`/api/student/projects`);
        for (const project of projects.data) {
          const task = project.tasks?.find((t) => t.id === Number(taskId));
          if (task) {
            setTask({ 
              ...task, 
              projectTitle: project.title,
              projectIsArchived: project.isArchived || false,
            });
            break;
          }
        }
      }
    } catch (err) {
      console.error("Error loading task:", err);
    }
  };

  const loadSubmissions = async () => {
    try {
      const { data } = await api.get(`/api/tasks/${taskId}/submissions`);
      setSubmissions(data);
    } catch (err) {
      console.error("Error loading submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTask();
    loadSubmissions();
  }, [taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.type === "FILE" && !form.file) {
      alert("Please select a file");
      return;
    }
    if ((form.type === "TEXT" || form.type === "LINK") && !form.content.trim()) {
      alert(`Please provide ${form.type === "TEXT" ? "content" : "link"}`);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("type", form.type);
      if (form.type === "FILE") {
        formData.append("file", form.file);
      } else {
        formData.append("content", form.content);
      }
      if (form.comment) {
        formData.append("comment", form.comment);
      }

      await api.post(`/api/tasks/${taskId}/submissions`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setForm({ type: "TEXT", content: "", comment: "", file: null });
      setShowSubmitForm(false);
      loadSubmissions();
      loadTask();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error submitting";
      alert(errorMessage);
      
      // If submission failed due to restrictions, reload task to get updated status
      if (errorMessage.includes("archived") || errorMessage.includes("approved")) {
        loadTask();
      }
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mb-4 text-4xl animate-pulse">⏳</div>
            <p className="text-white/70">Loading...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!task) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <p className="text-lg font-semibold text-white/90">Task Not Found</p>
            <p className="mt-2 text-white/60">The task you're looking for doesn't exist.</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-dark via-brand-dark to-brand-surface p-8 shadow-2xl shadow-black/40"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 via-transparent to-brand-secondary/5"></div>
          <div className="relative">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-accent/20 to-brand-secondary/20 text-2xl backdrop-blur-sm">
                📝
              </div>
              <h1 className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-4xl font-bold text-transparent">{task.title}</h1>
            </div>
            <p className="mt-3 text-lg text-white/80">{task.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {task.deadline && (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur-sm">
                  <span>📅</span>
                  <span>Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
                </span>
              )}
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur-sm">
                <span>📊</span>
                <span>Status: {task.status?.replace("_", " ")}</span>
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between"
        >
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-xl backdrop-blur-sm">
                📤
              </div>
              <h2 className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-2xl font-bold text-transparent">My Submissions</h2>
            </div>
          </div>
          {(() => {
            const isProjectArchived = task.project?.isArchived || task.projectIsArchived;
            const isTaskApproved = task.reviewStatus === "APPROVED";
            const canSubmit = !isProjectArchived && !isTaskApproved;

            if (!canSubmit) {
              return (
                <div className="text-right">
                  {isProjectArchived && (
                    <p className="mb-2 text-sm font-semibold text-amber-300">
                      ⚠️ Project is archived (read-only)
                    </p>
                  )}
                  {isTaskApproved && (
                    <p className="mb-2 text-sm font-semibold text-green-300">
                      ✅ Task is approved - no further submissions needed
                    </p>
                  )}
                  <button
                    disabled
                    className="rounded-2xl bg-white/10 px-5 py-3 text-sm font-bold text-white/50 cursor-not-allowed backdrop-blur-sm"
                  >
                    + New Submission
                  </button>
                </div>
              );
            }

            return (
              <button
                onClick={() => setShowSubmitForm(true)}
                className="group/btn relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-accent to-brand-secondary px-6 py-3 text-sm font-bold text-brand-dark shadow-lg shadow-brand-accent/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-brand-accent/40"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>✨</span>
                  <span>New Submission</span>
                </span>
              </button>
            );
          })()}
        </motion.div>

        {showSubmitForm && (() => {
          const isProjectArchived = task.project?.isArchived || task.projectIsArchived;
          const isTaskApproved = task.reviewStatus === "APPROVED";
          const canSubmit = !isProjectArchived && !isTaskApproved;

          if (!canSubmit) {
            return (
              <div className="rounded-3xl border border-amber-400/30 bg-amber-400/10 p-8 shadow-lg shadow-black/30">
                <h3 className="text-xl font-semibold text-amber-300 mb-4">Cannot Submit</h3>
                <div className="space-y-2 text-white/80">
                  {isProjectArchived && (
                    <p>⚠️ This project is archived and read-only. You cannot submit to tasks in archived projects.</p>
                  )}
                  {isTaskApproved && (
                    <p>✅ This task has been approved. No further submissions are needed.</p>
                  )}
                </div>
                <button
                  onClick={() => setShowSubmitForm(false)}
                  className="mt-4 rounded-2xl border border-white/15 px-4 py-2 text-sm text-white/70 hover:border-white/40"
                >
                  Close
                </button>
              </div>
            );
          }

          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 shadow-lg shadow-black/30 backdrop-blur-2xl"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-xl backdrop-blur-sm">
                    📝
                  </div>
                  <h3 className="text-xl font-bold text-white">Submit Work</h3>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm text-white/60 mb-2 block">Submission Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value, content: "", file: null })}
                  className={`${inputClass} bg-brand-dark text-white`}
                  style={{ backgroundColor: "#050714", color: "white" }}
                >
                  <option value="TEXT" style={{ backgroundColor: "#050714", color: "white" }}>Text</option>
                  <option value="LINK" style={{ backgroundColor: "#050714", color: "white" }}>Link</option>
                  <option value="FILE" style={{ backgroundColor: "#050714", color: "white" }}>File Upload</option>
                </select>
              </div>

              {form.type === "FILE" ? (
                <div>
                  <label className="text-sm text-white/60 mb-2 block">File (PDF, DOC, DOCX, ZIP)</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.zip"
                    onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
                    className={inputClass}
                  />
                </div>
              ) : (
                <div>
                  <label className="text-sm text-white/60 mb-2 block">
                    {form.type === "TEXT" ? "Content" : "Link URL"}
                  </label>
                  {form.type === "TEXT" ? (
                    <textarea
                      value={form.content}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                      rows={6}
                      className={`${inputClass} resize-none`}
                      placeholder={form.type === "TEXT" ? "Enter your submission content..." : "https://..."}
                      required
                    />
                  ) : (
                    <input
                      type="url"
                      value={form.content}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                      className={inputClass}
                      placeholder="https://..."
                      required
                    />
                  )}
                </div>
              )}

              <div>
                <label className="text-sm text-white/60 mb-2 block">Comment (optional)</label>
                <textarea
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  rows={3}
                  className={`${inputClass} resize-none`}
                  placeholder="Additional notes..."
                />
              </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="group/btn relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-accent to-brand-secondary px-6 py-3 text-sm font-bold text-brand-dark shadow-lg shadow-brand-accent/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-brand-accent/40"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <span>📤</span>
                        <span>Submit</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSubmitForm(false);
                        setForm({ type: "TEXT", content: "", comment: "", file: null });
                      }}
                      className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          );
        })()}

        {submissions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-dashed border-white/20 bg-gradient-to-br from-white/5 to-white/[0.02] p-12 text-center backdrop-blur-2xl"
          >
            <div className="text-6xl mb-4">📭</div>
            <p className="text-lg font-semibold text-white/90">No Submissions Yet</p>
            <p className="mt-2 text-white/60">Create your first submission above.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission, index) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 shadow-lg shadow-black/30 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-xl backdrop-blur-sm">
                          📄
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            Version {submission.version}
                          </h3>
                          <span className="mt-1 inline-flex rounded-full border border-brand-secondary/30 bg-brand-secondary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-secondary backdrop-blur-sm">
                            {submission.status}
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 flex items-center gap-2 text-sm text-white/70">
                        <span>🕐</span>
                        <span>Submitted: {new Date(submission.submittedAt).toLocaleString()}</span>
                      </p>
                    </div>
                  </div>

                <div className="mt-4 space-y-3">
                  {submission.type === "FILE" && submission.fileUrl && (
                    <div>
                      <p className="text-sm text-white/70 mb-2">File:</p>
                      <a
                        href={`http://localhost:4000${submission.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-secondary hover:underline"
                      >
                        {submission.fileName || "Download file"}
                      </a>
                    </div>
                  )}
                  {submission.type === "TEXT" && (
                    <div>
                      <p className="text-sm text-white/70 mb-2">Content:</p>
                      <p className="text-white/80 whitespace-pre-wrap">{submission.content}</p>
                    </div>
                  )}
                  {submission.type === "LINK" && (
                    <div>
                      <p className="text-sm text-white/70 mb-2">Link:</p>
                      <a
                        href={submission.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-secondary hover:underline"
                      >
                        {submission.content}
                      </a>
                    </div>
                  )}
                  {submission.comment && (
                    <div>
                      <p className="text-sm text-white/70 mb-2">Your Comment:</p>
                      <p className="text-white/80">{submission.comment}</p>
                    </div>
                  )}
                </div>

                {submission.feedbacks && submission.feedbacks.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="text-sm font-semibold text-white/80">Teacher Feedback:</h4>
                    {submission.feedbacks.map((feedback) => (
                      <div
                        key={feedback.id}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-white/70">
                            {feedback.teacher.profile?.firstName} {feedback.teacher.profile?.lastName}
                          </span>
                          <span className="text-xs text-white/60">
                            {new Date(feedback.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-white/80 mb-2">{feedback.comment}</p>
                        {feedback.attachmentUrl && (
                          <a
                            href={`http://localhost:4000${feedback.attachmentUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-brand-secondary hover:underline"
                          >
                            View attachment
                          </a>
                        )}
                        <span className="mt-2 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                          {feedback.decision.replace("_", " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                  {submission.grade && (
                    <div className="mt-6 rounded-2xl border border-brand-secondary/30 bg-gradient-to-br from-brand-secondary/10 to-brand-accent/10 p-5 backdrop-blur-sm">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="text-xl">⭐</span>
                        <h4 className="text-sm font-bold text-brand-secondary">Grade</h4>
                      </div>
                      <p className="bg-gradient-to-r from-brand-accent to-brand-secondary bg-clip-text text-3xl font-bold text-transparent">
                        {submission.grade.score} / {submission.grade.maxScore}
                      </p>
                      {submission.grade.rubric && (
                        <p className="mt-3 text-sm leading-relaxed text-white/80">{submission.grade.rubric}</p>
                      )}
                      <p className="mt-3 text-xs text-white/60">
                        Graded by {submission.grade.teacher.profile?.firstName}{" "}
                        {submission.grade.teacher.profile?.lastName} on{" "}
                        {new Date(submission.grade.gradedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}

