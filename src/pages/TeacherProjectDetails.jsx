import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageContainer from "../components/PageContainer";
import api from "../api/axios";
import ProjectAiInsights from "../components/ai/ProjectAiInsights";
import { useAuthStore } from "../store/auth";

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/40 outline-none transition-all duration-300";

// Status buttons removed - only students can change task status

export default function TeacherProjectDetails() {
  const { id } = useParams();
  const { user } = useAuthStore();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    deadline: "",
    assignedTo: "",
  });
  const [editingProject, setEditingProject] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    deadline: "",
  });
  const [editingTask, setEditingTask] = useState(null);
  const [taskEditForm, setTaskEditForm] = useState({
    title: "",
    description: "",
    deadline: "",
    assignedTo: "",
  });

  const loadProject = async () => {
    try {
      const { data } = await api.get(`/api/projects/${id}`);
      setProject(data);
    } catch (err) {
      console.error("Error loading project:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      const { data } = await api.get("/api/users/students");
      setStudents(data);
    } catch (err) {
      console.error("Error loading students:", err);
    }
  };

  useEffect(() => {
    loadProject();
    loadStudents();
  }, [id]);

  useEffect(() => {
    if (project && !editingProject) {
      setProjectForm({
        title: project.title || "",
        description: project.description || "",
        deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : "",
      });
    }
  }, [project, editingProject]);

  const addTask = async (e) => {
    e.preventDefault();
    
    // Validate deadline is not in the past
    if (taskForm.deadline) {
      const deadlineDate = new Date(taskForm.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate < today) {
        alert("Task deadline cannot be in the past");
        return;
      }
      
      // Validate task deadline is not before project deadline
      if (project.deadline) {
        const projectDeadline = new Date(project.deadline);
        projectDeadline.setHours(0, 0, 0, 0);
        
        if (deadlineDate > projectDeadline) {
          alert("Task deadline cannot be after the project deadline");
          return;
        }
      }
    }
    
    try {
      const payload = {
        projectId: Number(id),
        title: taskForm.title,
        description: taskForm.description,
        deadline: taskForm.deadline,
      };

      if (taskForm.assignedTo !== "") {
        payload.assignedTo = Number(taskForm.assignedTo);
      }

      await api.post("/api/tasks", payload);

      setTaskForm({ 
        title: "", 
        description: "", 
        deadline: "", 
        assignedTo: ""
      });
      loadProject();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating task");
    }
  };

  // Task status updates are only available to students

  const addStudent = async (studentId) => {
    try {
      await api.post("/api/projects/add-student", {
        projectId: Number(id),
        studentId,
      });

      loadProject();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding student");
    }
  };

  const removeStudent = async (studentId) => {
    if (!confirm("Are you sure you want to remove this student from the project?")) return;
    try {
      await api.delete(`/api/projects/${id}/students/${studentId}`);
      loadProject();
    } catch (err) {
      alert(err.response?.data?.message || "Error removing student");
    }
  };

  const updateProject = async (e) => {
    e.preventDefault();
    
    // Validate deadline is not in the past
    if (projectForm.deadline) {
      const deadlineDate = new Date(projectForm.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate < today) {
        alert("Deadline cannot be in the past");
        return;
      }
    }
    
    try {
      await api.patch(`/api/projects/${id}`, projectForm);
      setEditingProject(false);
      loadProject();
    } catch (err) {
      alert(err.response?.data?.message || "Error updating project");
    }
  };

  const deleteTask = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/api/tasks/${taskId}`);
      loadProject();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting task");
    }
  };

  const startEditTask = (task) => {
    setEditingTask(task.id);
    setTaskEditForm({
      title: task.title || "",
      description: task.description || "",
      deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : "",
      assignedTo: task.assignedTo ? task.assignedTo.toString() : "",
    });
  };

  const cancelEditTask = () => {
    setEditingTask(null);
    setTaskEditForm({
      title: "",
      description: "",
      deadline: "",
      assignedTo: "",
    });
  };

  const updateTask = async (taskId) => {
    // Validate deadline is not in the past
    if (taskEditForm.deadline) {
      const deadlineDate = new Date(taskEditForm.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate < today) {
        alert("Task deadline cannot be in the past");
        return;
      }
      
      // Validate task deadline is not after project deadline
      if (project.deadline) {
        const projectDeadline = new Date(project.deadline);
        projectDeadline.setHours(0, 0, 0, 0);
        
        if (deadlineDate > projectDeadline) {
          alert("Task deadline cannot be after the project deadline");
          return;
        }
      }
    }
    
    try {
      const payload = {
        title: taskEditForm.title,
        description: taskEditForm.description,
        deadline: taskEditForm.deadline,
      };

      if (taskEditForm.assignedTo !== "") {
        payload.assignedTo = Number(taskEditForm.assignedTo);
      }

      await api.patch(`/api/tasks/${taskId}`, payload);
      setEditingTask(null);
      loadProject();
    } catch (err) {
      alert(err.response?.data?.message || "Error updating task");
    }
  };

  const removeStudentFromTask = async (taskId) => {
    if (!confirm("Are you sure you want to unassign this student from the task?")) return;
    try {
      await api.delete(`/api/tasks/${taskId}/student`);
      loadProject();
    } catch (err) {
      alert(err.response?.data?.message || "Error removing student from task");
    }
  };


  const handleArchive = async () => {
    if (!confirm("Archiving makes the project read-only. You can unarchive later. Continue?")) return;
    try {
      await api.patch(`/api/projects/${id}/archive`);
      loadProject();
    } catch (err) {
      alert(err.response?.data?.message || "Error archiving project");
    }
  };

  const handleUnarchive = async () => {
    if (!confirm("Unarchive this project to make it active again?")) return;
    try {
      await api.patch(`/api/projects/${id}/unarchive`);
      loadProject();
    } catch (err) {
      alert(err.response?.data?.message || "Error unarchiving project");
    }
  };

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

  const isArchived = project.isArchived;

  return (
    <PageContainer>
      <div className="space-y-10">
        {/* Read-only Banner for Archived Projects */}
        {isArchived && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-400/10 to-orange-400/10 p-5 flex items-center justify-between backdrop-blur-sm"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/20 text-2xl backdrop-blur-sm">
                🔒
              </div>
              <div>
                <p className="font-bold text-amber-300">This project is archived (read-only)</p>
                <p className="text-sm text-amber-200/80 mt-1">
                  All edit operations are disabled. You can view all data but cannot make changes.
                </p>
              </div>
            </div>
            <button
              onClick={handleUnarchive}
              className="rounded-2xl border border-green-400/30 bg-green-400/10 px-5 py-2.5 text-sm font-bold text-green-300 backdrop-blur-sm transition-all duration-300 hover:bg-green-400/20 hover:scale-105"
            >
              ↺ Unarchive
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-dark via-brand-dark to-brand-surface p-8 shadow-2xl shadow-black/40"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 via-transparent to-brand-secondary/5"></div>
          <div className="relative">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-accent/20 to-brand-secondary/20 text-xl backdrop-blur-sm">
                    📚
                  </div>
                  <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
                    Project overview
                  </p>
                </div>
                {project && (
                  <Link
                    to={`/teacher/projects/${id}/progress`}
                    className="mb-4 inline-flex items-center gap-2 rounded-2xl border border-brand-secondary/40 bg-brand-secondary/10 px-4 py-2 text-sm font-bold text-brand-secondary backdrop-blur-sm transition-all duration-300 hover:bg-brand-secondary/20 hover:scale-105"
                  >
                    <span>📊</span>
                    <span>View Progress</span>
                  </Link>
                )}
              {editingProject && !isArchived ? (
                <form onSubmit={updateProject} className="mt-4 space-y-4">
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    required
                    className={inputClass}
                    placeholder="Project title"
                  />
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    rows={3}
                    className={`${inputClass} resize-none`}
                    placeholder="Description"
                  />
                  <input
                    type="date"
                    value={projectForm.deadline}
                    onChange={(e) => setProjectForm({ ...projectForm, deadline: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className={inputClass}
                  />
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="rounded-2xl bg-gradient-to-r from-brand-accent to-brand-secondary px-4 py-2 text-sm font-semibold text-brand-dark shadow-glow"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProject(false)}
                      className="rounded-2xl border border-white/15 px-4 py-2 text-sm text-white/70 hover:border-white/40"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h1 className="mt-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-4xl font-bold text-transparent">{project.title}</h1>
                  <p className="mt-3 text-lg text-white/80">{project.description}</p>
                  {project.deadline && (
                    <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur-sm">
                      <span>📅</span>
                      <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                    </span>
                  )}
                </>
              )}
              </div>
              {!editingProject && (
                <div className="flex gap-2 ml-4">
                  {!isArchived && (
                    <button
                      onClick={() => setEditingProject(true)}
                      className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:text-white"
                    >
                      ✏️ Edit
                    </button>
                  )}
                  {isArchived ? (
                    <button
                      onClick={handleUnarchive}
                      className="rounded-2xl border border-green-400/30 bg-green-400/10 px-4 py-2.5 text-sm font-bold text-green-300 backdrop-blur-sm transition-all duration-300 hover:bg-green-400/20 hover:scale-105"
                    >
                      ↺ Unarchive
                    </button>
                  ) : (
                    <button
                      onClick={handleArchive}
                      className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-sm font-bold text-amber-300 backdrop-blur-sm transition-all duration-300 hover:bg-amber-400/20 hover:scale-105"
                    >
                      📦 Archive
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* AI Insights Section - Only for Teachers and Admins */}
        {(user?.role === "TEACHER" || user?.role === "ADMIN") && (
          <ProjectAiInsights projectId={Number(id)} />
        )}

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 shadow-lg shadow-black/30 backdrop-blur-2xl"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="relative">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-xl backdrop-blur-sm">
                  👥
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
                    Cohort
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-white">
                    Assigned students
                  </h2>
                </div>
              </div>

              {project.students.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-center">
                  <div className="text-4xl mb-2">👤</div>
                  <p className="text-white/60">No students assigned yet.</p>
                </div>
              ) : (
                <ul className="mt-6 space-y-3">
                  {project.students.map((ps, index) => (
                    <motion.li
                      key={ps.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:border-brand-secondary/40 hover:bg-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-sm backdrop-blur-sm">
                          👤
                        </div>
                        <div>
                          <span className="block font-semibold text-white">
                            {ps.student.profile?.firstName} {ps.student.profile?.lastName}
                          </span>
                          <span className="text-xs text-white/50">{ps.student.email}</span>
                        </div>
                      </div>
                      {!isArchived && (
                        <button
                          onClick={() => removeStudent(ps.studentId)}
                          className="ml-3 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-1.5 text-xs font-semibold text-red-300 backdrop-blur-sm transition-all duration-300 hover:border-red-400 hover:bg-red-400/20"
                        >
                          🗑️
                        </button>
                      )}
                    </motion.li>
                  ))}
                </ul>
              )}

              {!isArchived && (
                <>
                  <h3 className="mt-8 mb-4 text-lg font-bold text-white">Add student</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {students
                      .filter((s) => !project.students.some((ps) => ps.studentId === s.id))
                      .map((s, index) => (
                        <motion.button
                          key={s.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                          onClick={() => addStudent(s.id)}
                          className="group/student relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-left backdrop-blur-sm transition-all duration-300 hover:border-brand-secondary/40 hover:bg-white/10"
                        >
                          <div className="relative z-10">
                            <div className="mb-1 flex items-center gap-2">
                              <span className="text-sm">👤</span>
                              <span className="block font-bold text-white">
                                {s.profile?.firstName} {s.profile?.lastName}
                              </span>
                            </div>
                            <span className="text-xs text-white/50">{s.email}</span>
                          </div>
                        </motion.button>
                      ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 shadow-lg shadow-black/30 backdrop-blur-2xl">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-xl backdrop-blur-sm">
                    ✅
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
                      Taskboard
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-white">Tasks</h2>
                  </div>
                </div>

                {project.tasks.length === 0 ? (
                  <div className="mt-6 rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-center">
                    <div className="text-4xl mb-2">📝</div>
                    <p className="text-white/60">No tasks yet.</p>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    {project.tasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className="group/task relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-secondary/40 hover:shadow-lg"
                      >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 transition-opacity duration-300 group-hover/task:opacity-100"></div>
                        <div className="relative">
                      {editingTask === task.id ? (
                        <div className="space-y-4">
                          <input
                            type="text"
                            value={taskEditForm.title}
                            onChange={(e) => setTaskEditForm({ ...taskEditForm, title: e.target.value })}
                            required
                            className={inputClass}
                            placeholder="Task title"
                          />
                          <textarea
                            value={taskEditForm.description}
                            onChange={(e) => setTaskEditForm({ ...taskEditForm, description: e.target.value })}
                            rows={3}
                            className={`${inputClass} resize-none`}
                            placeholder="Description"
                          />
                          <input
                            type="date"
                            value={taskEditForm.deadline}
                            onChange={(e) => setTaskEditForm({ ...taskEditForm, deadline: e.target.value })}
                            min={new Date().toISOString().split('T')[0]}
                            max={project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : undefined}
                            className={inputClass}
                          />
                          <div>
                            <label className="text-sm text-white/60 mb-2 block">Assign to Student</label>
                            <select
                              value={taskEditForm.assignedTo}
                              onChange={(e) =>
                                setTaskEditForm({
                                  ...taskEditForm,
                                  assignedTo: e.target.value,
                                })
                              }
                              className={`${inputClass} bg-brand-dark text-white`}
                              style={{
                                backgroundColor: '#050714',
                                color: 'white'
                              }}
                            >
                              <option value="" style={{ backgroundColor: '#050714', color: 'white' }}>Unassigned</option>
                              {project.students.map((ps) => (
                                <option 
                                  key={ps.id} 
                                  value={ps.studentId}
                                  style={{ backgroundColor: '#050714', color: 'white' }}
                                >
                                  {ps.student.profile?.firstName} {ps.student.profile?.lastName}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => updateTask(task.id)}
                              className="rounded-2xl bg-gradient-to-r from-brand-accent to-brand-secondary px-4 py-2 text-sm font-semibold text-brand-dark shadow-glow"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditTask}
                              className="rounded-2xl border border-white/15 px-4 py-2 text-sm text-white/70 hover:border-white/40"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex-1">
                              <div className="mb-2 flex items-center gap-2">
                                <span className="text-lg">📋</span>
                                <h3 className="text-lg font-bold text-white">
                                  {task.title}
                                </h3>
                              </div>
                              <p className="text-sm leading-relaxed text-white/70">
                                {task.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {task.deadline && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur-sm">
                                  <span>📅</span>
                                  <span>{new Date(task.deadline).toLocaleDateString()}</span>
                                </span>
                              )}
                              <Link
                                to={`/teacher/tasks/${task.id}/submissions`}
                                className="rounded-lg border border-brand-secondary/40 bg-brand-secondary/10 px-3 py-1.5 text-xs font-bold text-brand-secondary backdrop-blur-sm transition-all duration-300 hover:bg-brand-secondary/20 hover:scale-105"
                              >
                                📝 Review
                              </Link>
                              {!isArchived && (
                                <>
                                  <button
                                    onClick={() => startEditTask(task)}
                                    className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:text-white"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    onClick={() => deleteTask(task.id)}
                                    className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-1.5 text-xs font-semibold text-red-300 backdrop-blur-sm transition-all duration-300 hover:border-red-400 hover:bg-red-400/20"
                                  >
                                    🗑️
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                            <p className="text-white/70">
                              Assigned to:{" "}
                              <span className="text-brand-secondary">
                                {task.student
                                  ? `${task.student.profile?.firstName} ${task.student.profile?.lastName}`
                                  : "Unassigned"}
                              </span>
                              {task.student && !isArchived && (
                                <button
                                  onClick={() => removeStudentFromTask(task.id)}
                                  className="ml-2 rounded-lg border border-red-400/30 px-2 py-1 text-xs text-red-300 hover:border-red-400 hover:text-red-200"
                                >
                                  Unassign
                                </button>
                              )}
                            </p>
                            <p className="text-white/70">
                              Workflow:{" "}
                              <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-secondary">
                                {task.status?.replace("_", " ") || "TODO"}
                              </span>
                              {task.reviewStatus && (
                                <>
                                  {" "}| Review:{" "}
                                  <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-400">
                                    {task.reviewStatus.replace("_", " ")}
                                  </span>
                                </>
                              )}
                            </p>
                          </div>
                        </>
                      )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {!isArchived && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-brand-dark/70 to-brand-dark/50 p-6 shadow-inner shadow-black/50 backdrop-blur-2xl"
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="relative">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-xl backdrop-blur-sm">
                      ➕
                    </div>
                    <h3 className="text-xl font-bold text-white">Add task</h3>
                  </div>
                  <form onSubmit={addTask} className="mt-4 space-y-4">
                <input
                  type="text"
                  placeholder="Task title"
                  value={taskForm.title}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, title: e.target.value })
                  }
                  required
                  className={inputClass}
                />
                <textarea
                  placeholder="Task description"
                  rows={3}
                  value={taskForm.description}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, description: e.target.value })
                  }
                  className={`${inputClass} resize-none`}
                />
                <input
                  type="date"
                  value={taskForm.deadline}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, deadline: e.target.value })
                  }
                  min={new Date().toISOString().split('T')[0]}
                  max={project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : undefined}
                  className={inputClass}
                />
                <div>
                  <label className="text-sm text-white/60 mb-2 block">Assign to Student</label>
                  <select
                    value={taskForm.assignedTo}
                    onChange={(e) =>
                      setTaskForm({
                        ...taskForm,
                        assignedTo: e.target.value ? Number(e.target.value) : "",
                      })
                    }
                    className={`${inputClass} bg-brand-dark text-white`}
                    style={{
                      backgroundColor: '#050714',
                      color: 'white'
                    }}
                  >
                    <option value="" style={{ backgroundColor: '#050714', color: 'white' }}>Unassigned</option>
                    {project.students.map((ps) => (
                      <option 
                        key={ps.id} 
                        value={ps.studentId}
                        style={{ backgroundColor: '#050714', color: 'white' }}
                      >
                        {ps.student.profile?.firstName} {ps.student.profile?.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                    <button
                      type="submit"
                      className="group/btn relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-brand-accent to-brand-secondary px-4 py-3 font-bold text-brand-dark shadow-lg shadow-brand-accent/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-brand-accent/40"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <span>✨</span>
                        <span>Add task</span>
                      </span>
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </PageContainer>
  );
}
