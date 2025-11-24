import React from 'react';
import { FaCalendarAlt, FaCheck, FaTrash, FaClock } from 'react-icons/fa';

export default function ReminderCard({ reminder, onMarkDone, onDelete }) {
    
    const dueDate = new Date(reminder.dueAt);
    const dateStr = dueDate.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    const timeStr = dueDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className={`p-5 rounded-xl border shadow-md ${reminder.done 
            ? 'bg-slate-700/50 border-slate-600 opacity-60' 
            : 'bg-slate-800 border-cyan-700/50'
        }`}>
            <div className="flex justify-between items-start">
                <h3 className={`text-xl font-semibold ${reminder.done ? 'text-slate-400 line-through' : 'text-white'}`}>
                    {reminder.title}
                </h3>
                
                {/* Status Badge */}
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${reminder.done 
                    ? 'bg-slate-600 text-slate-300' 
                    : 'bg-cyan-600 text-white'}`
                }>
                    {reminder.done ? 'Completado' : 'Pendiente'}
                </span>
            </div>

            {reminder.description && (
                <p className="text-sm text-slate-500 mt-1 mb-3">
                    {reminder.description}
                </p>
            )}

            {/* Fecha y Hora */}
            <div className="flex items-center space-x-4 text-sm mt-3">
                <p className="flex items-center gap-1 text-slate-400">
                    <FaCalendarAlt className="text-cyan-400" /> {dateStr}
                </p>
                <p className="flex items-center gap-1 text-slate-400">
                    <FaClock className="text-cyan-400" /> {timeStr}
                </p>
            </div>

            {/* Acciones */}
            <div className="mt-4 flex justify-end space-x-3 border-t border-slate-700/50 pt-3">
                {!reminder.done && (
                    <button 
                        onClick={() => onMarkDone(reminder._id)}
                        className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition"
                    >
                        <FaCheck /> Marcar Hecho
                    </button>
                )}
                <button 
                    onClick={() => onDelete(reminder._id)}
                    className="flex items-center gap-1 text-sm text-rose-400 hover:text-rose-500 transition"
                >
                    <FaTrash /> Eliminar
                </button>
            </div>
        </div>
    );
}