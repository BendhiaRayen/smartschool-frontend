import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import { useAuthStore } from "../store/auth";

const baseCard =
  "rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 backdrop-blur-2xl transition hover:-translate-y-1 hover:border-brand-secondary/40";

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
    },
  ];

  const teacherActions = [
    {
      title: "My Projects",
      description: "View and manage all your projects.",
      to: "/teacher/projects",
    },
    {
      title: "Create Project",
      description: "Start a new project and assign tasks.",
      to: "/teacher/projects/create",
    },
  ];

  const studentActions = [
    {
      title: "My Projects",
      description: "View your assigned projects and progress.",
      to: "/student/projects",
    },
    {
      title: "My Tasks",
      description: "View and manage your assigned tasks.",
      to: "/student/tasks",
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
            className="rounded-3xl border border-white/10 bg-gradient-to-br from-brand-dark to-brand-surface p-8 shadow-2xl shadow-black/40"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
              {isTeacher ? "Teacher Dashboard" : isStudent ? "Student Dashboard" : "Dashboard"}
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-white">
              {getGreeting()}, {firstName}
            </h1>
            <p className="mt-4 text-white/70">
              {getRoleMessage()}
            </p>
          </motion.div>

          <div className="space-y-5">
            <h2 className="text-2xl font-semibold text-white">Quick Actions</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {activeActions.map((action) => (
                <Link key={action.title} to={action.to} className={baseCard}>
                  <h3 className="text-xl font-semibold text-white">
                    {action.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/70">{action.description}</p>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-brand-secondary">
                    Open →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </section>
    </PageContainer>
  );
}
