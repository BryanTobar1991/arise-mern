import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import workoutRoutes from "./routes/workout.routes.js";
import achievementRoutes from './routes/achievement.routes.js';
import userRoutes from './routes/user.routes.js';
import nutritionRoutes from './routes/nutrition.routes.js'; 
import reminderRoutes from './routes/reminder.routes.js';
import notificationRoutes from './routes/notification.routes.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);



app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/nutrition', nutritionRoutes); 
app.use('/api/reminders', reminderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log("🚀 Servidor en http://localhost:" + PORT);
  await connectDB(process.env.MONGODB_URI);
});
