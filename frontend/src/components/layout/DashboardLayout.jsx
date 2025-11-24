import React, { useState } from "react"; // Importar useState
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
  FiMenu, // Icono para abrir el menú (Hamburguesa)
  FiX,
  FiMail,
} from "react-icons/fi";

export default function DashboardLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  // Estado para controlar la visibilidad del menú móvil (Sidebar/Drawer)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(3);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  // Función para cerrar el menú después de hacer clic en un enlace (solo en móvil)
  const closeMenu = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const navItems = [
    { to: "/dashboard", icon: FiHome, label: "Inicio", end: true },
    { to: "/dashboard/workouts", icon: FiActivity, label: "Entrenamientos" },
    { to: "/dashboard/nutrition", icon: FiCoffee, label: "Nutrición" },
    { to: "/dashboard/reminders", icon: FiBell, label: "Recordatorios" },
    { to: "/dashboard/notifications", icon: FiMail, label: "Notificaciones", badge: unreadNotificationsCount },
    { to: "/dashboard/profile", icon: FiUser, label: "Perfil" },
    { to: "/dashboard/achievements", icon: FiStar, label: "Logros" },
  ];

  // Componente Sidebar (para reutilizar en desktop y mobile)
  const Sidebar = () => (
    <aside className="w-72 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 p-6 flex flex-col h-full overflow-y-auto">
      <h1 className="text-2xl font-extrabold mb-8 text-cyan-400 tracking-tight">
        ARISE Dashboard
      </h1>

      <nav className="flex flex-col space-y-3 text-slate-300">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={closeMenu} // Cerrar menú en móvil al navegar
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition 
              ${isActive ? "bg-cyan-500/20 text-cyan-400" : "hover:bg-slate-800"}`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon className="text-xl" /> {item.label}
            </div>

            {item.badge > 0 && (
              <span className="bg-rose-600 text-white text-xs font-bold px-2 py-0.5 rounded-full absolute right-3">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 p-3 rounded-lg bg-rose-600 hover:bg-rose-700 transition"
      >
        <FiLogOut /> Cerrar sesión
      </button>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* 1. SIDEBAR DESKTOP - Siempre visible en pantallas grandes (lg) */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* 2. SIDEBAR MOVIL (DRAWER) - Condicional en pantallas pequeñas */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setIsMenuOpen(false)}>
          {/* Overlay semitransparente que cierra el menú al hacer clic fuera */}
          <div className="absolute inset-0 bg-slate-950 opacity-80"></div>
          {/* Contenedor del Sidebar móvil */}
          <div className="absolute left-0 top-0 h-full w-72 z-50">
            <Sidebar />
          </div>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto">
        {/* HEADER (VISIBLE EN TODAS LAS PANTALLAS) */}
        <header className="p-4 sm:p-6 lg:p-10 border-b lg:border-none border-slate-800 flex justify-between items-center sticky top-0 bg-slate-950/90 backdrop-blur-sm z-30">

          {/* Botón de Menú (Solo en móvil) */}
          <button
            className="lg:hidden p-2 text-cyan-400 hover:text-cyan-300"
            onClick={() => setIsMenuOpen(true)}
          >
            <FiMenu className="text-2xl" />
          </button>

          <h2 className="text-xl sm:text-2xl font-bold">
            Hola, {user?.name || "Usuario"} 👋
          </h2>

          {/* Placeholder para Notificaciones o Perfil Rápido en la derecha */}
          <div className="p-2 text-sm text-slate-400 hidden sm:block">
            {/* Aquí podríamos poner un icono de Notificaciones (FiBell) */}
          </div>
        </header>


        {/* Área de Contenido de Página */}
        <div className="p-4 sm:p-6 lg:p-0 lg:px-10 pb-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}