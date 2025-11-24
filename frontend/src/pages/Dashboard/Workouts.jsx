// frontend/src/pages/Dashboard/Workouts.jsx

import React, { useState, useEffect } from 'react';
import WorkoutCard from '../../components/workouts/WorkoutCard';
import CreateWorkoutModal from '../../components/modals/CreateWorkoutModal'; // Asumo que tienes este modal
import { fetchWorkouts, deleteWorkout } from '../../lib/workoutService';
import { FaPlusCircle } from 'react-icons/fa';

export default function Workouts() {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 1. Carga inicial de datos
    const loadWorkouts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchWorkouts();
            setWorkouts(data);
        } catch (err) {
            setError("Error al cargar entrenamientos. Intenta recargar la página.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWorkouts();
    }, []);

    // 2. Manejar la creación exitosa (recarga la lista)
    const handleCreateSuccess = () => {
        setIsModalOpen(false);
        loadWorkouts(); // Recarga la lista para mostrar el nuevo entrenamiento/logro
    };

    // 3. Manejar la eliminación
    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este entrenamiento?")) return;

        try {
            await deleteWorkout(id);
            // Actualizar la lista localmente
            setWorkouts(workouts.filter(w => w._id !== id));
        } catch (err) {
            alert("Error al eliminar el entrenamiento.");
        }
    };
    
    // NOTA: La función handleEdit abriría el modal en modo edición. Por ahora, solo es un placeholder.
    const handleEdit = (workout) => {
        alert(`Editar entrenamiento: ${workout.title}`);
        // Aquí abrirías el modal con los datos del workout
    };


    if (loading) {
        return <div className="p-8 text-white">Cargando tus rutinas...</div>;
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-10 border-b border-slate-700 pb-4">
                <h2 className="text-3xl font-bold text-white">Gestión de Entrenamientos</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-sm font-medium transition shadow-md"
                >
                    <FaPlusCircle /> Nuevo Registro
                </button>
            </div>
            
            {error && <div className="p-3 mb-4 bg-red-800 text-white rounded">{error}</div>}

            {workouts.length === 0 ? (
                <div className="text-center p-10 bg-slate-800 rounded-xl">
                    <p className="text-slate-400">Aún no tienes entrenamientos registrados. ¡Comienza hoy!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workouts.map(workout => (
                        <WorkoutCard 
                            key={workout._id} 
                            workout={workout} 
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>
            )}

            {/* Modal de Creación */}
            <CreateWorkoutModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />
        </div>
    );
}