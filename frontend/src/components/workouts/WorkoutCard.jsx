import React from 'react';
import { FaTrash, FaEdit, FaDumbbell } from 'react-icons/fa';

export default function WorkoutCard({ workout, onDelete, onEdit }) {
    
    // Muestra solo 3 ejercicios para la vista previa
    const previewExercises = workout.exercises?.slice(0, 3) || [];
    const exerciseCount = workout.exercises?.length || 0;

    // Formatear la fecha
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', { 
            year: 'numeric', month: 'short', day: 'numeric' 
        });
    };

    return (
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-md flex flex-col">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-cyan-400">{workout.title}</h3>
                <span className="text-xs text-slate-500">
                    {formatDate(workout.createdAt)}
                </span>
            </div>

            <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                {workout.description || "Sin descripción."}
            </p>

            <div className="flex items-center text-sm text-slate-300 mb-4">
                <FaDumbbell className="mr-2 text-cyan-500" />
                {exerciseCount} {exerciseCount === 1 ? 'Ejercicio' : 'Ejercicios'} registrados
            </div>

            <div className="mt-auto flex justify-end space-x-3 pt-3 border-t border-slate-700/50">
                <button 
                    onClick={() => onEdit(workout)}
                    className="text-sm text-slate-400 hover:text-white transition"
                >
                    <FaEdit className="inline mr-1" /> Editar
                </button>
                <button 
                    onClick={() => onDelete(workout._id)}
                    className="text-sm text-rose-400 hover:text-rose-500 transition"
                >
                    <FaTrash className="inline mr-1" /> Eliminar
                </button>
            </div>
        </div>
    );
}