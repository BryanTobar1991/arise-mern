// frontend/src/components/layout/Sidebar.jsx

import { NavLink } from "react-router-dom"; // << IMPORTANTE: Para navegación SPA
import { FaTachometerAlt, FaDumbbell, FaAppleAlt, FaBell, FaUser, FaTrophy } from 'react-icons/fa'; // Iconos

// Definimos la estructura de los enlaces
const navItems = [
  { name: "Dashboard", to: "/dashboard", icon: FaTachometerAlt },
  { name: "Entrenamientos", to: "/dashboard/workouts", icon: FaDumbbell },
  { name: "Nutrición", to: "/dashboard/nutrition", icon: FaAppleAlt },
  { name: "Recordatorios", to: "/dashboard/reminders", icon: FaBell },
  { name: "Perfil", to: "/dashboard/profile", icon: FaUser },
  // >> NUEVO ENLACE DE GAMIFICACIÓN <<
  { name: "Logros", to: "/dashboard/achievements", icon: FaTrophy },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-slate-900 border-r border-slate-800 p-6 flex flex-col gap-6">
      <div className="text-slate-400 uppercase text-xs tracking-widest">
        Menú
      </div>

      <nav className="flex flex-col gap-3">
        {/* Usamos map para renderizar los enlaces */}
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            // 'end' es crucial para el Dashboard: solo se activa si la ruta es EXACTAMENTE /dashboard
            end={item.to === "/dashboard"}

            // Aplicamos estilos basados en si el enlace está activo o no
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg transition font-medium text-sm 
                    ${isActive
                ? "bg-rose-600 text-white shadow-md"
                : "text-slate-300 hover:bg-slate-800 hover:text-rose-400"
              }`
            }
          >
            {/* Ícono dinámico */}
            <item.icon className="w-5 h-5" />

            {/* Nombre del enlace */}
            {item.name}
          </NavLink>
        ))}
      </nav> </aside>);
}