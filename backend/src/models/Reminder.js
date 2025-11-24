import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    // Asociación con el usuario autenticado (CRÍTICO para seguridad y CRUD)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    // Usamos 'title' en lugar de 'message' para consistencia con UI/otros modelos
    title: {
      type: String,
      required: true,
      trim: true
    },
    // Añadir campo de descripción para detalles del recordatorio
    description: String,   // Fecha y hora de vencimiento combinadas (crucial para la programación)
    dueAt: {
      type: Date,
      required: true
    },
    // Estado de completado
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
