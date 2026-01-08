import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import { useAuthStore } from "../store/auth";

const baseCard =
  "group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 shadow-lg shadow-black/20 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-2 hover:border-brand-secondary/40 hover:shadow-xl hover:shadow-brand-secondary/10";

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const role = user?.role;
  const firstName = user?.profile?.firstName || user?.firstName || "there";

  useEffect(() => {
    if (role === "ADMIN") navigate("/admin-dashboard");
  }, [role, navigate]);

  const isTeacher = role === "TEACHER";
  const isStudent = role === "STUDENT";

  // Get time-based greeting (professional standard times)
  const getGreeting = () => {
    const hour = new Date().getHours();
    // Morning: 5:00 AM - 11:59 AM
    if (hour >= 5 && hour < 12) return "Good morning";
    // Afternoon: 12:00 PM - 4:59 PM
    if (hour >= 12 && hour < 17) return "Good afternoon";
    // Evening: 5:00 PM - 8:59 PM
    if (hour >= 17 && hour < 21) return "Good evening";
    // Late night/early morning: 9:00 PM - 4:59 AM (use evening as it's more professional)
    return "Good evening";
  };

  // Get role-specific message
  const getRoleMessage = () => {
    if (isTeacher) {
      return "Manage your projects and review student submissions.";
    }
    if (isStudent) {
      return "View your assignments and track your progress.";
    }
    return "Access your projects, tasks, and submissions from the quick actions below.";
  };

  const sharedActions = [
    {
      title: "Profile",
      description: "Update your personal information and settings.",
      to: "/profile",
      icon: "👤",
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
  ];

  const teacherActions = [
    {
      title: "My Projects",
      description: "View and manage all your projects.",
      to: "/teacher/projects",
      icon: "📚",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      title: "Create Project",
      description: "Start a new project and assign tasks.",
      to: "/teacher/projects/create",
      icon: "✨",
      gradient: "from-brand-accent/20 to-brand-secondary/20",
    },
  ];

  const studentActions = [
    {
      title: "My Projects",
      description: "View your assigned projects and progress.",
      to: "/student/projects",
      icon: "📖",
      gradient: "from-emerald-500/20 to-teal-500/20",
    },
    {
      title: "My Tasks",
      description: "View and manage your assigned tasks.",
      to: "/student/tasks",
      icon: "✅",
      gradient: "from-amber-500/20 to-orange-500/20",
    },
  ];

  const activeActions = [
    ...sharedActions,
    ...(isTeacher ? teacherActions : []),
    ...(isStudent ? studentActions : []),
  ];

  return (
    <PageContainer>
      <section>
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-dark via-brand-dark to-brand-surface p-8 shadow-2xl shadow-black/40"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 via-transparent to-brand-secondary/5"></div>
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
                {isTeacher ? "Teacher Dashboard" : isStudent ? "Student Dashboard" : "Dashboard"}
              </p>
              <h1 className="mt-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-4xl font-bold text-transparent">
                {getGreeting()}, {firstName}
              </h1>
              <p className="mt-4 text-lg text-white/80">
                {getRoleMessage()}
              </p>
            </div>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
              <p className="mt-1 text-sm text-white/60">Access your most important features</p>
            </motion.div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Link to={action.to} className={`${baseCard} block`}>
                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${action.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}></div>
                    <div className="relative">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/20">
                          {action.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white">
                            {action.title}
                          </h3>
                        </div>
                      </div>
                      <p className="mb-4 text-sm leading-relaxed text-white/70">
                        {action.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm font-semibold text-brand-secondary transition-transform duration-300 group-hover:translate-x-1">
                        <span>Open</span>
                        <span className="text-lg">→</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
