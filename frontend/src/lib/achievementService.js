import api from './axios'; // Importa tu instancia configurada de Axios (frontend/src/lib/axios.js)

const ACHIEVEMENT_URL = '/achievements';

/**
 * Obtiene los logros que el usuario actual ha desbloqueado.
 * @returns {Promise<Array>} Lista de logros con sus detalles y fecha de desbloqueo.
 */
export const fetchUserAchievements = async () => {
    try {
        const response = await api.get(ACHIEVEMENT_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching user achievements:", error);
        throw error;
    }
};

/**
 * Obtiene la lista de todos los logros disponibles en la plataforma.
 * @returns {Promise<Array>} Lista de todos los logros que se pueden ganar.
 */
export const fetchAvailableAchievements = async () => {
    try {
        const response = await api.get(`${ACHIEVEMENT_URL}/available`);
        return response.data;
    } catch (error) {
        console.error("Error fetching available achievements:", error);
        throw error;
    }
};