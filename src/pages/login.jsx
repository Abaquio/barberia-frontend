// frontend/src/pages/login.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoginForm from "@/components/login";
import { setAuthToken } from "@/lib/useAuth";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const from = state?.from?.pathname || "/admin";

  async function handleLogin({ email, username, password }) {
    const payloadEmail = (email ?? username ?? "").trim().toLowerCase();
    const payloadPwd = (password ?? "").trim();

    if (!payloadEmail || !payloadPwd) {
      alert("Ingresa email y contraseña");
      return;
    }

    try {
      setLoading(true);
      const url = `${import.meta.env.VITE_API_URL}/auth/login`;
      const body = { email: payloadEmail, password: payloadPwd };
      console.log("→ POST", url, body); // DEBUG

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) {
        console.error("Login fail", { status: res.status, json });
        throw new Error(json?.error || `HTTP ${res.status}`);
      }

      setAuthToken(json.token, json.user?.roles || []);
      navigate(from, { replace: true });
    } catch (e) {
      alert(`Error de autenticación: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-black/70 p-4">
      <LoginForm onSubmit={handleLogin} loading={loading} />
    </div>
  );
}
