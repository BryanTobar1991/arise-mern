import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchUserProfile, updateProfile } from '../../lib/userService';
import { FaUserEdit, FaEnvelope, FaCalendarAlt, FaSpinner, FaWeight, FaSave } from 'react-icons/fa'; // Importar FaWeight y FaSave

export default function Profile() {
    const { user: authUser, setUser } = useAuth(); // Obtener setUser del contexto
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false); // Estado para el botón de guardar
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Estado para el formulario de edición
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        weight: '',
    });

    // 1. Cargar el perfil detallado
    const loadProfile = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const data = await fetchUserProfile();
            setProfile(data);
            // Inicializar el formulario con los datos cargados
            setEditForm({
                name: data.name || '',
                email: data.email || '',
                weight: data.weight || '',
            });
        } catch (err) {
            // Usamos datos básicos si el endpoint detallado falla
            setProfile(authUser);
            setError("Error al cargar el perfil detallado. Los datos mostrados son básicos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, [authUser]);

    // 2. Manejar la edición
    const handleEditToggle = () => {
        // Al cancelar la edición, reestablecer el formulario a los datos actuales
        if (isEditing) {
            setEditForm({
                name: profile?.name || authUser?.name || '',
                email: profile?.email || authUser?.email || '',
                weight: profile?.weight || '',
            });
            setError(null);
            setSuccessMessage(null);
        }
        setIsEditing(!isEditing);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSuccessMessage(null);

        // Crear un objeto con solo los campos modificados
        const dataToUpdate = { ...editForm };

        if (dataToUpdate.weight === '' || dataToUpdate.weight === null) {
            // Si el campo está vacío, lo enviamos como undefined para que el backend lo omita
            // o lo guarde como nulo si el esquema lo permite.
            dataToUpdate.weight = undefined;
        } else {
            // Convertir explícitamente a float (por el step="0.1")
            dataToUpdate.weight = parseFloat(dataToUpdate.weight);
        }

        try {
            const updatedData = await updateProfile(dataToUpdate);

            // 1. Actualizar la vista del perfil con los nuevos datos
            setProfile(prev => ({ ...prev, ...updatedData }));

            // 2. Actualizar el AuthContext
            setUser(prev => ({ ...prev, name: updatedData.name, email: updatedData.email }));

            setSuccessMessage("Perfil actualizado con éxito.");
            setIsEditing(false);

        } catch (err) {
            // Verificar si la respuesta fue un error HTTP
            if (err.response) {
                // Error con respuesta del servidor (4xx o 5xx)
                setError(err.response.data?.error || 'Error del servidor: No se pudo procesar la solicitud.');
            } else if (err.message === 'Network Error') {
                // Error de red
                setError('Error de red: El servidor no está disponible.');
            } else {
                // Otros errores (parsing, etc.)
                console.error(err);
                setError('Error desconocido al actualizar el perfil. Por favor, revise la consola.');
            }
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-white flex items-center gap-2"><FaSpinner className="animate-spin" /> Cargando perfil...</div>;
    }

    const displayUser = profile || authUser;

    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-10 border-b border-slate-700 pb-4">
                <h2 className="text-3xl font-bold text-white">Mi Perfil ({displayUser?.name})</h2>
                <button
                    onClick={handleEditToggle}
                    className={`flex items-center gap-2 px-4 py-2 ${isEditing ? 'bg-rose-600 hover:bg-rose-500' : 'bg-indigo-600 hover:bg-indigo-500'} rounded-lg text-sm font-medium transition shadow-md`}
                    disabled={isSaving}
                >
                    {isEditing ? <FaSpinner className={`inline ${isSaving ? 'animate-spin' : ''}`} /> : <FaUserEdit />}
                    {isEditing ? (isSaving ? 'Guardando...' : 'Cancelar') : 'Editar Perfil'}
                </button>
            </div>

            {error && <div className="p-3 mb-4 bg-rose-800 text-white rounded text-sm">{error}</div>}
            {successMessage && <div className="p-3 mb-4 bg-emerald-600 text-white rounded text-sm">{successMessage}</div>}

            <div className="bg-slate-800 p-8 rounded-xl shadow-xl border border-slate-700">

                {/* VISTA DE SOLO LECTURA */}
                {!isEditing && (
                    <>
                        <h3 className="text-2xl font-semibold text-indigo-400 mb-6">Información General</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                            {/* Nombre */}
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-400">Nombre</span>
                                <p className="text-white text-lg">{displayUser?.name}</p>
                            </div>

                            {/* Email */}
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-400">
                                    <FaEnvelope className="inline mr-1 text-cyan-400" /> Email
                                </span>
                                <p className="text-white text-lg">{displayUser?.email}</p>
                            </div>

                            {/* Peso */}
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-400">
                                    <FaWeight className="inline mr-1 text-cyan-400" /> Peso Actual
                                </span>
                                <p className="text-white text-lg">{displayUser?.weight ? `${displayUser.weight} kg` : 'No registrado'}</p>
                            </div>

                            {/* Fecha de Registro */}
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-400">
                                    <FaCalendarAlt className="inline mr-1 text-cyan-400" /> Miembro Desde
                                </span>
                                <p className="text-white text-lg">{new Date(displayUser?.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </>
                )}


                {/* ÁREA DE EDICIÓN */}
                {isEditing && (
                    <form onSubmit={handleFormSubmit} className="mt-4">
                        <h3 className="text-xl font-semibold text-indigo-400 mb-4">Editar Datos</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Campo Nombre */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={editForm.name}
                                    onChange={handleFormChange}
                                    className="w-full p-3 rounded bg-slate-700 text-white border border-slate-700 focus:border-cyan-500"
                                    required
                                />
                            </div>

                            {/* Campo Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={editForm.email}
                                    onChange={handleFormChange}
                                    className="w-full p-3 rounded bg-slate-700 text-white border border-slate-700 focus:border-cyan-500"
                                    required
                                />
                            </div>

                            {/* Campo Peso */}
                            <div>
                                <label htmlFor="weight" className="block text-sm font-medium text-slate-400 mb-1">
                                    <FaWeight className="inline mr-1 text-cyan-400" /> Peso (kg)
                                </label>
                                <input
                                    type="number"
                                    id="weight"
                                    name="weight"
                                    value={editForm.weight}
                                    onChange={handleFormChange}
                                    step="0.1"
                                    min="30"
                                    max="500"
                                    className="w-full p-3 rounded bg-slate-700 text-white border border-slate-700 focus:border-cyan-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-slate-700/50">
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-6 py-2 text-sm font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition disabled:opacity-50"
                                disabled={isSaving}
                            >
                                <FaSave /> {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}