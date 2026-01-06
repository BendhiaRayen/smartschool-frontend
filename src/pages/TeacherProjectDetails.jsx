import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import api from "../api/axios";

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/40 outline-none";

// Status buttons removed - only students can change task status

export default function TeacherProjectDetails() {
  const { id } = useParams();

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
        <p className="text-white/70">Loading project...</p>
      </PageContainer>
    );
  }

  const isArchived = project.isArchived;

  return (
    <PageContainer>
      <div className="space-y-10">
        {/* Read-only Banner for Archived Projects */}
        {isArchived && (
          <div className="rounded-3xl border border-amber-400/30 bg-amber-400/10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <p className="font-semibold text-amber-300">This project is archived (read-only)</p>
                <p className="text-sm text-amber-200/70 mt-1">
                  All edit operations are disabled. You can view all data but cannot make changes.
                </p>
              </div>
            </div>
            <button
              onClick={handleUnarchive}
              className="rounded-2xl border border-green-400/30 bg-green-400/10 px-4 py-2 text-sm font-semibold text-green-300 transition hover:bg-green-400/20"
            >
              Unarchive Project
            </button>
          </div>
        )}

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-brand-dark to-brand-surface p-8 shadow-2xl shadow-black/40">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
                Project overview
              </p>
              {project && (
                <Link
                  to={`/teacher/projects/${id}/progress`}
                  className="mt-4 inline-block rounded-2xl border border-brand-secondary/40 bg-brand-secondary/10 px-4 py-2 text-sm font-semibold text-brand-secondary transition hover:bg-brand-secondary/20"
                >
                  View Progress
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
                  <h1 className="mt-4 text-4xl font-semibold text-white">{project.title}</h1>
                  <p className="mt-3 text-white/70">{project.description}</p>
                  {project.deadline && (
                    <span className="mt-5 inline-flex rounded-full border border-white/10 px-4 py-2 text-xs text-white/60">
                      Deadline: {new Date(project.deadline).toLocaleDateString()}
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
                    className="rounded-2xl border border-white/15 px-4 py-2 text-sm text-white/70 hover:border-white/40"
                  >
                    Edit
                  </button>
                )}
                {isArchived ? (
                  <button
                    onClick={handleUnarchive}
                    className="rounded-2xl border border-green-400/30 bg-green-400/10 px-4 py-2 text-sm font-semibold text-green-300 transition hover:bg-green-400/20"
                  >
                    Unarchive
                  </button>
                ) : (
                  <button
                    onClick={handleArchive}
                    className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:bg-amber-400/20"
                  >
                    Archive
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
                  Cohort
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Assigned students
                </h2>
              </div>
            </div>

            {project.students.length === 0 ? (
              <p className="mt-6 text-white/60">No students assigned yet.</p>
            ) : (
              <ul className="mt-6 space-y-3">
                {project.students.map((ps) => (
                  <li
                    key={ps.id}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80"
                  >
                    <div>
                      {ps.student.profile?.firstName} {ps.student.profile?.lastName}
                      <span className="text-white/50"> · {ps.student.email}</span>
                    </div>
                    {!isArchived && (
                      <button
                        onClick={() => removeStudent(ps.studentId)}
                        className="ml-3 rounded-lg border border-red-400/30 px-2 py-1 text-xs text-red-300 transition hover:border-red-400 hover:text-red-200"
                      >
                        Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {!isArchived && (
              <>
                <h3 className="mt-8 text-lg font-semibold text-white">Add student</h3>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  {students
                    .filter((s) => !project.students.some((ps) => ps.studentId === s.id))
                    .map((s) => (
                      <button
                        key={s.id}
                        onClick={() => addStudent(s.id)}
                        className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-left text-white/80 transition hover:border-brand-secondary/40 hover:text-white"
                      >
                        <span className="block font-semibold">
                          {s.profile?.firstName} {s.profile?.lastName}
                        </span>
                        <span className="text-xs text-white/50">{s.email}</span>
                      </button>
                    ))}
                </div>
              </>
            )}

          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
                    Taskboard
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Tasks</h2>
                </div>
              </div>

              {project.tasks.length === 0 ? (
                <p className="mt-6 text-white/60">No tasks yet.</p>
              ) : (
                <div className="mt-6 space-y-4">
                  {project.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
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
                              <h3 className="text-lg font-semibold text-white">
                                {task.title}
                              </h3>
                              <p className="text-sm text-white/60">
                                {task.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {task.deadline && (
                                <span className="text-xs uppercase tracking-wide text-white/60">
                                  {new Date(task.deadline).toLocaleDateString()}
                                </span>
                              )}
                              <Link
                                to={`/teacher/tasks/${task.id}/submissions`}
                                className="rounded-lg border border-brand-secondary/40 bg-brand-secondary/10 px-2 py-1 text-xs text-brand-secondary hover:bg-brand-secondary/20"
                              >
                                Review
                              </Link>
                              {!isArchived && (
                                <>
                                  <button
                                    onClick={() => startEditTask(task)}
                                    className="rounded-lg border border-white/15 px-2 py-1 text-xs text-white/70 hover:border-white/40"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deleteTask(task.id)}
                                    className="rounded-lg border border-red-400/30 px-2 py-1 text-xs text-red-300 hover:border-red-400 hover:text-red-200"
                                  >
                                    Delete
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
                  ))}
                </div>
              )}
            </div>

            {!isArchived && (
              <div className="rounded-3xl border border-white/10 bg-brand-dark/70 p-6 shadow-inner shadow-black/50">
                <h3 className="text-xl font-semibold text-white">Add task</h3>
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
                  className="w-full rounded-2xl bg-gradient-to-r from-brand-accent to-brand-secondary px-4 py-3 font-semibold text-brand-dark shadow-glow transition hover:translate-y-0.5"
                >
                  Add task
                </button>
              </form>
            </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
