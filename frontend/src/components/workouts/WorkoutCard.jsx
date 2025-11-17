import { FiTrash2, FiEdit } from "react-icons/fi";

export default function WorkoutCard({ workout, onDelete }) {
  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-md hover:shadow-cyan-500/20 transition">

      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-white">{workout.title}</h3>

        <button onClick={() => onDelete(workout._id)} className="text-rose-400">
          <FiTrash2 size={20} />
        </button>
      </div>

      <p className="text-slate-400 mt-1">{workout.description}</p>

      <p className="text-xs text-slate-500 mt-3">
        Creado: {new Date(workout.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
