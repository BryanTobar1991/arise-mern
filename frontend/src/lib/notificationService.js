import api from './axios';

const NOTIFICATION_URL = '/notifications'; 

/**
 * @desc Obtiene el feed consolidado de notificaciones del backend.
 * @returns {Promise<Array>} Una lista de objetos de notificación.
 */
export const fetchNotifications = async () => {
    try {
        const response = await api.get(NOTIFICATION_URL); 
        return response.data;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        // Devolver un array vacío en caso de fallo para evitar errores en la UI
        return []; 
    }
};