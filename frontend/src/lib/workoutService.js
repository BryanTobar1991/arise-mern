import api from './axios'; // Tu instancia configurada

const WORKOUT_URL = '/workouts';

/**
 * Obtiene todos los entrenamientos del usuario.
 */
export const fetchWorkouts = async () => {
    try {
        const response = await api.get(WORKOUT_URL);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Crea un nuevo registro de entrenamiento.
 * @param {object} data - Datos del entrenamiento (title, description, exercises, etc.).
 */
export const createWorkout = async (data) => {
    try {
        const response = await api.post(WORKOUT_URL, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Elimina un registro de entrenamiento.
 * @param {string} id - ID del entrenamiento a eliminar.
 */
export const deleteWorkout = async (id) => {
    try {
        await api.delete(`${WORKOUT_URL}/${id}`);
        return true;
    } catch (error) {
        throw error;
    }
};

export const updateWorkout = async (id, data) => {
    try {
        const response = await api.put(`${WORKOUT_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};