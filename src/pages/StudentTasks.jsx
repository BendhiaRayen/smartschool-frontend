import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function StudentTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get("/api/student/tasks");
      setTasks(data);
    } catch (err) {
      console.error("Error loading student tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await api.patch(`/api/student/tasks/${taskId}/status`, { status });
      load();
    } catch (err) {
      alert("Error updating task status");
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-[#0b1020] text-white p-10">
        Loading tasks...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1020] via-[#101830] to-[#141c40] text-white">
      <Navbar />

      <div className="pt-28 px-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Tasks</h1>

        {tasks.length === 0 ? (
          <p className="text-gray-400">You have no assigned tasks yet.</p>
        ) : (
          <div className="space-y-6">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white/10 p-5 rounded-2xl border border-white/10"
              >
                <h2 className="text-xl font-semibold">{task.title}</h2>

                <p className="text-gray-300 mt-1">{task.description}</p>

                <p className="mt-2 text-sm text-blue-300">
                  Project: {task.project?.title}
                </p>

                {task.deadline && (
                  <p className="text-sm text-red-400">
                    Deadline: {new Date(task.deadline).toLocaleDateString()}
                  </p>
                )}

                <p className="text-sm mt-2">
                  Status:{" "}
                  <span className="text-blue-400 font-bold">{task.status}</span>
                </p>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => updateStatus(task.id, "TODO")}
                    className={`px-3 py-1 text-sm rounded-lg ${
                      task.status === "TODO"
                        ? "bg-blue-600"
                        : "bg-white/20 hover:bg-white/30"
                    }`}
                  >
                    TODO
                  </button>

                  <button
                    onClick={() => updateStatus(task.id, "IN_PROGRESS")}
                    className={`px-3 py-1 text-sm rounded-lg ${
                      task.status === "IN_PROGRESS"
                        ? "bg-yellow-500"
                        : "bg-white/20 hover:bg-white/30"
                    }`}
                  >
                    IN PROGRESS
                  </button>

                  <button
                    onClick={() => updateStatus(task.id, "DONE")}
                    className={`px-3 py-1 text-sm rounded-lg ${
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
      </div>
    </div>
  );
}
