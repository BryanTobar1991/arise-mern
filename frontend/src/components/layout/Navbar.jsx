import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () =>{
    await logout();
    navigate('/login');

  }

  const handleProfileClick = () => {
    navigate('/dashboard/profile');
  }

  return (
    <header className="w-full h-16 bg-slate-800/80 backdrop-blur-md border-b border-slate-700 flex items-center justify-between px-6">
      <h1 className="text-xl font-bold tracking-wide text-slate-100">
        ARISE
      </h1>

      <div className="flex items-center gap-4">
        <button 
          onClick={handleProfileClick}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium">
          Perfil
        </button>

        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded-lg text-sm font-medium">
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
