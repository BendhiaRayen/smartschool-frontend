import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageContainer from "../components/PageContainer";
import api from "../api/axios";

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/40 outline-none transition-all duration-300";

export default function TeacherTaskReview() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({
    comment: "",
    decision: "CHANGES_REQUESTED",
    file: null,
  });
  const [gradeForm, setGradeForm] = useState({
    score: "",
    maxScore: "100",
    rubric: "",
    taskStatus: "APPROVED",
  });

  const loadTask = async () => {
    try {
      // Try active projects first
      let data = await api.get(`/api/projects?status=active`).then(res => res.data);
      // Find task in active projects
      for (const project of data) {
        const foundTask = project.tasks?.find((t) => t.id === Number(taskId));
        if (foundTask) {
          setTask({ ...foundTask, projectTitle: project.title });
          return;
        }
      }
      
      // If not found, try archived projects
      data = await api.get(`/api/projects?status=archived`).then(res => res.data);
      for (const project of data) {
        const foundTask = project.tasks?.find((t) => t.id === Number(taskId));
        if (foundTask) {
          setTask({ ...foundTask, projectTitle: project.title });
          return;
        }
      }
      
      // If still not found, try all projects
      data = await api.get(`/api/projects?status=all`).then(res => res.data);
      for (const project of data) {
        const foundTask = project.tasks?.find((t) => t.id === Number(taskId));
        if (foundTask) {
          setTask({ ...foundTask, projectTitle: project.title });
          return;
        }
      }
    } catch (err) {
      console.error("Error loading task:", err);
    }
  };

  const loadSubmissions = async () => {
    try {
      const { data } = await api.get(`/api/tasks/${taskId}/submissions/all`);
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

  const handleAddFeedback = async (submissionId) => {
    if (!feedbackForm.comment.trim()) {
      alert("Comment is required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("comment", feedbackForm.comment);
      formData.append("decision", feedbackForm.decision);
      if (feedbackForm.file) {
        formData.append("attachment", feedbackForm.file);
      }

      await api.post(`/api/submissions/${submissionId}/feedback`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFeedbackForm({ comment: "", decision: "CHANGES_REQUESTED", file: null });
      setSelectedSubmission(null);
      loadSubmissions();
      loadTask();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding feedback");
    }
  };

  const handleGrade = async (submissionId) => {
    if (!gradeForm.score || !gradeForm.maxScore) {
      alert("Score and max score are required");
      return;
    }

    try {
      await api.post(`/api/submissions/${submissionId}/grade`, {
        score: Number(gradeForm.score),
        maxScore: Number(gradeForm.maxScore),
        rubric: gradeForm.rubric || null,
        taskStatus: gradeForm.taskStatus,
      });

      setGradeForm({ score: "", maxScore: "100", rubric: "", taskStatus: "APPROVED" });
      setSelectedSubmission(null);
      loadSubmissions();
      loadTask();
    } catch (err) {
      alert(err.response?.data?.message || "Error grading submission");
    }
  };

  // Group submissions by submitter
  const groupedSubmissions = submissions.reduce((acc, sub) => {
    const key = `student-${sub.submittedBy}`;
    if (!acc[key]) {
      acc[key] = {
        submitter: {
          type: "student",
          name: `${sub.author.profile?.firstName} ${sub.author.profile?.lastName}`,
          id: sub.submittedBy,
        },
        submissions: [],
      };
    }
    acc[key].submissions.push(sub);
    return acc;
  }, {});

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
            <Link
              to={`/teacher/projects/${task.projectId}`}
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-secondary transition-all duration-300 hover:translate-x-1 hover:underline"
            >
              <span>←</span>
              <span>Back to Project</span>
            </Link>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-accent/20 to-brand-secondary/20 text-2xl backdrop-blur-sm">
                📋
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
                <span>Workflow: {task.status?.replace("_", " ")}</span>
                {task.reviewStatus && (
                  <span className="ml-2">| Review: {task.reviewStatus.replace("_", " ")}</span>
                )}
              </span>
            </div>
          </div>
        </motion.div>

        {Object.keys(groupedSubmissions).length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-dashed border-white/20 bg-gradient-to-br from-white/5 to-white/[0.02] p-12 text-center backdrop-blur-2xl"
          >
            <div className="text-6xl mb-4">📭</div>
            <p className="text-lg font-semibold text-white/90">No Submissions Yet</p>
            <p className="mt-2 text-white/60">No submissions yet for this task.</p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {Object.values(groupedSubmissions).map((group, idx) => {
              const latestSubmission = group.submissions[0]; // Already sorted by version desc
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 shadow-lg shadow-black/30 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <div className="relative">
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <div className="mb-2 flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-xl backdrop-blur-sm">
                            👤
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              {group.submitter.name}
                            </h3>
                            <p className="mt-1 text-sm font-semibold text-white/70">
                              {group.submissions.length} submission{group.submissions.length > 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const submission = selectedSubmission?.id === latestSubmission.id ? null : latestSubmission;
                            setSelectedSubmission(submission);
                            // Reset forms when opening/closing
                            if (submission) {
                              // Check if there's already ACCEPTED feedback
                              const hasAcceptedFeedback = submission.feedbacks?.some((f) => f.decision === "ACCEPTED");
                              setFeedbackForm({
                                comment: "",
                                decision: hasAcceptedFeedback ? "ACCEPTED" : "CHANGES_REQUESTED",
                                file: null,
                              });
                              setGradeForm({ score: "", maxScore: "100", rubric: "", taskStatus: "APPROVED" });
                            } else {
                              setFeedbackForm({ comment: "", decision: "CHANGES_REQUESTED", file: null });
                              setGradeForm({ score: "", maxScore: "100", rubric: "", taskStatus: "APPROVED" });
                            }
                          }}
                          className={`rounded-2xl border px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
                            selectedSubmission?.id === latestSubmission.id
                              ? "border-amber-400/30 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20"
                              : "border-brand-secondary/40 bg-brand-secondary/10 text-brand-secondary hover:bg-brand-secondary/20 hover:scale-105"
                          }`}
                        >
                          {selectedSubmission?.id === latestSubmission.id ? "✕ Close" : "📝 Review"}
                        </button>
                      </div>
                    </div>

                  <div className="space-y-3">
                    {group.submissions.map((submission) => (
                      <div
                        key={submission.id}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-semibold text-white">
                              Version {submission.version}
                            </span>
                            <span className="ml-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                              {submission.status}
                            </span>
                            <p className="text-xs text-white/60 mt-1">
                              {new Date(submission.submittedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 space-y-2">
                          {submission.type === "FILE" && submission.fileUrl && (
                            <div>
                            <a
                              href={`http://localhost:4000${submission.fileUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand-secondary hover:underline text-sm"
                            >
                              {submission.fileName || "Download file"}
                            </a>
                            </div>
                          )}
                          {submission.type === "TEXT" && (
                            <p className="text-sm text-white/80 whitespace-pre-wrap">
                              {submission.content}
                            </p>
                          )}
                          {submission.type === "LINK" && (
                            <a
                              href={submission.content}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand-secondary hover:underline text-sm"
                            >
                              {submission.content}
                            </a>
                          )}
                          {submission.comment && (
                            <p className="text-xs text-white/60 italic">"{submission.comment}"</p>
                          )}
                        </div>

                        {submission.feedbacks && submission.feedbacks.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {submission.feedbacks.map((feedback) => (
                              <div
                                key={feedback.id}
                                className="rounded-lg border border-white/10 bg-white/5 p-3"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-white/70">
                                    {feedback.teacher.profile?.firstName}{" "}
                                    {feedback.teacher.profile?.lastName}
                                  </span>
                                  <span className="text-xs text-white/60">
                                    {new Date(feedback.createdAt).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-sm text-white/80">{feedback.comment}</p>
                                {feedback.attachmentUrl && (
                                  <a
                                    href={`http://localhost:4000${feedback.attachmentUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-brand-secondary hover:underline"
                                  >
                                    View attachment
                                  </a>
                                )}
                                <span className="mt-2 inline-flex rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/60">
                                  {feedback.decision.replace("_", " ")}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {submission.grade && (
                          <div className="mt-4 rounded-lg border border-brand-secondary/30 bg-brand-secondary/10 p-3">
                            <p className="text-lg font-bold text-white">
                              Grade: {submission.grade.score} / {submission.grade.maxScore}
                            </p>
                            {submission.grade.rubric && (
                              <p className="text-sm text-white/70 mt-1">{submission.grade.rubric}</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selectedSubmission && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 shadow-lg shadow-black/30 backdrop-blur-2xl"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="relative">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-xl backdrop-blur-sm">
                  ✍️
                </div>
                <h3 className="text-xl font-bold text-white">
                  Review Submission v{selectedSubmission.version}
                </h3>
              </div>

            {!selectedSubmission.grade ? (
              <>
                {/* Decision Selector */}
                <div className="mb-6">
                  <label className="text-sm text-white/60 mb-2 block">Review Decision</label>
                  <select
                    value={feedbackForm.decision}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, decision: e.target.value })}
                    className={`${inputClass} bg-brand-dark text-white`}
                    style={{ backgroundColor: "#050714", color: "white" }}
                  >
                    <option value="CHANGES_REQUESTED" style={{ backgroundColor: "#050714", color: "white" }}>
                      Changes Requested
                    </option>
                    <option value="ACCEPTED" style={{ backgroundColor: "#050714", color: "white" }}>
                      Accepted (Ready to Grade)
                    </option>
                  </select>
                </div>

                {/* Show Feedback Form when CHANGES_REQUESTED */}
                {feedbackForm.decision === "CHANGES_REQUESTED" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-white/60 mb-2 block">Feedback Comment *</label>
                      <textarea
                        value={feedbackForm.comment}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
                        rows={5}
                        className={`${inputClass} resize-none`}
                        placeholder="Provide feedback to the student..."
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm text-white/60 mb-2 block">Attachment (optional)</label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.zip"
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, file: e.target.files[0] })}
                        className={inputClass}
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAddFeedback(selectedSubmission.id)}
                        className="group/btn relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-accent to-brand-secondary px-5 py-2.5 text-sm font-bold text-brand-dark shadow-lg shadow-brand-accent/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-brand-accent/40"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <span>💬</span>
                          <span>Add Feedback</span>
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSubmission(null);
                          setFeedbackForm({ comment: "", decision: "CHANGES_REQUESTED", file: null });
                        }}
                        className="rounded-2xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Show Grading Form when ACCEPTED */}
                {feedbackForm.decision === "ACCEPTED" && (
                  <div className="space-y-4">
                    {/* Check if task is DONE or deadline passed */}
                    {(() => {
                      const isTaskDone = task.status === "DONE";
                      const isDeadlinePassed = task.deadline ? new Date() > new Date(task.deadline) : false;
                      const canGrade = isTaskDone || isDeadlinePassed;
                      
                      if (!canGrade) {
                        return (
                          <div className="rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-4">
                            <p className="text-sm text-yellow-300">
                              ⚠️ Cannot grade this task yet. The student must mark the task as DONE first, or the deadline must have passed.
                            </p>
                            <p className="text-xs text-yellow-300/70 mt-2">
                              Current workflow status: {task.status?.replace("_", " ")} | 
                              {task.reviewStatus && ` Review status: ${task.reviewStatus.replace("_", " ")} | `}
                              {task.deadline ? ` Deadline: ${new Date(task.deadline).toLocaleDateString()}` : " No deadline"}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    })()}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-white/60 mb-2 block">Score *</label>
                        <input
                          type="number"
                          value={gradeForm.score}
                          onChange={(e) => setGradeForm({ ...gradeForm, score: e.target.value })}
                          className={inputClass}
                          min="0"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm text-white/60 mb-2 block">Max Score *</label>
                        <input
                          type="number"
                          value={gradeForm.maxScore}
                          onChange={(e) => setGradeForm({ ...gradeForm, maxScore: e.target.value })}
                          className={inputClass}
                          min="1"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-white/60 mb-2 block">Rubric/Criteria (optional)</label>
                      <textarea
                        value={gradeForm.rubric}
                        onChange={(e) => setGradeForm({ ...gradeForm, rubric: e.target.value })}
                        rows={3}
                        className={`${inputClass} resize-none`}
                        placeholder="Additional grading notes..."
                      />
                    </div>

                    <div>
                      <label className="text-sm text-white/60 mb-2 block">Task Status</label>
                      <select
                        value={gradeForm.taskStatus}
                        onChange={(e) => setGradeForm({ ...gradeForm, taskStatus: e.target.value })}
                        className={`${inputClass} bg-brand-dark text-white`}
                        style={{ backgroundColor: "#050714", color: "white" }}
                      >
                        <option value="APPROVED" style={{ backgroundColor: "#050714", color: "white" }}>
                          Approved
                        </option>
                        <option value="REJECTED" style={{ backgroundColor: "#050714", color: "white" }}>
                          Rejected
                        </option>
                        <option value="CHANGES_REQUESTED" style={{ backgroundColor: "#050714", color: "white" }}>
                          Changes Requested
                        </option>
                      </select>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={async () => {
                          // Check if task is DONE or deadline passed
                          const isTaskDone = task.status === "DONE";
                          const isDeadlinePassed = task.deadline ? new Date() > new Date(task.deadline) : false;
                          
                          if (!isTaskDone && !isDeadlinePassed) {
                            alert("Cannot grade task. Task must be marked as DONE by the student, or the deadline must have passed.");
                            return;
                          }

                          // If decision is ACCEPTED and no ACCEPTED feedback exists yet, add feedback first
                          const hasAcceptedFeedback = selectedSubmission.feedbacks?.some((f) => f.decision === "ACCEPTED");
                          if (feedbackForm.decision === "ACCEPTED" && !hasAcceptedFeedback) {
                            try {
                              const formData = new FormData();
                              formData.append("comment", feedbackForm.comment || "Accepted - ready for grading");
                              formData.append("decision", "ACCEPTED");
                              if (feedbackForm.file) {
                                formData.append("attachment", feedbackForm.file);
                              }
                              await api.post(`/api/submissions/${selectedSubmission.id}/feedback`, formData, {
                                headers: { "Content-Type": "multipart/form-data" },
                              });
                            } catch (err) {
                              console.error("Error adding feedback:", err);
                              alert(err.response?.data?.message || "Error adding feedback");
                              return;
                            }
                          }
                          // Then grade
                          await handleGrade(selectedSubmission.id);
                        }}
                        disabled={(() => {
                          const isTaskDone = task.status === "DONE";
                          const isDeadlinePassed = task.deadline ? new Date() > new Date(task.deadline) : false;
                          return !isTaskDone && !isDeadlinePassed;
                        })()}
                        className="group/btn relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-accent to-brand-secondary px-5 py-2.5 text-sm font-bold text-brand-dark shadow-lg shadow-brand-accent/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-xl hover:shadow-brand-accent/40"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <span>⭐</span>
                          <span>Grade & Update Status</span>
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSubmission(null);
                          setFeedbackForm({ comment: "", decision: "CHANGES_REQUESTED", file: null });
                          setGradeForm({ score: "", maxScore: "100", rubric: "", taskStatus: "APPROVED" });
                        }}
                        className="rounded-2xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <div className="rounded-2xl border border-brand-secondary/30 bg-gradient-to-br from-brand-secondary/10 to-brand-accent/10 p-5 backdrop-blur-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-xl">⭐</span>
                    <h4 className="text-sm font-bold text-brand-secondary">Grade</h4>
                  </div>
                  <p className="bg-gradient-to-r from-brand-accent to-brand-secondary bg-clip-text text-3xl font-bold text-transparent">
                    {selectedSubmission.grade.score} / {selectedSubmission.grade.maxScore}
                  </p>
                  {selectedSubmission.grade.rubric && (
                    <p className="mt-3 text-sm leading-relaxed text-white/80">{selectedSubmission.grade.rubric}</p>
                  )}
                </div>
                <p className="text-sm font-semibold text-white/60">This submission has already been graded.</p>
              </div>
            )}
            </div>
          </motion.div>
        )}
      </div>
    </PageContainer>
  );
}

