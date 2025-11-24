import { Router } from "express";
import { getUserProfile, updateUserProfile } from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.js"; 

const router = Router();

// Ruta para obtener el perfil completo del usuario autenticado
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);

export default router;