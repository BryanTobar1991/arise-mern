import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }) {
  return (
    <div className="flex h-screen w-full bg-slate-900 text-white">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
