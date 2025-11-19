import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function CreateProject() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    studentIds: [],
  });

  // Load all students
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const { data } = await api.get("/api/users/students");
        setStudents(data);
      } catch (err) {
        console.error("Error loading students:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  const toggleStudent = (id) => {
    setForm((prev) => ({
      ...prev,
      studentIds: prev.studentIds.includes(id)
        ? prev.studentIds.filter((s) => s !== id)
        : [...prev.studentIds, id],
    }));
  };

  const createProject = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/projects", form);
      navigate("/teacher/projects");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating project");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1020] via-[#101830] to-[#141c40] text-white">
      <Navbar />

      <div className="pt-28 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Create New Project</h1>

        <form
          onSubmit={createProject}
          className="bg-white/10 p-6 rounded-2xl border border-white/10 space-y-6"
        >
          <div>
            <label className="text-sm text-gray-400">Project Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full mt-1 px-4 py-2 rounded-xl bg-black/30 border border-white/10 focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full mt-1 px-4 py-2 rounded-xl bg-black/30 border border-white/10 focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Deadline</label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              required
              className="w-full mt-1 px-4 py-2 rounded-xl bg-black/30 border border-white/10 focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Assign Students</label>

            {loading ? (
              <p className="text-gray-400 mt-2">Loading students...</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 mt-2">
                {students.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => toggleStudent(s.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      form.studentIds.includes(s.id)
                        ? "bg-blue-600 border-blue-400"
                        : "bg-white/10 border-white/10 hover:bg-white/20"
                    }`}
                  >
                    <p className="font-medium">
                      {s.profile?.firstName} {s.profile?.lastName}
                    </p>
                    <p className="text-sm text-gray-300">{s.email}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl font-semibold"
          >
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
}
