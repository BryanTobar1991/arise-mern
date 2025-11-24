import React, { useState } from 'react';
import { createReminder } from '../../lib/reminderService';
import { FaCalendarAlt, FaClock, FaRedoAlt } from 'react-icons/fa'; // Importar nuevo ícono

// Opciones de Recurrencia
const RECURRENCE_OPTIONS = [
    { value: 'never', label: 'Nunca' },
    { value: 'daily', label: 'Diario' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensual' },
];

// Obtener fecha y hora actual en formato local
const getInitialDateTime = () => {
    const now = new Date();
    // Obtiene la fecha en formato YYYY-MM-DD
    const date = now.toISOString().substring(0, 10); 
    // Obtiene la hora en formato HH:MM
    const time = now.toTimeString().substring(0, 5); 
    return { date, time };
};

const initialFormState = {
    title: '',
    description: '',
    ...getInitialDateTime(),
    recurrence: 'never', // NUEVO CAMPO: Valor inicial
};

export default function CreateReminderModal({ isOpen, onClose, onSuccess }) {
    if (!isOpen) return null;

    const [form, setForm] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    // Función para cerrar y resetear el estado
    const handleClose = () => {
        setForm(initialFormState);
        setError(null);
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Combinar fecha y hora en un solo objeto Date (dueAt)
        const dueAt = new Date(`${form.date}T${form.time}:00`);
        
        // Validación básica
        if (!form.title) {
            setError("El título es obligatorio.");
            setLoading(false);
            return;
        }

        if (dueAt < new Date()) {
             setError("La fecha y hora del recordatorio no pueden ser en el pasado.");
             setLoading(false);
             return;
        }

        try {
            // Se envía el nuevo campo 'recurrence' al backend
            await createReminder({ 
                title: form.title, 
                description: form.description, 
                dueAt, // Formato ISO para el backend
                recurrence: form.recurrence // DATO DE RECURRENCIA
            }); 
            
            onSuccess();
            handleClose(); // Usar la nueva función para cerrar y resetear
        } catch (err) {
            setError(err.response?.data?.error || 'Error al guardar el recordatorio.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
             {/* Modal Content - Añadir responsive (max-w-lg en desktop, w-full en móvil) */}
            <div className="bg-slate-800 p-6 sm:p-8 rounded-xl w-full max-w-lg border border-slate-700 shadow-2xl overflow-y-auto max-h-[90vh]">
                <h3 className="text-2xl font-bold text-white mb-6">Configurar Recordatorio</h3>
                
                {error && <div className="p-3 mb-4 bg-rose-800 text-white rounded text-sm">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Título y Descripción (Mismos, no hay cambios) */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-400 mb-1">Título</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="w-full p-3 rounded bg-slate-700 text-white border border-slate-700 focus:border-cyan-500"
                            placeholder="Ej: Tomar Suplementos"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-400 mb-1">Descripción</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows="2"
                            className="w-full p-3 rounded bg-slate-700 text-white border border-slate-700 focus:border-cyan-500"
                            placeholder="Recordatorio para la rutina de tarde..."
                        />
                    </div>

                    {/* Fecha y Hora (Mismos, diseño responsive) */}
                    <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">
                                <FaCalendarAlt className="inline mr-1 text-cyan-400" /> Fecha
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                className="w-full p-3 rounded bg-slate-700 text-white border border-slate-700 focus:border-cyan-500 appearance-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">
                                <FaClock className="inline mr-1 text-cyan-400" /> Hora
                            </label>
                            <input
                                type="time"
                                name="time"
                                value={form.time}
                                onChange={handleChange}
                                className="w-full p-3 rounded bg-slate-700 text-white border border-slate-700 focus:border-cyan-500 appearance-none"
                                required
                            />
                        </div>
                    </div>

                    {/* NUEVO CAMPO: Recurrencia */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                             <FaRedoAlt className="inline mr-1 text-cyan-400" /> Recurrencia
                        </label>
                        <select
                            name="recurrence"
                            value={form.recurrence}
                            onChange={handleChange}
                            className="w-full p-3 rounded bg-slate-700 text-white border border-slate-700 focus:border-cyan-500"
                        >
                            {RECURRENCE_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                         <p className="mt-1 text-xs text-slate-500">Define si este recordatorio se repetirá automáticamente.</p>
                    </div>
                    
                    {/* Botones de acción */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700/50">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 text-sm font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar Recordatorio'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}