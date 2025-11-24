import User from "../models/User.js";
// IMPORTAR MODELOS NECESARIOS PARA LAS MÉTRICAS
import Workout from "../models/Workout.js";
import NutritionLog from "../models/NutritionLog.js";

/**
 * Obtiene las métricas resumidas para el Dashboard del usuario autenticado.
 * Incluye: Entrenamientos Semanales, Nutrición Diaria, Peso (si está disponible).
 * @route GET /api/users/metrics
 */
export const getUserMetrics = async (req, res) => {
    try {
        const userId = req.userId;
        const today = new Date();

        // 1. Rango Semanal (Últimos 7 días)
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);

        // 2. Rango Diario (Solo hoy)
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        // Usar Promise.all para ejecutar consultas concurrentemente (MEJORA DE RENDIMIENTO)
        const [workoutsCount, nutritionSummary, latestWeight] = await Promise.all([
            // Consulta A: Contar Entrenamientos en la última semana
            Workout.countDocuments({
                user: userId,
                date: { $gte: lastWeek }
            }),

            // Consulta B: Sumar Macros/Calorías de hoy
            NutritionLog.aggregate([
                {
                    $match: {
                        user: userId,
                        date: { $gte: startOfDay, $lt: endOfDay }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalCalories: { $sum: "$calories" },
                        totalProtein: { $sum: "$protein" },
                        totalCarbs: { $sum: "$carbs" },
                        totalFats: { $sum: "$fat" },
                    }
                }
            ]),

            // Consulta C: Obtener el peso más reciente
            // Nota: Asumiendo que el peso está en el modelo User (o se implementaría WeightLog)
            User.findById(userId).select('weight')
        ]);

        // Preparar la respuesta de Nutrición (maneja el caso de no haber logs hoy)
        const dailyNutrition = nutritionSummary.length > 0 ? nutritionSummary[0] : {
            totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFats: 0
        };

        // Construir la respuesta final
        const metrics = {
            workoutsLastWeek: workoutsCount,
            caloriesToday: Math.round(dailyNutrition.totalCalories),
            proteinToday: Math.round(dailyNutrition.totalProtein),
            carbsToday: Math.round(dailyNutrition.totalCarbs),
            fatsToday: Math.round(dailyNutrition.totalFats),
            // Asumiendo que 'weight' es un campo directo en el modelo User, sino se necesita un modelo de log.
            latestWeight: latestWeight?.weight ? `${latestWeight.weight} kg` : "N/D",
        };

        res.json(metrics);

    } catch (err) {
        console.error("Error fetching user metrics:", err);
        res.status(500).json({ error: "Error al obtener las métricas del dashboard." });
    }
};

/**
 * Obtiene los detalles del perfil del usuario autenticado.
 * @route GET /api/users/profile
 */
export const getUserProfile = async (req, res) => {
    // ... (código existente sin cambios)
    try {
        const userId = req.userId; // Obtenido del token

        const user = await User.findById(userId).select('-password -__v'); // Excluir campos sensibles

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener el perfil." });
    }
};

/**
 * Actualiza el perfil del usuario autenticado.
 * @route PUT /api/users/profile
 */
export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        // Asegúrese de que todos los campos relevantes sean desestructurados
        const { name, email, weight } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        // 1. Actualizar campos
        user.name = name || user.name;

        // **Lógica de Email Corregida y Optimizada:**
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ error: "El email ya está en uso." });
            }
            user.email = email;
        }

        // Actualizar peso
        if (weight !== undefined) {
            user.weight = weight;
        }

        // 2. Guardar (Aquí es donde se confirma el éxito)
        const updatedUser = await user.save();

        // 3. Devolver datos limpios y TODOS los campos que usa el frontend
        res.json({
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            weight: updatedUser.weight, // CRÍTICO: Asegurarse de devolver el peso
            createdAt: updatedUser.createdAt
        }); // <-- Por defecto, esto devuelve 200 OK.

    } catch (err) {
        console.error(err);
        // En caso de cualquier error (ej. validación Mongoose, timeout), devolvemos 500
        res.status(500).json({ error: "Error interno del servidor al actualizar el perfil." });
    }
};


/**
 * @desc Obtiene datos históricos agregados para gráficos (últimos 30 días).
 * @route GET /api/users/history
 * @access Private
 */
export const getHistoricalMetrics = async (req, res) => {
    try {
        const userId = req.userId;
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);

        // --- SIMULACIÓN DE DATOS HISTÓRICOS ---
        // En un entorno real, usaríamos Workout.aggregate() y NutritionLog.aggregate()
        // para obtener la suma de calorías diarias y el recuento de entrenamientos por día.

        const historicalData = [];

        // Generar 30 puntos de datos simulados
        for (let i = 0; i < 30; i++) {
            const date = new Date(thirtyDaysAgo);
            date.setDate(thirtyDaysAgo.getDate() + i);

            historicalData.push({
                date: date.toISOString().substring(0, 10), // YYYY-MM-DD
                workouts: Math.floor(Math.random() * 3), // 0, 1 o 2 entrenamientos por día
                caloriesLogged: Math.floor(Math.random() * (3500 - 1500 + 1)) + 1500, // entre 1500 y 3500
            });
        }

        res.json({
            data: historicalData,
            message: "Datos históricos simulados para 30 días."
        });

    } catch (err) {
        console.error("Error fetching historical metrics:", err);
        res.status(500).json({ error: "Error al obtener datos históricos para gráficos." });
    }
};