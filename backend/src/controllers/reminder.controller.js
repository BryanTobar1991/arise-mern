import Reminder from "../models/Reminder.js";

export async function createReminder(req, res) {
  try {
    const reminder = await Reminder.create(req.body);
    res.status(201).json(reminder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getUpcomingByUser(req, res) {
  try {
    const { userId } = req.params;
    const now = new Date();
    const reminders = await Reminder.find({ user: userId, dueAt: { $gte: now } }).sort({ dueAt: 1 });
    res.json(reminders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function markDone(req, res) {
  try {
    const { id } = req.params;
    const updated = await Reminder.findByIdAndUpdate(id, { done: true }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
