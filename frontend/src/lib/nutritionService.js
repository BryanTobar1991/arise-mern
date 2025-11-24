// frontend/src/lib/nutritionService.js

import api from './axios'; // Tu instancia configurada

const NUTRITION_URL = '/nutrition'; // Asumo que tu backend usa /api/nutrition

/**
 * Obtiene todos los registros de nutrición del usuario autenticado.
 */
export const fetchNutritionLogs = async () => {
    try {
        // Asumo que tienes una ruta GET /api/nutrition/user o similar. 
        // Si tu backend usa la ruta /nutrition/:userId, esto debe ajustarse. 
        // Por convención, usaremos una ruta que sepa leer el userId del token.
        const response = await api.get(NUTRITION_URL); 
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Crea un nuevo registro de nutrición.
 * @param {object} data - Datos del log (date, calories, protein, carbs, fats, notes).
 */
export const createNutritionLog = async (data) => {
    try {
        const response = await api.post(NUTRITION_URL, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Elimina un registro de nutrición por ID.
 * @param {string} id - ID del log a eliminar.
 */
export const deleteNutritionLog = async (id) => {
    try {
        await api.delete(`${NUTRITION_URL}/${id}`);
        return true;
    } catch (error) {
        throw error;
    }
};