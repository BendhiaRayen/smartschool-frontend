import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";


const featureHighlights = [
  {
    badge: "Projects",
    title: "Project Management",
    description:
      "Create and manage projects with tasks, deadlines, and student assignments.",
  },
  {
    badge: "Submissions",
    title: "Submission Tracking",
    description:
      "Students submit work, teachers review and provide feedback, with version control.",
  },
  {
    badge: "Progress",
    title: "Progress Monitoring",
    description:
      "Track completion rates and progress across all projects and tasks.",
  },
];

const personas = [
  {
    title: "Teachers",
    points: ["Create and manage projects", "Review submissions", "Grade student work"],
  },
  {
    title: "Students",
    points: ["View assigned tasks", "Submit work", "Track progress"],
  },
  {
    title: "Admins",
    points: ["Manage users", "Monitor system", "Control access"],
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
        <section>
          <div className="space-y-10 max-w-3xl mx-auto">

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl"
            >
              SmartSchool
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base text-white/70 sm:text-lg"
            >
              A modern platform for managing school projects, tracking student progress, and facilitating collaboration between teachers and students.
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
                Get Started
              </Link>
              <Link
                to="/login"
                className="rounded-2xl border border-white/20 px-6 py-3 text-base font-medium text-white/80 transition hover:border-white/40 hover:text-white"
              >
                Sign In
              </Link>
            </motion.div>

          </div>

        </section>

        <section id="features" className="space-y-8">
          <div className="flex flex-col gap-3 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
              Features
            </p>
            <h2 className="text-3xl font-semibold text-white">
              Manage projects and track progress efficiently.
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
          className="rounded-3xl border border-white/10 bg-gradient-to-r from-white/5 to-white/10 p-8"
        >
          <div className="space-y-5 max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
              Features
            </p>
            <h3 className="text-2xl font-semibold text-white">
              Everything you need to manage projects and track progress.
            </h3>
            <div className="space-y-4">
              {[
                "Track project milestones and deadlines.",
                "Manage task assignments and submissions.",
                "Review and grade student work efficiently.",
                "Monitor progress across all projects.",
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
        </section>

        <section id="personas" className="space-y-8">
          <div className="flex flex-col gap-2 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
              For Everyone
            </p>
            <h2 className="text-3xl font-semibold text-white">
              Designed for teachers, students, and administrators.
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
              Get Started
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Start managing your projects today.
            </h2>
            <p className="mt-2 text-base text-white/70">
              Create an account to begin organizing projects, assigning tasks, and tracking student progress.
            </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="rounded-2xl bg-white px-6 py-3 font-semibold text-brand-dark transition hover:-translate-y-0.5"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="rounded-2xl border border-white/30 px-6 py-3 text-white/80 transition hover:border-white/50 hover:text-white"
              >
                Sign In
              </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
