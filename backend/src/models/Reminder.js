import mongoose from "mongoose";

// Definición de las opciones de recurrencia permitidas
const RECURRENCE_TYPES = ['never', 'daily', 'weekly', 'monthly'];

const reminderSchema = new mongoose.Schema(
  {
    // Asociación con el usuario autenticado (CRÍTICO para seguridad y CRUD)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    dueAt: {
      type: Date,
      required: true
    },
    recurrence: {
      type: String,
      enum: RECURRENCE_TYPES,
      default: 'never'
    },

    done: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);


export default mongoose.model("Reminder", reminderSchema);