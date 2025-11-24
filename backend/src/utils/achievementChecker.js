import User from '../models/User.js';
import Achievement from '../models/Achievement.js';
// Importamos los modelos que vamos a verificar
import Workout from '../models/Workout.js'; 
import NutritionLog from '../models/NutritionLog.js'; 

/**
 * Verifica y desbloquea logros basados en una acción específica del usuario.
 * @param {string} userId - ID del usuario.
 * @param {string} module - Módulo de la acción ('workout', 'nutrition', 'reminder').
 * @param {string} action - Acción realizada ('create', 'delete', 'update', etc.).
 */
export const checkAchievements = async (userId, module, action) => {
    try {
        const user = await User.findById(userId);
        if (!user) return;

        // 1. Encontrar logros activos que el usuario aún no tiene
        const unlockedAchievementIds = user.achievements.map(a => a.achievementId);
        const availableAchievements = await Achievement.find({
            isActive: true,
            _id: { $nin: unlockedAchievementIds }
        });
        
        if (availableAchievements.length === 0) return; // No hay logros disponibles para chequear

        let achievementsToUnlock = [];

        // 2. Iterar sobre logros disponibles y verificar criterios
        for (const achievement of availableAchievements) {
            const criteria = achievement.criteria;

            // Filtro rápido: verificar si el logro aplica al módulo y acción actual
            if (criteria.module === module && criteria.action === action) {
                
                let isUnlocked = false;

                switch (criteria.module) {
                    case 'workout':
                        // Ejemplo: Si el criterio es crear N entrenamientos (action: 'create', count: N)
                        if (criteria.action === 'create') {
                            const count = await Workout.countDocuments({ user: userId });
                            if (count >= criteria.count) {
                                isUnlocked = true;
                            }
                        }
                        break;

                    case 'nutrition':
                        // Ejemplo: Si el criterio es registrar N entradas de nutrición (action: 'log', count: N)
                         if (criteria.action === 'log') {
                            const count = await NutritionLog.countDocuments({ user: userId });
                            if (count >= criteria.count) {
                                isUnlocked = true;
                            }
                        }
                        break;
                    
                    // Puedes agregar más casos (reminder, habit_streak, etc.)
                }

                if (isUnlocked) {
                    achievementsToUnlock.push({
                        achievementId: achievement._id,
                        unlockedAt: new Date()
                    });
                }
            }
        }

        // 3. Guardar los nuevos logros si existen
        if (achievementsToUnlock.length > 0) {
            user.achievements.push(...achievementsToUnlock);
            await user.save();
            console.log(`[GAMIFICATION] User ${userId} unlocked ${achievementsToUnlock.length} new achievements.`);
            
            // Aquí podrías emitir un evento WebSocket para notificar al frontend en tiempo real.
            return achievementsToUnlock.map(a => a.achievementId); // Retorna los IDs de los logros desbloqueados
        }

    } catch (error) {
        console.error("Error checking achievements:", error);
    }
};