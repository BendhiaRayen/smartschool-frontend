import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

export default function TeacherProjectDetails() {
  const { id } = useParams(); // project ID

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    deadline: "",
    assignedTo: "",
  });

  const [students, setStudents] = useState([]);

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
    const { data } = await api.get("/api/users/students");
    setStudents(data);
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

  if (loading || !project)
    return (
      <div className="min-h-screen bg-[#0b1020] text-white p-10">
        Loading project...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1020] via-[#101830] to-[#141c40] text-white">
      <Navbar />

      <div className="pt-28 px-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
        <p className="text-gray-300 mb-4">{project.description}</p>

        {project.deadline && (
          <p className="text-red-400 mb-8">
            Deadline: {new Date(project.deadline).toLocaleDateString()}
          </p>
        )}

        {/* Students Section */}
        <div className="bg-white/10 p-6 rounded-2xl mb-10 border border-white/10">
          <h2 className="text-2xl font-semibold mb-4">Assigned Students</h2>

          {project.students.length === 0 ? (
            <p className="text-gray-400">No students assigned yet.</p>
          ) : (
            <ul className="space-y-3">
              {project.students.map((ps) => (
                <li
                  key={ps.id}
                  className="bg-white/10 p-3 rounded-xl border border-white/10"
                >
                  {ps.student.profile?.firstName} {ps.student.profile?.lastName}
                  <span className="text-gray-300 text-sm">
                    {" "}
                    - {ps.student.email}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <h3 className="text-xl mt-8 mb-2 font-semibold">Add Student</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {students.map((s) => (
              <button
                key={s.id}
                onClick={() => addStudent(s.id)}
                className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg"
              >
                {s.profile?.firstName} {s.profile?.lastName}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-semibold mb-4">Tasks</h2>

          {project.tasks.length === 0 ? (
            <p className="text-gray-400">No tasks yet.</p>
          ) : (
            <div className="space-y-4">
              {project.tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white/10 p-4 rounded-xl border border-white/10"
                >
                  <h3 className="text-lg font-semibold">{task.title}</h3>

                  <p className="text-gray-400 mb-2">{task.description}</p>

                  {task.deadline && (
                    <p className="text-sm text-red-400">
                      Deadline: {new Date(task.deadline).toLocaleDateString()}
                    </p>
                  )}

                  <p className="text-sm text-gray-300 mt-1">
                    Assigned to:{" "}
                    <span className="text-blue-400">
                      {task.student
                        ? `${task.student.profile?.firstName} ${task.student.profile?.lastName}`
                        : "None"}
                    </span>
                  </p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => updateTaskStatus(task.id, "TODO")}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        task.status === "TODO"
                          ? "bg-blue-600"
                          : "bg-white/20 hover:bg-white/30"
                      }`}
                    >
                      TODO
                    </button>
                    <button
                      onClick={() => updateTaskStatus(task.id, "IN_PROGRESS")}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        task.status === "IN_PROGRESS"
                          ? "bg-yellow-500"
                          : "bg-white/20 hover:bg-white/30"
                      }`}
                    >
                      IN PROGRESS
                    </button>
                    <button
                      onClick={() => updateTaskStatus(task.id, "DONE")}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        task.status === "DONE"
                          ? "bg-green-600"
                          : "bg-white/20 hover:bg-white/30"
                      }`}
                    >
                      DONE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Task Form */}
          <h3 className="text-xl font-semibold mt-8 mb-3">Add Task</h3>

          <form onSubmit={addTask} className="space-y-4">
            <input
              type="text"
              placeholder="Task title"
              value={taskForm.title}
              onChange={(e) =>
                setTaskForm({ ...taskForm, title: e.target.value })
              }
              required
              className="w-full px-4 py-2 rounded-xl bg-black/30 border border-white/10"
            />

            <textarea
              placeholder="Task description"
              rows={2}
              value={taskForm.description}
              onChange={(e) =>
                setTaskForm({ ...taskForm, description: e.target.value })
              }
              className="w-full px-4 py-2 rounded-xl bg-black/30 border border-white/10"
            />

            <input
              type="date"
              value={taskForm.deadline}
              onChange={(e) =>
                setTaskForm({ ...taskForm, deadline: e.target.value })
              }
              className="w-full px-4 py-2 rounded-xl bg-black/30 border border-white/10"
            />

            {/* FIXED: Convert assignedTo to number */}
            <select
              value={taskForm.assignedTo}
              onChange={(e) =>
                setTaskForm({
                  ...taskForm,
                  assignedTo: Number(e.target.value),
                })
              }
              className="w-full px-4 py-2 rounded-xl bg-black/30 border border-white/10"
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
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl"
            >
              Add Task
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
