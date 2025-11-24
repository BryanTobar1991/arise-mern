import api from './axios'; // Importa tu instancia configurada de Axios

const SUGGESTION_URL = '/workouts/suggestion/ai';

/**
 * Obtiene una sugerencia de entrenamiento basada en los hábitos recientes del usuario.
 * @returns {Promise<string>} Mensaje de sugerencia de IA.
 */
export const fetchAISuggestion = async () => {
    try {
        const response = await api.get(SUGGESTION_URL);
        // El backend devuelve { suggestion: "mensaje..." }
        return response.data.suggestion; 
    } catch (error) {
        console.error("Error fetching AI suggestion:", error);
        // Devolver un mensaje de fallback amigable
        return "No fue posible generar una sugerencia personalizada en este momento.";
    }
};