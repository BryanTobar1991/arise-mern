export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-slate-900 border-r border-slate-800 p-6 flex flex-col gap-6">
      <div className="text-slate-400 uppercase text-xs tracking-widest">
        Menú
      </div>

      <nav className="flex flex-col gap-3">
        <a className="text-slate-200 hover:text-rose-400 transition font-medium">
          Dashboard
        </a>
        <a className="text-slate-200 hover:text-rose-400 transition font-medium">
          Entrenamientos
        </a>
        <a className="text-slate-200 hover:text-rose-400 transition font-medium">
          Nutrición
        </a>
        <a className="text-slate-200 hover:text-rose-400 transition font-medium">
          Recordatorios
        </a>
        <a className="text-slate-200 hover:text-rose-400 transition font-medium">
          Perfil
        </a>
      </nav>
    </aside>
  );
}
