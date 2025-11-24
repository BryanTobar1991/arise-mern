import express from 'express';
import * as achievementController from '../controllers/achievement.controller.js';
// Asumo que tu middleware de autenticación se llama auth.js y exporta protect
import protect from '../middleware/auth.js';

const router = express.Router();

// 1. Obtener logros desbloqueados por el usuario actual
router.get('/', protect, achievementController.getUserAchievements);

// 2. Obtener la lista completa de logros que se pueden ganar (opcional)
router.get('/available', protect, achievementController.getAllAvailableAchievements);

export default router;