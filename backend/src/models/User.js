import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },

    // NUEVO CAMPO: Peso
    weight: {
      type: Number,
      min: 30, // Peso mínimo razonable
      max: 500, // Peso máximo razonable
      default: null, // Si no se establece, es nulo (no registrado)
      required: false
    },

    achievements: [
      {
        achievementId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Achievement',
        },
        // Momento en que se desbloqueó el logro
        unlockedAt: {
          type: Date,
          default: Date.now,
        }
      }
    ],

  },

  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);

