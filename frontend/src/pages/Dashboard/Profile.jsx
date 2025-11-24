import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchUserProfile, updateProfile } from '../../lib/userService'; 
import { FaUserEdit, FaEnvelope, FaCalendarAlt, FaSpinner } from 'react-icons/fa';

export default function Profile() {
    const { user: authUser } = useAuth(); // Datos básicos del AuthContext
    const [profile, setProfile] = useState(null); // Datos detallados del perfil
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. Cargar el perfil detallado
    const loadProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            // Nota: Esta llamada fallará hasta que implementemos el endpoint en el backend.
            const data = await fetchUserProfile(); 
            setProfile(data);
        } catch (err) {
            // Usamos datos básicos si el endpoint detallado falla
            setProfile(authUser); 
            setError("Error al cargar el perfil detallado. El endpoint del backend podría faltar.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, [authUser]);

    // 2. Manejar la edición (Placeholder)
    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    if (loading) {
        return <div className="p-8 text-white flex items-center gap-2"><FaSpinner className="animate-spin" /> Cargando perfil...</div>;
    }

    const displayUser = profile || authUser;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-10 border-b border-slate-700 pb-4">
                <h2 className="text-3xl font-bold text-white">Mi Perfil ({displayUser?.name})</h2>
                <button
                    onClick={handleEditToggle}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition shadow-md"
                >
                    <FaUserEdit /> {isEditing ? 'Cancelar' : 'Editar Perfil'}
                </button>
            </div>
            
            {error && <div className="p-3 mb-4 bg-red-800 text-white rounded text-sm">{error}</div>}

            <div className="bg-slate-800 p-8 rounded-xl shadow-xl border border-slate-700">
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

                    {/* Fecha de Registro */}
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-400">
                            <FaCalendarAlt className="inline mr-1 text-cyan-400" /> Miembro Desde
                        </span>
                        {/* Asume que el backend devuelve 'createdAt' */}
                        <p className="text-white text-lg">{new Date(displayUser?.createdAt).toLocaleDateString()}</p> 
                    </div>

                    {/* Campos adicionales (Metas, Peso, Altura, etc. - para futuro) */}
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-400">Metas de Fitness</span>
                        <p className="text-slate-500 italic text-lg">Añadir edición aquí (futuro)</p>
                    </div>
                </div>

                {/* Área de Edición (Oculta por defecto) */}
                {isEditing && (
                    <div className="mt-8 border-t border-slate-700 pt-6">
                        <h3 className="text-xl font-semibold text-indigo-400 mb-4">Editar Datos</h3>
                        {/* Aquí iría el formulario de edición */}
                        <p className="text-slate-400">Falta implementar el formulario de edición.</p>
                    </div>
                )}
            </div>
        </div>
    );
}