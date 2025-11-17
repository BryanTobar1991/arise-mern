import NutritionLog from "../models/NutritionLog.js";

export async function createLog(req, res) {
  try {
    const log = await NutritionLog.create(req.body);
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getLogsByUser(req, res) {
  try {
    const { userId } = req.params;
    const logs = await NutritionLog.find({ user: userId }).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateLog(req, res) {
  try {
    const { id } = req.params;
    const updated = await NutritionLog.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteLog(req, res) {
  try {
    const { id } = req.params;
    await NutritionLog.findByIdAndDelete(id);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
