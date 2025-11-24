// frontend/src/lib/reminderService.js

import api from './axios'; 

const REMINDER_URL = '/reminders';

/**
 * Obtiene todos los recordatorios del usuario.
 */
export const fetchReminders = async () => {
    try {
        const response = await api.get(REMINDER_URL);
        return response.data;
    } catch (error) {
        // Los errores 401 son manejados por el interceptor.
        throw error;
    }
};

/**
 * Crea un nuevo recordatorio.
 */
export const createReminder = async (data) => {
    try {
        const response = await api.post(REMINDER_URL, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Marca un recordatorio como completado/actualiza.
 */
export const updateReminder = async (id, data) => {
    try {
        const response = await api.put(`${REMINDER_URL}/${id}/done`, data); // Usamos PUT/PATCH en /:id/done
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Elimina un recordatorio por ID.
 */
export const deleteReminder = async (id) => {
    try {
        await api.delete(`${REMINDER_URL}/${id}`);
        return true;
    } catch (error) {
        throw error;
    }
};