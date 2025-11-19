import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function StudentProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get("/api/student/projects");
      setProjects(data);
    } catch (err) {
      console.error("Error loading student projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-[#0b1020] text-white p-10">
        Loading your projects...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1020] via-[#101830] to-[#141c40] text-white">
      <Navbar />

      <div className="pt-28 px-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Projects</h1>

        {projects.length === 0 ? (
          <p className="text-gray-400">
            You are not assigned to any projects yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <Link key={p.id} to={`/student/projects/${p.id}`}>
                <div className="bg-white/10 p-6 rounded-2xl backdrop-blur border border-white/10 hover:bg-white/20 transition cursor-pointer">
                  <h2 className="text-xl font-semibold mb-2">{p.title}</h2>
                  <p className="text-sm text-gray-400 mb-3">
                    {p.description?.slice(0, 80)}...
                  </p>

                  <p className="text-gray-300 text-sm">
                    Tasks: <span className="text-blue-400">{p.tasksCount}</span>
                  </p>

                  <p className="text-gray-300 text-sm">
                    Deadline:{" "}
                    <span className="text-red-400">
                      {p.deadline
                        ? new Date(p.deadline).toLocaleDateString()
                        : "None"}
                    </span>
                  </p>

                  <p className="text-gray-300 text-sm mt-2">
                    Teacher:{" "}
                    <span className="text-green-400">{p.teacher || "N/A"}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
