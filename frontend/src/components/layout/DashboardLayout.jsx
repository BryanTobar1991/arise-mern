import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  FiLogOut,
  FiHome,
  FiActivity,
  FiCoffee,
  FiBell,
  FiUser,
  FiStar,
} from "react-icons/fi";

export default function DashboardLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 p-6 flex flex-col">
        <h1 className="text-2xl font-extrabold mb-8 text-cyan-400 tracking-tight">
          ARISE Dashboard
        </h1>

        <nav className="flex flex-col space-y-3 text-slate-300">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition 
              ${isActive ? "bg-cyan-500/20 text-cyan-400" : "hover:bg-slate-800"}`
            }
          >
            <FiHome /> Inicio
          </NavLink>

          <NavLink
            to="/dashboard/workouts"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition 
              ${isActive ? "bg-cyan-500/20 text-cyan-400" : "hover:bg-slate-800"}`
            }
          >
            <FiActivity /> Entrenamientos
          </NavLink>

          <NavLink
            to="/dashboard/nutrition"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition 
              ${isActive ? "bg-cyan-500/20 text-cyan-400" : "hover:bg-slate-800"}`
            }
          >
            <FiCoffee /> Nutrición
          </NavLink>

          <NavLink
            to="/dashboard/reminders"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition 
              ${isActive ? "bg-cyan-500/20 text-cyan-400" : "hover:bg-slate-800"}`
            }
          >
            <FiBell /> Recordatorios
          </NavLink>

          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition 
              ${isActive ? "bg-cyan-500/20 text-cyan-400" : "hover:bg-slate-800"}`
            }
          >
            <FiUser /> Perfil
          </NavLink>
          <NavLink
            to="/dashboard/achievements"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition 
              ${isActive ? "bg-cyan-500/20 text-cyan-400" : "hover:bg-slate-800"}`
            }
          >
            <FiStar /> Logros
          </NavLink>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 p-3 rounded-lg bg-rose-600 hover:bg-rose-700 transition"
        >
          <FiLogOut /> Cerrar sesión
        </button>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-10 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Hola, {user?.name || "Usuario"} 👋</h2>
        </div>

        {/* Aquí se renderiza cada página */}
        <Outlet />
      </main>
    </div>
  );
}
