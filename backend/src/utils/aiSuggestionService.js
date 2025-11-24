// backend/src/utils/aiSuggestionService.js

import Workout from '../models/Workout.js'; 

// Tipos de entrenamiento base que buscamos balancear
const WORKOUT_TYPES = ['fuerza', 'cardio', 'flexibilidad'];

/**
 * Analiza los últimos 5 entrenamientos del usuario y sugiere un tipo de entrenamiento
 * complementario o faltante para un progreso balanceado.
 * @param {string} userId - ID del usuario.
 * @returns {Promise<string>} Mensaje de sugerencia.
 */
export const suggestNextWorkout = async (userId) => {
    try {
        const recentWorkouts = await Workout.find({ userId })
            .sort({ createdAt: -1 }) // Los más recientes primero
            .limit(5)
            .select('title description');

        if (recentWorkouts.length < 3) {
            return "Comienza tu jornada registrando al menos 3 entrenamientos para recibir sugerencias personalizadas.";
        }

        // 1. Identificar tipos de entrenamiento recientes basados en palabras clave
        const recentTypes = new Set();
        const lowerCaseWorkouts = recentWorkouts.map(w => `${w.title} ${w.description}`.toLowerCase());

        lowerCaseWorkouts.forEach(text => {
            if (text.includes('fuerza') || text.includes('pesas') || text.includes('hipertrofia') || text.includes('gym')) {
                recentTypes.add('fuerza');
            }
            if (text.includes('cardio') || text.includes('correr') || text.includes('bici') || text.includes('eliptica')) {
                recentTypes.add('cardio');
            }
            if (text.includes('yoga') || text.includes('estiramiento') || text.includes('pilates') || text.includes('movilidad')) {
                recentTypes.add('flexibilidad');
            }
        });

        // 2. Identificar tipos faltantes
        const missingTypes = WORKOUT_TYPES.filter(type => !recentTypes.has(type));

        if (missingTypes.length > 0) {
            const suggestedType = missingTypes[Math.floor(Math.random() * missingTypes.length)];
            
            // Generar sugerencia específica para la UX
            if (suggestedType === 'flexibilidad') {
                return "Tu plan ha sido intenso. Dedica 20 minutos a la **flexibilidad** o yoga hoy para mejorar tu recuperación y prevenir lesiones.";
            }
            if (suggestedType === 'cardio') {
                return `El enfoque reciente ha sido la fuerza. Incorpora una sesión de **cardio** de 30 minutos para mejorar tu resistencia.`;
            }
            if (suggestedType === 'fuerza') {
                return `Has realizado mucho cardio. ¡No olvides tu **fuerza**! Un entrenamiento de resistencia es clave para la longevidad.`;
            }
        }
        
        return "¡Tus entrenamientos están perfectamente equilibrados! Mantén el gran trabajo y el balance.";

    } catch (error) {
        console.error("Error en el servicio de sugerencia:", error);
        return "No pudimos generar una sugerencia de entrenamiento en este momento.";
    }
};