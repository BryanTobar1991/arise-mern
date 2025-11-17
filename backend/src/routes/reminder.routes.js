import { Router } from "express";
import { createReminder, getUpcomingByUser, markDone } from "../controllers/reminder.controller.js";
const router = Router();

router.post("/", createReminder);
router.get("/user/:userId/upcoming", getUpcomingByUser);
router.patch("/:id/done", markDone);

export default router;
