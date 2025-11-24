import mongoose from "mongoose";

export async function connectDB(uri) {
  try {
    if (!uri) {
        throw new Error("La URI de MongoDB no está definida para la conexión.");
    }

    await mongoose.connect(uri, { dbName: "arise" });
    console.log("✅ MongoDB conectado correctamente");
  } catch (err) {
    console.error("❌ Error conectando a MongoDB:", err.message);
    throw err;
  }
}
