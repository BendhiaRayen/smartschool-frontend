import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

export default function GoogleSuccessPage() {
  const navigate = useNavigate();
  const { setTokens, fetchUserProfile } = useAuthStore();

  useEffect(() => {
    // Extract tokens from URL
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (accessToken && refreshToken) {
      // Save tokens to store (and optionally to localStorage)
      setTokens({ accessToken, refreshToken });

      // Fetch the user profile and navigate to dashboard
      fetchUserProfile()
        .then(() => navigate("/dashboard"))
        .catch(() => navigate("/login"));
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center text-white">
      <p className="text-lg text-gray-300">Logging you in with Google...</p>
    </div>
  );
}
