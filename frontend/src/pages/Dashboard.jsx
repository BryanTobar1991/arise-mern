import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900/70 backdrop-blur-xl border-r border-slate-800 p-6 hidden md:flex flex-col">
        <h2 className="text-2xl font-bold mb-10">
          ARISE<span className="text-cyan-400">•</span>
        </h2>

        <nav className="space-y-4">
          <button className="w-full text-left text-slate-300 hover:text-white transition">🏠 Dashboard</button>
          <button className="w-full text-left text-slate-300 hover:text-white transition">💪 Entrenamientos</button>
          <button className="w-full text-left text-slate-300 hover:text-white transition">🍎 Nutrición</button>
          <button className="w-full text-left text-slate-300 hover:text-white transition">📈 Progreso</button>
          <button className="w-full text-left text-slate-300 hover:text-white transition">👥 Comunidad</button>
          <button className="w-full text-left text-slate-500 hover:text-rose-400 transition mt-4">🔓 Cerrar sesión</button>
        </nav>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-8">

        {/* BIENVENIDA */}
        <h1 className="text-3xl font-bold mb-6">
          Bienvenido, <span className="text-cyan-400">{user.name}</span> 👋
        </h1>

        {/* CARDS PRINCIPALES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 shadow-lg backdrop-blur-xl">
            <h3 className="text-xl font-semibold">Entrenamiento de hoy</h3>
            <p className="text-slate-400 mt-2">Aún no registrado</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 shadow-lg backdrop-blur-xl">
            <h3 className="text-xl font-semibold">Calorías de hoy</h3>
            <p className="text-slate-400 mt-2">Añade tu nutrición diaria</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 shadow-lg backdrop-blur-xl">
            <h3 className="text-xl font-semibold">Progreso semanal</h3>
            <p className="text-slate-400 mt-2">Gráficas próximamente</p>
          </div>

        </div>

      </main>
    </div>
  );
}
