import NutritionLog from "../models/NutritionLog.js";
import { checkAchievements } from "../utils/achievementChecker.js";

export async function createLog(req, res) {
  try {
    const userId = req.userId;
    const log = await NutritionLog.create({
      ...req.body,
      // **IMPORTANTE:** Debes asegurarte de que el registro se asocie al usuario
      user: userId
    });
    await checkAchievements(userId, 'nutrition', 'log');

    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getLogsByUser(req, res) {
  try {
    const userId = req.userId; // Usamos el ID del token para seguridad
    // Buscar logs asociados a ese usuario
    const logs = await NutritionLog.find({ user: userId }).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateLog(req, res) {
  try {
    // Proteger la edición: solo puede editar su propio log
    const userId = req.userId;
    const { id } = req.params; const updated = await NutritionLog.findOneAndUpdate(
      { _id: id, user: userId }, // Verificar ID del log Y ID del usuario
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Registro no encontrado o no autorizado." });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteLog(req, res) {
  try {
    // Proteger la eliminación: solo puede eliminar su propio log
    const userId = req.userId;
    const { id } = req.params;
    const deleted = await NutritionLog.findOneAndDelete({ _id: id, user: userId });

    if (!deleted) {
      return res.status(404).json({ error: "Registro no encontrado o no autorizado." });
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
