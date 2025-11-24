import api from './axios';

const USER_URL = '/users'; // Asumimos una ruta general para datos de usuario

/**
 * Obtiene el perfil completo del usuario autenticado (datos, metas, etc.).
 * Nota: Asume que el backend tiene una ruta GET /api/users/profile
 */
export const fetchUserProfile = async () => {
    try {
        // Asume que tienes un endpoint /api/users/profile o similar para datos detallados
        const response = await api.get(`${USER_URL}/profile`); 
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Actualiza el perfil del usuario.
 */
export const updateProfile = async (data) => {
    try {
        const response = await api.put(`${USER_URL}/profile`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchUserMetrics = async () => {
    try {
        const response = await api.get(`${USER_URL}/metrics`);
        return response.data;
    } catch (error) {
        // En caso de error, puedes devolver un objeto vacío para no romper la UI
        console.error("Error fetching user metrics:", error);
        throw error; 
    }
};

export const fetchHistoricalMetrics = async () => {
    try {
        // Llama a la nueva ruta /api/users/history
        const response = await api.get(`${USER_URL}/history`);
        return response.data.data; // Devolvemos solo el array de 'data'
    } catch (error) {
        console.error("Error fetching historical data:", error);
        return [];
    }
};