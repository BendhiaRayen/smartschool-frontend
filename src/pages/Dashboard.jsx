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

  const sharedActions = [
    {
      title: "Profile",
      description: "Tune your identity, contact info, and notifications.",
      to: "/profile",
    },
  ];

  const teacherActions = [
    {
      title: "Projects cockpit",
      description: "Plan milestones, track submissions, and celebrate wins.",
      to: "/teacher/projects",
    },
    {
      title: "Create launchpad",
      description: "Draft new interdisciplinary projects in minutes.",
      to: "/teacher/projects/create",
    },
  ];

  const studentActions = [
    {
      title: "Assigned projects",
      description: "See briefs, expectations, and live teammate progress.",
      to: "/student/projects",
    },
    {
      title: "My taskboard",
      description: "Flip cards from todo to done with one tap.",
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
      <section className="grid gap-10 lg:grid-cols-[1fr_0.6fr]">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/10 bg-gradient-to-br from-brand-dark to-brand-surface p-8 shadow-2xl shadow-black/40"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
              Daily brief
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-white">
              Hey {firstName}, your workspace is{" "}
              <span className="text-brand-secondary">synced</span> and ready.
            </h1>
            <p className="mt-4 text-white/70">
              Jump back into the flow with prioritized shortcuts and live signals
              from your classes. Everything important is summarized below.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Active projects", value: user?.stats?.projects || "6" },
                { label: "Tasks due soon", value: user?.stats?.tasks || "12" },
                { label: "Unread nudges", value: user?.stats?.alerts || "3" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="text-xs uppercase tracking-wide text-white/60">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
              Quick actions
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {activeActions.map((action) => (
                <Link key={action.title} to={action.to} className={baseCard}>
                  <h3 className="text-xl font-semibold text-white">
                    {action.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/70">{action.description}</p>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-brand-secondary">
                    Go now →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-brand-secondary/30 bg-brand-dark/70 p-6 shadow-inner shadow-black/50">
            <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
              Momentum pulse
            </p>
            <div className="mt-6 space-y-4">
              {[
                { label: "Engagement", value: 92 },
                { label: "Submission pace", value: 88 },
                { label: "Guardian replies", value: 74 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-sm text-white/70">
                    <span>{item.label}</span>
                    <span className="font-semibold text-white">{item.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-brand-accent to-brand-secondary"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
              AI tip: Schedule a quick sync with Year 2 advisors—engagement dipped 6%
              after break. Offer a micro-challenge to bring the energy back.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/40">
            <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
              Upcoming checkpoints
            </p>
            <div className="mt-4 space-y-3">
              {[
                { title: "Robotics sprint demo", date: "Tomorrow · 09:30" },
                { title: "Parent pulse report", date: "Thu · 16:00" },
                { title: "Sustainability fair sync", date: "Fri · 11:15" },
              ].map((checkpoint) => (
                <div
                  key={checkpoint.title}
                  className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {checkpoint.title}
                    </p>
                    <p className="text-xs text-white/60">{checkpoint.date}</p>
                  </div>
                  <span className="text-brand-secondary">Details →</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
