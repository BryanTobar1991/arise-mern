import User from "../models/User.js";

/**
 * Obtiene los detalles del perfil del usuario autenticado.
 * @route GET /api/users/profile
 */
export const getUserProfile = async (req, res) => {
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
        const { name, email, /* añadir campos de perfil como weight, goals */ } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        // 1. Actualizar campos
        user.name = name || user.name;
        // La actualización de email requiere más validación (ej: unique) y es más compleja, 
        // pero por simplicidad, la incluimos si se envía:
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ error: "El email ya está en uso." });
            }
            user.email = email;
        }

        // 2. Guardar
        const updatedUser = await user.save();

        // 3. Devolver datos limpios
        res.json({
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            createdAt: updatedUser.createdAt
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al actualizar el perfil." });
    }
};