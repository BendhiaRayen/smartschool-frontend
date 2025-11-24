import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const stats = [
  { label: "Schools automated", value: "120+" },
  { label: "Tasks tracked weekly", value: "45K" },
  { label: "Time saved / day", value: "3.5h" },
];

const featureHighlights = [
  {
    badge: "Automation",
    title: "Workflow orchestration",
    description:
      "Trigger smart reminders, attendance nudges, and grading workflows without adding load to educators.",
  },
  {
    badge: "Data layer",
    title: "Unified profile graph",
    description:
      "Students, teachers, projects, and guardians stay in sync thanks to one real-time knowledge graph.",
  },
  {
    badge: "Insights",
    title: "Predictive dashboards",
    description:
      "Surface heatmaps, risk alerts, and progress deltas so leadership can act before deadlines slip.",
  },
];

const personas = [
  {
    title: "Teachers",
    points: ["Design project briefs", "Track submissions", "Coach with AI insights"],
  },
  {
    title: "Students",
    points: ["See priorities instantly", "Collaborate with peers", "Showcase outcomes"],
  },
  {
    title: "Admins",
    points: ["Approve new cohorts", "Audit compliance", "Broadcast updates"],
  },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-dark text-white">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -left-16 top-10 h-80 w-80 rounded-full bg-brand-secondary/20 blur-[110px]" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-brand-accent/20 blur-3xl" />
        <div className="absolute inset-0 bg-hero-grid bg-[length:140px_140px]" />
      </div>

      <Navbar />

      <main className="relative mx-auto flex max-w-6xl flex-col gap-20 px-6 pt-32 pb-24">
        <section className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-10">
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.4em] text-brand-secondary"
            >
              Elevate learning ops
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl"
            >
              A modern control center for{" "}
              <span className="bg-gradient-to-r from-white via-brand-secondary to-brand-accent bg-clip-text text-transparent">
                ambitious schools
              </span>
              .
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base text-white/70 sm:text-lg"
            >
              SmartSchool connects academic planning, project delivery, and student
              progress into one intuitive workspace so every stakeholder can move
              with confidence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/register"
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-accent to-brand-secondary px-6 py-3 text-base font-semibold text-brand-dark shadow-glow transition hover:translate-y-0.5"
              >
                Launch my workspace
              </Link>
              <Link
                to="/login"
                className="rounded-2xl border border-white/20 px-6 py-3 text-base font-medium text-white/80 transition hover:border-white/40 hover:text-white"
              >
                I already have access
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid w-full gap-5 sm:grid-cols-3"
            >
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/5 bg-white/5 p-4"
                >
                  <p className="text-2xl font-semibold text-white">{item.value}</p>
                  <p className="text-xs uppercase tracking-wide text-white/60">
                    {item.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-3xl bg-brand-accent/20 blur-3xl" />
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-brand-dark to-brand-surface p-6 shadow-2xl shadow-brand-dark/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Live Snapshot</p>
                  <p className="text-2xl font-semibold">Innovation Projects</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-brand-secondary">
                  synced • 2m ago
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {["Design Sprint", "Robotics Lab", "Sustainability Report"].map(
                  (project, idx) => (
                    <div
                      key={project}
                      className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{project}</p>
                        <p className="text-xs text-white/60">Due in {3 - idx} week(s)</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-brand-secondary">
                          {72 + idx * 8}%
                        </p>
                        <p className="text-[11px] uppercase tracking-wider text-white/50">
                          completion
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="mt-8 rounded-2xl border border-brand-secondary/40 bg-brand-secondary/10 p-5">
                <p className="text-xs uppercase tracking-[0.5em] text-brand-secondary">
                  signal
                </p>
                <p className="mt-2 text-lg font-medium text-white">
                  AI noticed engagement dipping in Year 3 robotics. Suggest nudging
                  guardians and refreshing the sprint brief.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="features" className="space-y-8">
          <div className="flex flex-col gap-3 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
              Operating system
            </p>
            <h2 className="text-3xl font-semibold text-white">
              Everything your learning community needs in one flow.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featureHighlights.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 transition hover:-translate-y-1 hover:border-brand-secondary/50"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-secondary">
                  {feature.badge}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="insights"
          className="grid gap-6 rounded-3xl border border-white/10 bg-gradient-to-r from-white/5 to-white/10 p-8 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
              Momentum tracker
            </p>
            <h3 className="text-2xl font-semibold text-white">
              Insight loops that keep projects ahead of schedule.
            </h3>
            <div className="space-y-4">
              {[
                "Smart alerts for attendance drops and overdue submissions.",
                "Automated check-ins surface blockers before they spread.",
                "Shareable reports keep families, teachers, and admin aligned.",
              ].map((item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-white/70"
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-secondary" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-brand-secondary/30 bg-brand-dark/60 p-6 shadow-inner shadow-black/40">
            <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
              Weekly pulse
            </p>
            <div className="mt-5 space-y-5">
              {["Engagement", "Submission rate", "Guardian response"].map(
                (item, idx) => (
                  <div key={item}>
                    <div className="mb-2 flex items-center justify-between text-sm text-white/70">
                      <span>{item}</span>
                      <span className="font-semibold text-white">
                        {idx === 0 ? "92%" : idx === 1 ? "87%" : "74%"}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-brand-accent to-brand-secondary"
                        style={{ width: idx === 0 ? "92%" : idx === 1 ? "87%" : "74%" }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
              AI nudges: “Invite Year 4 parents to showcase night; 68% confirmed.”{" "}
              <span className="text-brand-secondary">Send now →</span>
            </div>
          </div>
        </section>

        <section id="personas" className="space-y-8">
          <div className="flex flex-col gap-2 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
              Roles in sync
            </p>
            <h2 className="text-3xl font-semibold text-white">
              Designed for every actor in your learning ecosystem.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {personas.map((persona) => (
              <div
                key={persona.title}
                className="rounded-3xl border border-white/10 bg-brand-dark/70 p-6"
              >
                <h3 className="text-xl font-semibold">{persona.title}</h3>
                <ul className="mt-4 space-y-3 text-sm text-white/70">
                  {persona.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-secondary" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section
          id="cta"
          className="rounded-3xl border border-brand-secondary/40 bg-gradient-to-r from-brand-accent/20 via-brand-secondary/10 to-brand-accent/10 p-8 text-center shadow-glow"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
            Ready to activate
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white">
            Build your SmartSchool workspace in minutes.
          </h2>
          <p className="mt-2 text-base text-white/70">
            Onboard staff, import students, and launch your first projects before the
            next bell rings.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="rounded-2xl bg-white px-6 py-3 font-semibold text-brand-dark transition hover:-translate-y-0.5"
            >
              Start for free
            </Link>
            <Link
              to="/login"
              className="rounded-2xl border border-white/30 px-6 py-3 text-white/80 transition hover:border-white/50 hover:text-white"
            >
              View a demo
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
