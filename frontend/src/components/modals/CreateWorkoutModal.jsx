import React, { useState } from 'react';
import { createWorkout } from '../../lib/workoutService';

export default function CreateWorkoutModal({ isOpen, onClose, onSuccess }) {
    if (!isOpen) return null;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await createWorkout({ title, description, exercises: [] }); // Simplificamos por ahora
            onSuccess();
            // Esto activará el chequeo de logros en el backend
        } catch (err) {
            setError(err.response?.data?.error || 'Error al guardar el entrenamiento.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-8 rounded-xl w-full max-w-lg border border-slate-700 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6">Registrar Nuevo Entrenamiento</h3>
                
                {error && <div className="p-3 mb-4 bg-rose-800 text-white rounded text-sm">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-400 mb-1">Título</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 rounded bg-slate-700 text-white border border-slate-700 focus:border-cyan-500"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-400 mb-1">Descripción/Notas</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                            className="w-full p-3 rounded bg-slate-700 text-white border border-slate-700 focus:border-cyan-500"
                        />
                    </div>
                    
                    {/* Botones de acción */}
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
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
                            {loading ? 'Guardando...' : 'Guardar Entrenamiento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}