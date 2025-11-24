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