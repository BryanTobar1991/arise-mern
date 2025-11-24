import React, { useState, useEffect } from 'react';
import { fetchUserAchievements } from '../../lib/achievementService'; 
import { FaTrophy, FaCalendarCheck, FaDumbbell } from 'react-icons/fa'; // Iconos de ejemplo

// Mapeo simple de iconos para la demo (puedes usar un objeto más sofisticado)
const IconMap = {
    'trophy': FaTrophy,
    '👟': FaDumbbell,
    '🍎': FaCalendarCheck,
    '🔔': FaCalendarCheck
};

export default function Achievements() {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadAchievements = async () => {
            try {
                const data = await fetchUserAchievements();
                setAchievements(data);
            } catch (err) {
                setError("No se pudieron cargar los logros. Inténtalo de nuevo.");
            } finally {
                setLoading(false);
            }
        };

        loadAchievements();
    }, []);

    if (loading) {
        return <div className="p-8 text-white">Cargando logros...</div>;
    }

    if (error) {
        return <div className="p-8 text-red-400">Error: {error}</div>;
    }

    // Función auxiliar para formatear la fecha
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', { 
            year: 'numeric', month: 'long', day: 'numeric' 
        });
    };

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-8 text-white border-b border-slate-700 pb-3">
                🏆 Tus Logros
            </h2>

            {achievements.length === 0 ? (
                <p className="text-slate-400">Aún no has desbloqueado ningún logro. ¡Comienza a registrar actividades!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {achievements.map((ach) => {
                        // Obtiene el componente de ícono o usa uno por defecto
                        const Icon = IconMap[ach.icon] || FaTrophy; 

                        return (
                            <div 
                                key={ach.id} 
                                className="bg-slate-800 p-6 rounded-xl shadow-lg border border-cyan-500/50 hover:shadow-cyan-500/20 transition-all duration-300"
                            >
                                <div className="flex items-center space-x-4 mb-3">
                                    <Icon className="text-4xl text-cyan-400" />
                                    <h3 className="text-xl font-semibold text-white">{ach.name}</h3>
                                </div>
                                <p className="text-slate-400 mb-3">{ach.description}</p>
                                <p className="text-xs text-slate-500">
                                    Desbloqueado el: **{formatDate(ach.unlockedAt)}**
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}