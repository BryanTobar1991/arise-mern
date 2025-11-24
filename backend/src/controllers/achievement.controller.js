import User from '../models/User.js';
import Achievement from '../models/Achievement.js';

/**
 * Obtiene todos los logros desbloqueados por el usuario.
 * @route GET /api/achievements
 */
export const getUserAchievements = async (req, res) => {
    try {
        const userId = req.userId; // Obtenido del middleware de autenticación

        // 1. Buscar el usuario y popular (join) la información detallada de los logros.
        const user = await User.findById(userId)
            .select('achievements') // Solo seleccionamos el array de logros
            .populate({
                path: 'achievements.achievementId',
                model: Achievement, // Aseguramos la referencia correcta
                select: 'name description icon' // Solo traemos la info pública
            });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        // 2. Mapear los resultados para presentarlos de forma limpia y plana
        const unlockedAchievements = user.achievements
            .filter(item => item.achievementId) // Filtra logros si la referencia es nula
            .map(item => ({
                id: item.achievementId._id,
                name: item.achievementId.name,
                description: item.achievementId.description,
                icon: item.achievementId.icon,
                unlockedAt: item.unlockedAt, // Momento en que se ganó
            }));

        res.json(unlockedAchievements);

    } catch (err) {
        console.error("Error al obtener logros del usuario:", err);
        res.status(500).json({ error: 'Error interno al obtener logros.' });
    }
};

/**
 * Obtiene todos los logros disponibles en la plataforma (útil para mostrar una lista de lo que se puede ganar).
 * @route GET /api/achievements/available
 */
export const getAllAvailableAchievements = async (req, res) => {
    try {
        const achievements = await Achievement.find({ isActive: true }).select('name description icon');
        res.json(achievements);
    } catch (err) {
        console.error("Error al obtener todos los logros:", err);
        res.status(500).json({ error: 'Error al obtener logros disponibles.' });
    }
};