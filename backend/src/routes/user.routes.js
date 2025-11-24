import { Router } from "express";
// Importar la nueva función del controlador
import { getUserProfile, updateUserProfile, getUserMetrics, getHistoricalMetrics } from "../controllers/user.controller.js"; 
import authMiddleware from "../middleware/auth.js"; 

const router = Router();

// Ruta para obtener las métricas resumidas del dashboard
// Nueva ruta: /api/users/metrics
router.get("/metrics", authMiddleware, getUserMetrics); // RUTA AÑADIDA

// Ruta para obtener el perfil completo del usuario autenticado
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);
router.get("/history", authMiddleware, getHistoricalMetrics);

export default router;