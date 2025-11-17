import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    exercises: [
      {
        name: String,
        sets: Number,
        reps: Number,
        weight: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Workout", workoutSchema);
