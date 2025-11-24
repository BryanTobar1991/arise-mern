import Workout from "../models/Workout.js";
import { checkAchievements } from "../utils/achievementChecker.js";
import { suggestNextWorkout } from "../utils/aiSuggestionService.js";

export const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener entrenamientos" });
  }
};

export const createWorkout = async (req, res) => {
  try {
    const userId = req.userId;

    const workout = await Workout.create({
      userId: req.userId,
      title: req.body.title,
      description: req.body.description,
      exercises: req.body.exercises || [],
    });
    await checkAchievements(userId, 'workout', 'create');

    res.json(workout);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error al crear entrenamiento" });
  }
};

export const updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    res.json(workout);
  } catch (err) {
    res.status(500).json({ error: "Error al editar entrenamiento" });
  }
};

export const deleteWorkout = async (req, res) => {
  try {
    await Workout.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: "Entrenamiento eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar entrenamiento" });
  }
};

export const getAISuggestion = async (req, res) => {
    try {
        const userId = req.userId; // Obtenemos el ID del usuario
        // Llamamos al servicio de análisis inteligente
        const suggestion = await suggestNextWorkout(userId); 
        
        res.json({ suggestion });
    } catch (err) {
        console.error("Error al generar sugerencia de IA:", err);
        res.status(500).json({ error: "Error al generar sugerencia de IA" });
    }
};
