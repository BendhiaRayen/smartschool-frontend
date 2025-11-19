import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function TeacherProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      const { data } = await api.get("/api/projects");
      setProjects(data);
    } catch (err) {
      console.error("Error loading projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await api.delete(`/api/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Error deleting project");
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1020] via-[#101830] to-[#141c40] text-white">
      <Navbar />

      <div className="pt-28 px-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">My Projects</h1>

        <Link to="/teacher/projects/create">
          <button className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl mb-6 font-semibold">
            + Create New Project
          </button>
        </Link>

        {loading ? (
          <p className="text-gray-400">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-gray-400">
            No projects yet. Create your first one!
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white/10 p-6 rounded-2xl backdrop-blur border border-white/10 hover:bg-white/20 transition"
              >
                <h2 className="text-xl font-semibold mb-2">{project.title}</h2>

                <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                  {project.description || "No description"}
                </p>

                {project.deadline && (
                  <p className="text-sm text-gray-300 mb-3">
                    Deadline:{" "}
                    <span className="text-red-400">
                      {new Date(project.deadline).toLocaleDateString()}
                    </span>
                  </p>
                )}

                <p className="text-sm text-gray-300 mb-3">
                  Students:{" "}
                  <span className="text-blue-400">
                    {project.students?.length || 0}
                  </span>
                </p>

                <p className="text-sm text-gray-300 mb-4">
                  Tasks:{" "}
                  <span className="text-yellow-400">
                    {project.tasks?.length || 0}
                  </span>
                </p>

                <div className="flex justify-between items-center">
                  <Link to={`/teacher/projects/${project.id}`}>
                    <button className="bg-green-600 hover:bg-green-700 py-1 px-3 rounded-lg text-sm">
                      Open
                    </button>
                  </Link>

                  <button
                    onClick={() => handleDelete(project.id)}
                    className="bg-red-600 hover:bg-red-700 py-1 px-3 rounded-lg text-sm"
                  >
                    Delete
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
