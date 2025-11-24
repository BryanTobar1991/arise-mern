import React from 'react';
import { FaTrash, FaEdit, FaAppleAlt } from 'react-icons/fa';

export default function NutritionCard({ log, onDelete, onEdit }) {
    
    // Formatear la fecha
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', { 
            weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' 
        });
    };

    return (
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-md flex flex-col">
            <div className="flex justify-between items-start mb-3 border-b border-slate-700/50 pb-2">
                <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                    <FaAppleAlt /> Registro Nutricional
                </h3>
                <span className="text-sm text-slate-500">
                    {formatDate(log.date)}
                </span>
            </div>

            {/* Macros y Calorías */}
            <div className="grid grid-cols-2 gap-4 my-2">
                <div className="text-sm">
                    <p className="text-slate-400">Calorías Totales:</p>
                    <p className="text-2xl font-extrabold text-white">{log.calories} kcal</p>
                </div>
                <div className="grid grid-cols-3 text-center text-sm">
                    <div>
                        <p className="text-md font-bold text-rose-400">{log.protein}g</p>
                        <p className="text-slate-500">Prot.</p>
                    </div>
                    <div>
                        <p className="text-md font-bold text-cyan-400">{log.carbs}g</p>
                        <p className="text-slate-500">Carbs.</p>
                    </div>
                    <div>
                        <p className="text-md font-bold text-amber-400">{log.fats}g</p>
                        <p className="text-slate-500">Grasas</p>
                    </div>
                </div>
            </div>
            
            {log.notes && (
                <p className="text-slate-500 text-sm mt-2 line-clamp-2 italic">
                    Notas: {log.notes}
                </p>
            )}

            <div className="mt-auto flex justify-end space-x-3 pt-3 border-t border-slate-700/50">
                <button 
                    onClick={() => onEdit(log)}
                    className="text-sm text-slate-400 hover:text-white transition"
                >
                    <FaEdit className="inline mr-1" /> Editar
                </button>
                <button 
                    onClick={() => onDelete(log._id)}
                    className="text-sm text-rose-400 hover:text-rose-500 transition"
                >
                    <FaTrash className="inline mr-1" /> Eliminar
                </button>
            </div>
        </div>
    );
}