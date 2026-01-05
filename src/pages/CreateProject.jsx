import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import api from "../api/axios";

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/40 outline-none";

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
    
    // Validate deadline is not in the past
    if (form.deadline) {
      const deadlineDate = new Date(form.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate < today) {
        alert("Deadline cannot be in the past");
        return;
      }
    }
    
    try {
      await api.post("/api/projects", form);
      navigate("/teacher/projects");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating project");
    }
  };

  return (
    <PageContainer>
      <div className="space-y-10">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-brand-dark to-brand-surface p-8 shadow-2xl shadow-black/40">
          <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
            New initiative
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-white">
            Create a project
          </h1>
          <p className="mt-3 text-white/70">
            Define your brief, add a deadline, and select the students who will
            participate. Everyone receives updates instantly.
          </p>
        </div>

        <form
          onSubmit={createProject}
          className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg shadow-black/30 space-y-6"
        >
          <div>
            <label className="text-sm text-white/60">Project title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm text-white/60">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className="text-sm text-white/60">Deadline</label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm text-white/60">Assign students</label>
            {loading ? (
              <p className="mt-3 text-white/70">Loading students...</p>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {students.map((s) => {
                  const selected = form.studentIds.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleStudent(s.id)}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        selected
                          ? "border-brand-secondary/60 bg-brand-secondary/20 text-white"
                          : "border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      <span className="block font-semibold">
                        {s.profile?.firstName} {s.profile?.lastName}
                      </span>
                      <span className="text-xs text-white/60">{s.email}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-brand-accent to-brand-secondary px-4 py-3 font-semibold text-brand-dark shadow-glow transition hover:translate-y-0.5"
          >
            Create project
          </button>
        </form>
      </div>
    </PageContainer>
  );
}
