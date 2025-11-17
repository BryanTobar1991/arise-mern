import { Router } from "express";
import {
  getWorkouts,
  createWorkout,
  updateWorkout,
  deleteWorkout
} from "../controllers/workout.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

router.get("/", authMiddleware, getWorkouts);
router.post("/", authMiddleware, createWorkout);
router.put("/:id", authMiddleware, updateWorkout);
router.delete("/:id", authMiddleware, deleteWorkout);

export default router;
