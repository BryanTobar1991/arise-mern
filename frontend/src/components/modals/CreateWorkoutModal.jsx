import React, { useState, useEffect } from 'react'; 
import { createWorkout, updateWorkout } from '../../lib/workoutService'; 
import { FaSave, FaRunning } from 'react-icons/fa';

const getInitialDate = () => new Date().toISOString().substring(0, 10);

const initialFormState = {
    title: '',
    description: '',
    date: getInitialDate(),
};

// Función auxiliar para mapear los datos iniciales
const mapInitialData = (data) => ({
    title: data.title || '',
    description: data.description || '',
    date: data.date ? new Date(data.date).toISOString().substring(0, 10) : getInitialDate(),
});

// Aceptamos 'initialData' para el modo edición
export default function CreateWorkoutModal({ isOpen, onClose, onSuccess, initialData }) {
    if (!isOpen) return null;

    const isEditing = !!initialData;
    
    // CORRECCIÓN CLAVE: Usamos un key que cambia entre modos para forzar la re-inicialización
    // En este caso, usaremos el ID del entrenamiento para que el estado cambie
    // cuando pasamos de un entrenamiento a otro, o a null para creación.
    const workoutIdKey = initialData?._id || 'new';

    // 1. Inicialización segura del estado (Se ejecuta solo una vez o cuando cambia la 'key')
    const [form, setForm] = useState(() => {
        if (initialData) {
            return mapInitialData(initialData);
        }
        return initialFormState;
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 2. useEffect simplificado para RESETEAR cuando se abre el modal
    useEffect(() => {
        // Resetear el estado si el componente se mantiene montado
        setForm(initialData ? mapInitialData(initialData) : initialFormState);
        setError(null);
    }, [initialData]); // SÓLO dependemos de initialData

    // Función que se dispara cuando initialData cambia
    useEffect(() => {
        if (isOpen) {
             setError(null);
        }
    }, [isOpen]); 


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        // ... (La lógica de envío de datos sigue igual)
        e.preventDefault();
        setLoading(true);
        setError(null);

        const dataToSend = {
            title: form.title,
            description: form.description,
            date: form.date, 
            exercises: initialData?.exercises || [], 
        };

        try {
            if (isEditing) {
                await updateWorkout(initialData._id, dataToSend);
            } else {
                await createWorkout(dataToSend);
            }
            
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.error || `Error al ${isEditing ? 'actualizar' : 'guardar'} el entrenamiento.`);
        } finally {
            setLoading(false);
        }
    };

    const modalTitle = isEditing ? 'Editar Entrenamiento' : 'Registrar Nuevo Entrenamiento';
    const buttonText = isEditing ? 'Guardar Cambios' : 'Guardar Entrenamiento';

    return (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 p-6 sm:p-8 rounded-xl w-full max-w-lg border border-slate-700 shadow-2xl">
                {/* ... (JSX del formulario sin cambios funcionales) */}
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <FaRunning className="text-cyan-400"/> {modalTitle}
                </h3>
                
                {error && <div className="p-3 mb-4 bg-rose-800 text-white rounded text-sm">{error}</div>}

                <form onSubmit={handleSubmit}>
                    
                    {/* Fecha del Entrenamiento */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-400 mb-1">Fecha</label>
                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            className="w-full p-3 rounded bg-slate-700 text-white border border-slate-700 focus:border-cyan-500"
                            required
                        />
                    </div>
                    
                    {/* Título */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-400 mb-1">Título</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="w-full p-3 rounded bg-slate-700 text-white border border-slate-700 focus:border-cyan-500"
                            required
                        />
                    </div>

                    {/* Descripción/Notas */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-400 mb-1">Descripción/Notas</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
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
                            className="px-6 py-2 text-sm font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition disabled:opacity-50 flex items-center gap-2"
                            disabled={loading}
                        >
                            <FaSave /> {loading ? 'Procesando...' : buttonText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}