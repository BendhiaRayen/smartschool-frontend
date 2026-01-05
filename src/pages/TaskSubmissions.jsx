import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import api from "../api/axios";

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/40 outline-none";

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
            setTask({ ...task, projectTitle: project.title });
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
      alert(err.response?.data?.message || "Error submitting");
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <p className="text-white/70">Loading...</p>
      </PageContainer>
    );
  }

  if (!task) {
    return (
      <PageContainer>
        <p className="text-white/70">Task not found</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-10">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-brand-dark to-brand-surface p-8 shadow-2xl shadow-black/40">
          <h1 className="text-4xl font-semibold text-white">{task.title}</h1>
          <p className="mt-3 text-white/70">{task.description}</p>
          {task.deadline && (
            <span className="mt-5 inline-flex rounded-full border border-white/10 px-4 py-2 text-xs text-white/60">
              Deadline: {new Date(task.deadline).toLocaleDateString()}
            </span>
          )}
          <span className="ml-3 inline-flex rounded-full border border-white/10 px-4 py-2 text-xs text-white/60">
            Status: {task.status?.replace("_", " ")}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">My Submissions</h2>
          <button
            onClick={() => setShowSubmitForm(true)}
            className="rounded-2xl bg-gradient-to-r from-brand-accent to-brand-secondary px-5 py-3 text-sm font-semibold text-brand-dark shadow-glow transition hover:translate-y-0.5"
          >
            + New Submission
          </button>
        </div>

        {showSubmitForm && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg shadow-black/30">
            <h3 className="text-xl font-semibold text-white mb-4">Submit Work</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="rounded-2xl bg-gradient-to-r from-brand-accent to-brand-secondary px-4 py-2 text-sm font-semibold text-brand-dark shadow-glow"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSubmitForm(false);
                    setForm({ type: "TEXT", content: "", comment: "", file: null });
                  }}
                  className="rounded-2xl border border-white/15 px-4 py-2 text-sm text-white/70 hover:border-white/40"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {submissions.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-10 text-center text-white/60">
            No submissions yet. Create your first submission above.
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-white">
                        Version {submission.version}
                      </h3>
                      <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-secondary">
                        {submission.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-white/60">
                      Submitted: {new Date(submission.submittedAt).toLocaleString()}
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
                  <div className="mt-6 rounded-2xl border border-brand-secondary/30 bg-brand-secondary/10 p-4">
                    <h4 className="text-sm font-semibold text-brand-secondary mb-2">Grade</h4>
                    <p className="text-2xl font-bold text-white">
                      {submission.grade.score} / {submission.grade.maxScore}
                    </p>
                    {submission.grade.rubric && (
                      <p className="mt-2 text-sm text-white/70">{submission.grade.rubric}</p>
                    )}
                    <p className="mt-2 text-xs text-white/60">
                      Graded by {submission.grade.teacher.profile?.firstName}{" "}
                      {submission.grade.teacher.profile?.lastName} on{" "}
                      {new Date(submission.grade.gradedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}

