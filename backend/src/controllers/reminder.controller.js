import Reminder from "../models/Reminder.js";
import { checkAchievements } from "../utils/achievementChecker.js";

// Función de ayuda para la validación de recurrencia (opcional pero robusta)
const RECURRENCE_TYPES = ['never', 'daily', 'weekly', 'monthly'];

export async function createReminder(req, res) {
  try {
    const userId = req.userId; // ID del usuario autenticado

    // Desestructurar explícitamente los campos esperados, incluyendo 'recurrence'
    const { title, description, dueAt, recurrence } = req.body;

    // Validación básica
    if (!title || !dueAt) {
      return res.status(400).json({ error: "El título y la fecha/hora de vencimiento son obligatorios." });
    }

    // Validación extra para la recurrencia (aunque Mongoose ya lo hace con enum)
    if (recurrence && !RECURRENCE_TYPES.includes(recurrence)) {
      return res.status(400).json({ error: "Tipo de recurrencia no válido." });
    }

    // Crear el recordatorio, pasando solo los campos desestructurados y el user ID
    const reminder = await Reminder.create({
      title,
      description,
      dueAt,
      recurrence: recurrence || 'never', // Usar el valor o el default
      user: userId // Asociar al usuario autenticado
    });

    // >> INTEGRACIÓN DE GAMIFICACIÓN <<
    // Verifica si se desbloquea el logro "Iniciativa"
    await checkAchievements(userId, 'reminder', 'create');

    res.status(201).json(reminder);
  } catch (err) {
    // Si Mongoose falla la validación de 'enum', el error se captura aquí
    res.status(400).json({ error: err.message });
  }
}

export async function getUpcomingByUser(req, res) {
  try {
    const userId = req.userId;
    const now = new Date();
    // NOTA: Los recordatorios recurrentes también se listarán aquí, pero se mostrarán
    // con la fecha original (dueAt). Una mejora futura implicaría generar las próximas
    // instancias de los recurrentes en el frontend o con un servicio.
    const reminders = await Reminder.find({ user: userId, dueAt: { $gte: now } }).sort({ dueAt: 1 });
    res.json(reminders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function markDone(req, res) {
  try {
    // ... (código sin cambios)
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
    // ... (código sin cambios)
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