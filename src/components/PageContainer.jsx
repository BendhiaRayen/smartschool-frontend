import Navbar from "./Navbar";

export default function PageContainer({
  children,
  showNavbar = true,
  maxWidth = "max-w-6xl",
  paddingClass = "px-6 pt-32 pb-20",
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-dark text-white">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-brand-secondary/20 blur-[140px]" />
        <div className="absolute right-0 top-10 h-[28rem] w-[28rem] rounded-full bg-brand-accent/20 blur-[140px]" />
        <div className="absolute inset-0 bg-hero-grid bg-[length:160px_160px]" />
      </div>

      {showNavbar && <Navbar />}

      <main
        className={`relative w-full ${
          maxWidth ? `${maxWidth} mx-auto` : ""
        } ${paddingClass}`}
      >
        {children}
      </main>
    </div>
  );
}





