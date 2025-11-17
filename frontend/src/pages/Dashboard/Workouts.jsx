import { useEffect, useState } from "react";
import api from "../../lib/axios";
import WorkoutCard from "../../components/workouts/WorkoutCard";
import CreateWorkoutModal from "../../components/modals/CreateWorkoutModal";
import { FiPlus } from "react-icons/fi";

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    loadWorkouts();
  }, []);

  async function loadWorkouts() {
    try {
      const res = await api.get("/workouts");
      setWorkouts(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteWorkout(id) {
    if (!confirm("¿Eliminar entrenamiento?")) return;

    try {
      await api.delete(`/workouts/${id}`);
      setWorkouts(workouts.filter((w) => w._id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  function handleCreated(workout) {
    setWorkouts([workout, ...workouts]);
  }

  return (
    <div className="space-y-6 animate-fade">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-cyan-400">Entrenamientos</h1>

        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-xl"
        >
          <FiPlus size={20} /> Nuevo
        </button>
      </div>

      {workouts.length === 0 && (
        <p className="text-slate-400">Aún no tienes entrenamientos.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {workouts.map((w) => (
          <WorkoutCard key={w._id} workout={w} onDelete={deleteWorkout} />
        ))}
      </div>

      <CreateWorkoutModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
