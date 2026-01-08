import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageContainer from "../components/PageContainer";
import api from "../api/axios";

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/40 outline-none transition-all duration-300";

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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-dark via-brand-dark to-brand-surface p-8 shadow-2xl shadow-black/40"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 via-transparent to-brand-secondary/5"></div>
          <div className="relative">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-accent/20 to-brand-secondary/20 text-2xl backdrop-blur-sm">
                ✨
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
                  New initiative
                </p>
                <h1 className="mt-1 bg-gradient-to-r from-white to-white/80 bg-clip-text text-4xl font-bold text-transparent">
                  Create a project
                </h1>
              </div>
            </div>
            <p className="mt-3 text-lg text-white/80">
              Define your brief, add a deadline, and select the students who will
              participate. Everyone receives updates instantly.
            </p>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={createProject}
          className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 shadow-lg shadow-black/30 backdrop-blur-2xl space-y-6"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          <div className="relative space-y-6">
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
              <label className="mb-3 block text-sm font-semibold text-white/80">
                Assign students
              </label>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="mb-2 text-2xl animate-pulse">⏳</div>
                    <p className="text-white/70">Loading students...</p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {students.map((s, index) => {
                    const selected = form.studentIds.includes(s.id);
                    return (
                      <motion.button
                        key={s.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        type="button"
                        onClick={() => toggleStudent(s.id)}
                        className={`group/student relative overflow-hidden rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${
                          selected
                            ? "border-brand-secondary/60 bg-gradient-to-br from-brand-secondary/20 to-brand-accent/20 text-white shadow-lg shadow-brand-secondary/20"
                            : "border-white/10 bg-white/5 text-white/70 hover:border-brand-secondary/40 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <div className="relative z-10">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="text-lg">👤</span>
                            <span className="block font-bold">
                              {s.profile?.firstName} {s.profile?.lastName}
                            </span>
                            {selected && (
                              <span className="ml-auto text-brand-secondary">✓</span>
                            )}
                          </div>
                          <span className="text-xs text-white/60">{s.email}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="group/btn relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-brand-accent to-brand-secondary px-4 py-3 font-bold text-brand-dark shadow-lg shadow-brand-accent/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-brand-accent/40"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span>✨</span>
                <span>Create project</span>
              </span>
            </button>
          </div>
        </motion.form>
      </div>
    </PageContainer>
  );
}
