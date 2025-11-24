// frontend/src/pages/Dashboard/Reminders.jsx

import React, { useState, useEffect } from 'react';
import ReminderCard from '../../components/reminders/ReminderCard';
import CreateReminderModal from '../../components/modals/CreateReminderModal'; 
import { fetchReminders, updateReminder, deleteReminder } from '../../lib/reminderService';
import { FaPlusCircle } from 'react-icons/fa';

export default function Reminders() {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadReminders = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchReminders();
            // Filtrar para mostrar primero los pendientes, luego los completados
            const sorted = data.sort((a, b) => a.done - b.done || new Date(a.dueAt) - new Date(b.dueAt));
            setReminders(sorted);
        } catch (err) {
            setError("Error al cargar recordatorios. Asegúrate que tu backend está corriendo.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReminders();
    }, []);

    const handleCreateSuccess = () => {
        setIsModalOpen(false);
        loadReminders(); 
    };

    const handleMarkDone = async (id) => {
        try {
            await updateReminder(id, { done: true });
            loadReminders(); // Recargar para actualizar el estado
        } catch (err) {
            alert("Error al marcar como completado.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este recordatorio?")) return;

        try {
            await deleteReminder(id);
            setReminders(reminders.filter(r => r._id !== id));
        } catch (err) {
            alert("Error al eliminar el recordatorio.");
        }
    };

    if (loading) {
        return <div className="p-8 text-white">Cargando tus recordatorios...</div>;
    }

    // Separar por estado para mejor visualización
    const upcomingReminders = reminders.filter(r => !r.done);
    const completedReminders = reminders.filter(r => r.done);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-10 border-b border-slate-700 pb-4">
                <h2 className="text-3xl font-bold text-white">Gestión de Recordatorios</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-sm font-medium transition shadow-md"
                >
                    <FaPlusCircle /> Nuevo Recordatorio
                </button>
            </div>
            
            {error && <div className="p-3 mb-4 bg-red-800 text-white rounded">{error}</div>}

            {/* Recordatorios Pendientes */}
            <h3 className="text-2xl font-semibold text-white mb-4">Pendientes ({upcomingReminders.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {upcomingReminders.length === 0 ? (
                    <p className="text-slate-400 col-span-3">¡No tienes recordatorios pendientes! Estás al día.</p>
                ) : (
                    upcomingReminders.map(r => (
                        <ReminderCard 
                            key={r._id} 
                            reminder={r} 
                            onMarkDone={handleMarkDone}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>

            {/* Recordatorios Completados */}
            <h3 className="text-2xl font-semibold text-slate-400 mb-4 border-t border-slate-800 pt-6">Completados ({completedReminders.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedReminders.map(r => (
                    <ReminderCard 
                        key={r._id} 
                        reminder={r} 
                        onMarkDone={handleMarkDone} // Se mantendrá inactivo si done=true
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            <CreateReminderModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />
        </div>
    );
}