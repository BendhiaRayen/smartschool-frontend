import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function StudentProjectDetails() {
  const { id } = useParams(); // projectId
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get(`/api/student/projects/${id}`);
      setProject(data);
    } catch (err) {
      console.error("Error loading project:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await api.patch(`/api/student/tasks/${taskId}/status`, { status });
      load();
    } catch (err) {
      alert("Error updating status");
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading || !project)
    return (
      <div className="min-h-screen bg-[#0b1020] text-white p-10">
        Loading project...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1020] via-[#101830] to-[#141c40] text-white">
      <Navbar />

      <div className="pt-28 px-6 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-3">{project.title}</h1>

        <p className="text-gray-300 mb-3">{project.description}</p>

        {project.deadline && (
          <p className="text-red-400 mb-6">
            Deadline: {new Date(project.deadline).toLocaleDateString()}
          </p>
        )}

        <p className="text-gray-300 mb-10 text-sm">
          Teacher:{" "}
          <span className="text-green-400">
            {project.teacher?.profile?.firstName}{" "}
            {project.teacher?.profile?.lastName}
          </span>
        </p>

        {/* Student Tasks */}
        <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-semibold mb-4">My Tasks</h2>

          {project.tasks.length === 0 ? (
            <p className="text-gray-400">No tasks assigned to you yet.</p>
          ) : (
            <div className="space-y-5">
              {project.tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white/10 p-4 rounded-xl border border-white/10"
                >
                  <h3 className="text-xl font-semibold">{task.title}</h3>
                  <p className="text-gray-300 mb-2">{task.description}</p>

                  {task.deadline && (
                    <p className="text-sm text-red-400">
                      Deadline: {new Date(task.deadline).toLocaleDateString()}
                    </p>
                  )}

                  <p className="mt-3 text-sm">
                    Status:{" "}
                    <span className="text-blue-400 font-semibold">
                      {task.status}
                    </span>
                  </p>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => updateStatus(task.id, "TODO")}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        task.status === "TODO"
                          ? "bg-blue-600"
                          : "bg-white/20 hover:bg-white/30"
                      }`}
                    >
                      TODO
                    </button>

                    <button
                      onClick={() => updateStatus(task.id, "IN_PROGRESS")}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        task.status === "IN_PROGRESS"
                          ? "bg-yellow-500"
                          : "bg-white/20 hover:bg-white/30"
                      }`}
                    >
                      IN PROGRESS
                    </button>

                    <button
                      onClick={() => updateStatus(task.id, "DONE")}
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
        </div>
      </div>
    </div>
  );
}
