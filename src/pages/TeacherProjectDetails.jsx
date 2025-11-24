import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import api from "../api/axios";

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/40 outline-none";

const statusButtons = ["TODO", "IN_PROGRESS", "DONE"];

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

  const addTask = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/tasks", {
        projectId: Number(id),
        title: taskForm.title,
        description: taskForm.description,
        deadline: taskForm.deadline,
        assignedTo:
          taskForm.assignedTo !== "" ? Number(taskForm.assignedTo) : null,
      });

      setTaskForm({ title: "", description: "", deadline: "", assignedTo: "" });
      loadProject();
    } catch (err) {
      console.error(err);
      alert("Error creating task");
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await api.patch(`/api/tasks/${taskId}/status`, { status });
      loadProject();
    } catch (err) {
      alert("Error updating task");
    }
  };

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

  if (loading || !project) {
    return (
      <PageContainer>
        <p className="text-white/70">Loading project...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-10">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-brand-dark to-brand-surface p-8 shadow-2xl shadow-black/40">
          <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
            Project overview
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-white">{project.title}</h1>
          <p className="mt-3 text-white/70">{project.description}</p>
          {project.deadline && (
            <span className="mt-5 inline-flex rounded-full border border-white/10 px-4 py-2 text-xs text-white/60">
              Deadline: {new Date(project.deadline).toLocaleDateString()}
            </span>
          )}
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
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80"
                  >
                    {ps.student.profile?.firstName} {ps.student.profile?.lastName}
                    <span className="text-white/50"> · {ps.student.email}</span>
                  </li>
                ))}
              </ul>
            )}

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
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {task.title}
                          </h3>
                          <p className="text-sm text-white/60">
                            {task.description}
                          </p>
                        </div>
                        {task.deadline && (
                          <span className="text-xs uppercase tracking-wide text-white/60">
                            {new Date(task.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <p className="mt-3 text-sm text-white/70">
                        Assigned to:{" "}
                        <span className="text-brand-secondary">
                          {task.student
                            ? `${task.student.profile?.firstName} ${task.student.profile?.lastName}`
                            : "Unassigned"}
                        </span>
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3">
                        {statusButtons.map((status) => (
                          <button
                            key={status}
                            onClick={() => updateTaskStatus(task.id, status)}
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
                    </div>
                  ))}
                </div>
              )}
            </div>

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
                  className={inputClass}
                />
                <select
                  value={taskForm.assignedTo}
                  onChange={(e) =>
                    setTaskForm({
                      ...taskForm,
                      assignedTo: e.target.value ? Number(e.target.value) : "",
                    })
                  }
                  className={inputClass}
                >
                  <option value="">Unassigned</option>
                  {project.students.map((ps) => (
                    <option key={ps.id} value={ps.studentId}>
                      {ps.student.profile?.firstName} {ps.student.profile?.lastName}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-brand-accent to-brand-secondary px-4 py-3 font-semibold text-brand-dark shadow-glow transition hover:translate-y-0.5"
                >
                  Add task
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
