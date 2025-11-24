import React, { useState, useEffect } from 'react'; // Importar useEffect
import { createNutritionLog, updateNutritionLog } from '../../lib/nutritionService'; // Importar updateNutritionLog
import { FaSave, FaUtensils } from 'react-icons/fa'; // Importar FaUtensils

const getInitialDate = () => new Date().toISOString().substring(0, 10);

const initialFormState = {
    date: getInitialDate(),
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    notes: '',
};

// Función auxiliar para mapear los datos iniciales (similar a la corrección del Workout)
const mapInitialData = (data) => ({
    // Asegurar que la fecha esté en formato YYYY-MM-DD para el input
    date: data.date ? new Date(data.date).toISOString().substring(0, 10) : getInitialDate(),
    // Los campos numéricos deben asegurarse de ser números, no strings vacías
    calories: data.calories || 0,
    protein: data.protein || 0,
    carbs: data.carbs || 0,
    fats: data.fats || 0,
    notes: data.notes || '',
});


// Aceptamos 'initialData' para el modo edición
export default function CreateNutritionLogModal({ isOpen, onClose, onSuccess, initialData }) {
    if (!isOpen) return null;

    const isEditing = !!initialData;

    // Estado local para el formulario
    const [form, setForm] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Lógica de inicialización/reseteo (ejecutada cuando initialData cambia o al cerrar/abrir)
    useEffect(() => {
        setForm(initialData ? mapInitialData(initialData) : initialFormState);
        setError(null);
    }, [initialData]);
    // El 'useState' inicializa al montar, el 'useEffect' re-inicializa al cambiar 'initialData'

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        
        // CORRECCIÓN: Si el valor numérico es vacío, establecemos 0, sino Mongoose falla.
        const cleanedValue = type === 'number' && value === '' ? 0 : value;

        setForm(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(cleanedValue) : cleanedValue,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        // Datos limpios a enviar al backend
        const dataToSend = {
            ...form,
            // Convertir explícitamente a Number si quedaron strings, aunque handleChange lo hace
            calories: Number(form.calories),
            protein: Number(form.protein),
            carbs: Number(form.carbs),
            fats: Number(form.fats),
        };
        
        // Validación básica (mejorada)
        if (dataToSend.calories <= 0 || dataToSend.protein < 0 || dataToSend.carbs < 0 || dataToSend.fats < 0) {
            setError("Las calorías deben ser positivas, y los macros no pueden ser negativos.");
            setLoading(false);
            return;
        }

        try {
            if (isEditing) {
                // Modo Edición: Llamar a la función de actualización
                await updateNutritionLog(initialData._id, dataToSend);
            } else {
                // Modo Creación: Llamar a la función de creación
                await createNutritionLog(dataToSend);
            }
            
            onSuccess(); // Recarga los datos en la vista principal
            // No resetear el formulario aquí, se hace por el useEffect al cambiar el estado de la página
        } catch (err) {
            setError(err.response?.data?.error || `Error al ${isEditing ? 'actualizar' : 'guardar'} el registro.`);
        } finally {
            setLoading(false);
        }
    };

    const modalTitle = isEditing ? 'Editar Registro Nutricional' : 'Nuevo Registro Nutricional';
    const buttonText = isEditing ? 'Guardar Cambios' : 'Guardar Registro';


    // Componente auxiliar para el input de números (sin cambios, usa form)
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
        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 p-6 sm:p-8 rounded-xl w-full max-w-2xl border border-slate-700 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <FaUtensils className="text-emerald-400"/> {modalTitle}
                </h3>
                
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
                            <FaSave className="inline mr-1" /> {loading ? 'Procesando...' : buttonText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}