import { Router } from "express";
import { 
    createReminder, 
    deleteReminder,
    getUpcomingByUser, 
    markDone } 
from "../controllers/reminder.controller.js";

import authMiddleware from "../middleware/auth.js";

const router = Router();

router.post("/", authMiddleware, createReminder);
router.get("/", authMiddleware, getUpcomingByUser);
router.patch("/:id/done", authMiddleware, markDone);
router.delete("/:id", authMiddleware, deleteReminder);

export default router;
