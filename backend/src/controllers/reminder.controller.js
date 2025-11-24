import Reminder from "../models/Reminder.js";
import { checkAchievements } from "../utils/achievementChecker.js";

export async function createReminder(req, res) {
  try {
    const userId = req.userId; // ID del usuario autenticado

    const reminder = await Reminder.create({
      ...req.body,
      user: userId // Asociar al usuario autenticado
    });

    // >> INTEGRACIÓN DE GAMIFICACIÓN <<
    // Verifica si se desbloquea el logro "Iniciativa"
    await checkAchievements(userId, 'reminder', 'create');

    res.status(201).json(reminder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getUpcomingByUser(req, res) {
  try {
    const userId = req.userId;
    const now = new Date();
    const reminders = await Reminder.find({ user: userId, dueAt: { $gte: now } }).sort({ dueAt: 1 });
    res.json(reminders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function markDone(req, res) {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const updated = await Reminder.findOneAndUpdate(
      { _id: id, user: userId },
      { done: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Recordatorio no encontrado o no autorizado." });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteReminder(req, res) {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // Asegurar que el usuario solo borre sus propios recordatorios
    const deleted = await Reminder.findOneAndDelete({ _id: id, user: userId });

    if (!deleted) {
      return res.status(404).json({ error: "Recordatorio no encontrado o no autorizado." });
    }

    res.json({ message: "Recordatorio eliminado con éxito" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
