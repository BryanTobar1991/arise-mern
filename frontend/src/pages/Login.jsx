import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, user: authUser, error: authError, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const success = await login(email, password);

      if (success) {
        navigate("/dashboard");
      }

    } catch (err) {

      console.error("Error capturado en el componente:", err);
    }

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">

      {/* Fondos futuristas */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 opacity-90" />
      <div className="absolute -top-40 -right-20 w-96 h-96 bg-cyan-400/20 blur-[120px] rounded-full" />
      <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] bg-rose-600/10 blur-[150px] rounded-full" />

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl shadow-[0_0_40px_rgba(15,23,42,0.9)] p-8 md:p-10">

        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Iniciar sesión</h1>
        <p className="text-sm text-slate-400 mb-6">Bienvenido de vuelta a ARISE.</p>

        {authError && (
          <div className="mb-4 rounded-xl border border-rose-500/60 bg-rose-500/10 px-3 py-2 text-sm text-rose-200 animate-fade">
            {authError}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm text-slate-300">Correo electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-slate-900/80 border border-slate-700 px-3 py-2.5 text-sm outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              placeholder="tucorreo@mail.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-slate-300">Contraseña</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-slate-900/80 border border-slate-700 px-3 py-2.5 text-sm outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              placeholder="Tu contraseña"
            />
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full mt-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-400 py-2.5 text-sm font-semibold tracking-wide transition"
          >
            {authLoading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="mt-6 text-xs text-center text-slate-400">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-cyan-400 hover:text-cyan-300 underline">
            Crear cuenta
          </Link>
        </p>

      </div>
    </div>
  );
}
