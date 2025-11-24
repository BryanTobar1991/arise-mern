import { Router } from "express";
import { getNotifications } from "../controllers/notification.controller.js";
import authMiddleware from "../middleware/auth.js"; 

const router = Router();

// Ruta para obtener el feed consolidado de notificaciones
// Ruta: /api/notifications
router.get("/", authMiddleware, getNotifications);

export default router;