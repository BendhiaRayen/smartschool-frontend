import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import { useAuthStore } from "../store/auth";

export default function GoogleSuccessPage() {
  const navigate = useNavigate();
  const { setTokens, fetchUserProfile } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (accessToken && refreshToken) {
      setTokens({ accessToken, refreshToken });
      fetchUserProfile()
        .then(() => navigate("/dashboard"))
        .catch(() => navigate("/login"));
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <PageContainer
      showNavbar={false}
      maxWidth="max-w-3xl"
      paddingClass="px-6 py-48"
    >
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl shadow-black/40">
        <p className="text-xs uppercase tracking-[0.4em] text-brand-secondary">
          Google SSO
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-white">
          Logging you in securely...
        </h1>
        <p className="mt-3 text-white/70">
          We’re exchanging encrypted tokens with Google and building your
          SmartSchool session. This only takes a few seconds.
        </p>
      </div>
    </PageContainer>
  );
}
