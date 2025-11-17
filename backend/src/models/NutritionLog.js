import mongoose from "mongoose";

const nutritionLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    calories: { type: Number, required: true },
    protein:  { type: Number, required: true }, // g
    carbs:    { type: Number, required: true }, // g
    fats:     { type: Number, required: true }, // g
    notes: String
  },
  { timestamps: true }
);

export default mongoose.model("NutritionLog", nutritionLogSchema);
