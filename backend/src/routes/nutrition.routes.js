import { Router } from "express";
import { 
    createLog, 
    // Renombraremos esta función a 'getLogs' en el controlador
    getLogsByUser, 
    updateLog, 
    deleteLog 
} from "../controllers/nutrition.controller.js";
// >> IMPORTAR MIDDLEWARE DE AUTENTICACIÓN <<
import authMiddleware from "../middleware/auth.js"; 

const router = Router();

// >> NUEVA RUTA PARA OBTENER TODOS LOS LOGS DEL USUARIO AUTENTICADO <<
// Esta ruta es la que el frontend está esperando (GET /api/nutrition)
router.get("/", authMiddleware, getLogsByUser); // Usaremos getLogsByUser para esta ruta

// Rutas protegidas existentes
router.post("/", authMiddleware, createLog); // Proteger la creación
// router.get("/user/:userId", getLogsByUser); // Eliminamos esta ruta insegura
router.put("/:id", authMiddleware, updateLog); // Proteger la edición
router.delete("/:id", authMiddleware, deleteLog); // Proteger la eliminación

export default router;