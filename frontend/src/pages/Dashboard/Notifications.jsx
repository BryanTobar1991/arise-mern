import React, { useState, useEffect } from 'react';
import { FiMail, FiStar, FiClock, FiActivity, FiMessageSquare } from 'react-icons/fi';
// Importar el servicio
import { fetchNotifications } from '../../lib/notificationService'; 

// Función auxiliar para obtener el ícono y color basado en el tipo de notificación
const getNotificationTypeProps = (type) => {
    switch (type) {
        case 'Achievement':
            return { icon: FiStar, color: 'border-amber-500', iconColor: 'text-amber-500' };
        case 'Reminder':
            return { icon: FiClock, color: 'border-indigo-500', iconColor: 'text-indigo-500' };
        case 'AI_Feedback':
            return { icon: FiActivity, color: 'border-rose-500', iconColor: 'text-rose-500' };
        case 'General':
        default:
            return { icon: FiMessageSquare, color: 'border-cyan-500', iconColor: 'text-cyan-500' };
    }
};

// Componente para mostrar una notificación individual
const NotificationCard = ({ icon: Icon, title, message, time, iconColor, color }) => (
    <div className={`flex items-start p-4 bg-slate-900 border-l-4 ${color} rounded-lg shadow-md hover:bg-slate-800 transition`}>
        <Icon className={`text-2xl ${iconColor} mr-4 flex-shrink-0 mt-1`} />
        <div className="flex-1">
            <h3 className="text-base font-semibold text-white">{title}</h3>
            <p className="text-sm text-slate-400 mt-1">{message}</p>
            {/* Opcional: Implementación de una función para formatear la hora (ej: "Hace 5 minutos") */}
            <p className="text-xs text-slate-500 mt-2">{time}</p>
        </div>
    </div>
);


export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadNotifications = async () => {
            setLoading(true);
            try {
                const data = await fetchNotifications();
                setNotifications(data);
            } catch (error) {
                // El servicio ya maneja la consola, solo aseguramos que el estado esté vacío
                setNotifications([]); 
            } finally {
                setLoading(false);
            }
        };
        loadNotifications();
    }, []);

    return (
        <div className="space-y-8 p-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-cyan-400 border-b border-slate-800 pb-3">
                Bandeja de Notificaciones 📬
            </h1>

            {loading ? (
                <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl">
                    <p className="text-lg text-slate-400">Cargando tu feed de notificaciones...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {notifications.length > 0 ? (
                        notifications.map(notif => {
                            const { icon, color, iconColor } = getNotificationTypeProps(notif.type);
                            return (
                                <NotificationCard
                                    key={notif.id}
                                    icon={icon}
                                    title={notif.title}
                                    message={notif.message}
                                    // Usamos el campo 'time' que viene del backend
                                    time={new Date(notif.time).toLocaleString()} 
                                    color={color}
                                    iconColor={iconColor}
                                />
                            );
                        })
                    ) : (
                        <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-400">
                            <p className="text-lg">¡Felicitaciones! No tienes notificaciones pendientes.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}