import { Router } from "express";
import { createLog, getLogsByUser, updateLog, deleteLog } from "../controllers/nutrition.controller.js";
const router = Router();

router.post("/", createLog);
router.get("/user/:userId", getLogsByUser);
router.put("/:id", updateLog);
router.delete("/:id", deleteLog);

export default router;
