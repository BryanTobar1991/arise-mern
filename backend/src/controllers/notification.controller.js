import asyncHandler from 'express-async-handler';

/**
 * @desc Obtiene un feed consolidado de notificaciones para el usuario autenticado.
 * @route GET /api/notifications
 * @access Private
 */
export const getNotifications = async (req, res) => {
    try {
        // CORRECCIÓN: Usar la variable de usuario consistente con la convención del proyecto
        const userId = req.userId; 

        if (!userId) {
             return res.status(401).json({ error: "No autorizado. Token inválido o expirado." });
        }

        // --- Lógica de Simulación de Recolección de Datos (Mantenida por ahora) ---

        // 1. Notificaciones de Logros (Achivements)
        const achievements = [
            {
                id: 'ach_1',
                type: 'Achievement',
                title: '¡Logro Desbloqueado: Constancia!',
                message: 'Completaste 5 entrenamientos en la última semana. ¡Sigue así!',
                time: '2025-11-24T12:00:00Z',
                priority: 1, 
            },
        ];
        
        // 2. Notificaciones de Recordatorios Próximos (Reminders)
        const upcomingReminders = [
            {
                id: 'rem_1',
                type: 'Reminder',
                title: 'Recordatorio: Beber Agua',
                message: 'Tu recordatorio de hidratación se activa en 15 minutos.',
                time: '2025-11-24T17:00:00Z',
                priority: 2, 
            },
        ];

        // 3. Notificaciones/Feedback de IA (AI Feedback)
        const aiFeedback = [
            {
                id: 'ai_1',
                type: 'AI_Feedback',
                title: 'Sugerencia de la IA',
                message: 'Tus calorías de hoy están 20% por debajo de tu meta. Ajusta tu ingesta.',
                time: '2025-11-24T16:30:00Z',
                priority: 1, 
            },
        ];

        // Combinar todas las notificaciones
        let allNotifications = [
            ...achievements,
            ...upcomingReminders,
            ...aiFeedback,
            {
                id: 'gen_1',
                type: 'General',
                title: '¡Bienvenido de vuelta!',
                message: 'Estamos aquí para ayudarte a alcanzar tus metas de fitness.',
                time: '2025-11-24T09:00:00Z',
                priority: 3, 
            },
        ];

        allNotifications.sort((a, b) => new Date(b.time) - new Date(a.time));

        res.status(200).json(allNotifications);

    } catch (err) {
        console.error("Error en getNotifications:", err);
        // Devolver un 500 si hay otro error inesperado
        res.status(500).json({ error: "Error interno del servidor al obtener notificaciones." }); 
    }
};