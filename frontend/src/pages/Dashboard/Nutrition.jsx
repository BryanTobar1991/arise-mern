import React, { useState, useEffect } from 'react';
import NutritionCard from '../../components/nutrition/NutritionCard';
import CreateNutritionLogModal from '../../components/modals/CreateNutritionLogModal';
import { fetchNutritionLogs, deleteNutritionLog } from '../../lib/nutritionService';
import { FaPlusCircle } from 'react-icons/fa';

export default function Nutrition() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // NUEVO ESTADO: Almacena el log a editar
    const [editingLog, setEditingLog] = useState(null); 

    // 1. Carga inicial de datos
    const loadLogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchNutritionLogs();
            setLogs(data);
        } catch (err) {
            setError("Error al cargar registros nutricionales. Intenta recargar la página.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLogs();
    }, []);

    // 2. Manejar la creación/edición exitosa (recarga la lista)
    const handleSuccess = () => {
        setIsModalOpen(false);
        setEditingLog(null); // Limpiar el estado de edición al cerrar
        loadLogs(); // Recarga la lista para mostrar los cambios
    };
    
    // 3. Manejar la apertura para CREAR
    const handleOpenCreateModal = () => {
        setEditingLog(null); // Asegura el modo "Creación"
        setIsModalOpen(true);
    };


    // 4. Manejar la eliminación
    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este registro nutricional?")) return;

        try {
            await deleteNutritionLog(id);
            // Actualizar la lista localmente
            setLogs(logs.filter(l => l._id !== id));
        } catch (err) {
            alert("Error al eliminar el registro.");
        }
    };
    
    // 5. IMPLEMENTACIÓN REAL DE EDICIÓN
    const handleEdit = (log) => {
        setEditingLog(log); // Establece el objeto que queremos editar
        setIsModalOpen(true); // Abre el modal
    };

    if (loading) {
        return <div className="p-8 text-white">Cargando tus registros nutricionales...</div>;
    }

    // Key dinámica para forzar el reinicio del modal (Modo Edición o Creación)
    const modalKey = editingLog ? editingLog._id : 'new-nutrition-log'; 

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-10 border-b border-slate-700 pb-4">
                <h2 className="text-3xl font-bold text-white">Diario Nutricional</h2>
                <button
                    onClick={handleOpenCreateModal} // Llama al handler de creación
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition shadow-md"
                >
                    <FaPlusCircle /> Nuevo Registro
                </button>
            </div>
            
            {error && <div className="p-3 mb-4 bg-red-800 text-white rounded">{error}</div>}

            {logs.length === 0 ? (
                <div className="text-center p-10 bg-slate-800 rounded-xl">
                    <p className="text-slate-400">Aún no tienes registros de nutrición. ¡Comienza a llevar tu control de macros!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {logs.map(log => (
                        <NutritionCard 
                            key={log._id} 
                            log={log} 
                            onDelete={handleDelete}
                            onEdit={handleEdit} // <--- Ahora llama al handler real
                        />
                    ))}
                </div>
            )}

            {/* Modal multipropósito (Crear/Editar) */}
            <CreateNutritionLogModal
                key={modalKey} // Forzar el desmontaje para evitar errores de estado internos (Paso 43)
                isOpen={isModalOpen} 
                onClose={() => {setIsModalOpen(false); setEditingLog(null);}} // Limpiar estado al cerrar
                onSuccess={handleSuccess}
                initialData={editingLog} // <--- Dato para el modo Edición
            />
        </div>
    );
}