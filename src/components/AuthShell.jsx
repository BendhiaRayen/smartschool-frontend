import PageContainer from "./PageContainer";

export default function AuthShell({
  eyebrow = "SmartSchool Access",
  title,
  description,
  bullets = [],
  children,
}) {
  return (
    <PageContainer
      showNavbar={false}
      maxWidth="max-w-5xl"
      paddingClass="px-6 py-28"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
            {eyebrow}
          </p>
          <h1 className="text-4xl font-semibold text-white">{title}</h1>
          <p className="text-white/70">{description}</p>
          {bullets.length > 0 && (
            <ul className="space-y-3 text-sm text-white/70">
              {bullets.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-secondary" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur-2xl">
          {children}
        </div>
      </div>
    </PageContainer>
  );
}





