import { useState } from "react";
import api from "../../lib/axios";

export default function CreateWorkoutModal({ open, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/workouts", {
        title,
        description,
        exercises: [],
      });

      onCreated(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al crear entrenamiento");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 p-6 rounded-xl w-full max-w-md">

        <h2 className="text-xl font-bold text-white mb-4">Nuevo Entrenamiento</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Título del entrenamiento"
            className="w-full p-3 bg-slate-800 text-white rounded"
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            className="w-full p-3 bg-slate-800 text-white rounded"
            placeholder="Descripción (opcional)"
            onChange={(e) => setDescription(e.target.value)}
          />

          <button className="w-full bg-cyan-600 p-3 rounded text-white font-bold">
            Crear
          </button>
        </form>

        <button
          onClick={onClose}
          className="mt-3 w-full p-2 text-gray-300 hover:text-white"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
