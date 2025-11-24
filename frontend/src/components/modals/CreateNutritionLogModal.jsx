import React, { useState } from 'react';
import { createNutritionLog } from '../../lib/nutritionService';

const initialState = {
    date: new Date().toISOString().substring(0, 10), // Fecha actual YYYY-MM-DD
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    notes: '',
};

export default function CreateNutritionLogModal({ isOpen, onClose, onSuccess }) {
    if (!isOpen) return null;

    const [form, setForm] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        // Validación básica
        if (form.calories <= 0 || form.protein < 0 || form.carbs < 0 || form.fats < 0) {
            setError("Los valores de calorías y macros deben ser válidos.");
            setLoading(false);
            return;
        }

        try {
            await createNutritionLog(form);
            onSuccess(); // Esto activará el chequeo de logros en el backend
            setForm(initialState); // Resetear el formulario
        } catch (err) {
            setError(err.response?.data?.error || 'Error al guardar el registro nutricional.');
        } finally {
            setLoading(false);
        }
    };

    // Componente auxiliar para el input de números
    const NumberInput = ({ name, label, color }) => (
        <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">{label} (g)</label>
            <input
                type="number"
                name={name}
                value={form[name]}
                onChange={handleChange}
                min="0"
                className={`w-full p-2 rounded bg-slate-700 text-white border border-slate-700 focus:border-${color}-500`}
                required
            />
        </div>
    );

    return (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-8 rounded-xl w-full max-w-2xl border border-slate-700 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6">Nuevo Registro Nutricional</h3>
                
                {error && <div className="p-3 mb-4 bg-rose-800 text-white rounded text-sm">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        {/* Fecha */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Fecha</label>
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                className="w-full p-3 rounded bg-slate-700 text-white border border-slate-700 focus:border-emerald-500"
                                required
                            />
                        </div>
                        {/* Calorías */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Calorías Totales (kcal)</label>
                            <input
                                type="number"
                                name="calories"
                                value={form.calories}
                                onChange={handleChange}
                                min="0"
                                className="w-full p-3 rounded bg-slate-700 text-white border border-slate-700 focus:border-emerald-500"
                                required
                            />
                        </div>
                    </div>
                    
                    {/* Macronutrientes */}
                    <div className="mb-6 grid grid-cols-3 gap-4">
                        <NumberInput name="protein" label="Proteína" color="rose" />
                        <NumberInput name="carbs" label="Carbohidratos" color="cyan" />
                        <NumberInput name="fats" label="Grasas" color="amber" />
                    </div>

                    {/* Notas */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-400 mb-1">Notas</label>
                        <textarea
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            rows="2"
                            className="w-full p-3 rounded bg-slate-700 text-white border border-slate-700 focus:border-emerald-500"
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
                            className="px-6 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar Registro'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}