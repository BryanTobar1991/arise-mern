import jwt from "jsonwebtoken";
import User from "../models/User.js";

const createAccessToken = (id) => {
    // 15 minutos: El token principal que viaja en el header 'Authorization'
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' }); 
};

const createRefreshToken = (id) => {
    // 7 días: El token de respaldo que viaja en una HttpOnly Cookie
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email ya registrado" });

    const user = await User.create({ name, email, password });

    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', 
        maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    res.status(201)
        .json({
            success: true,
            accessToken,
            id: user._id,
            name: user.name,
            email: user.email,
        });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    res.json({
        success: true,
        accessToken,
        id: user._id,
        name: user.name,
        email: user.email,
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("refreshToken", { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    }).json({ message: "Logout exitoso" });
};

export const refreshAccessToken = async (req, res) => {
    // 1. Obtener el Refresh Token de la cookie
    const refreshToken = req.cookies.refreshToken; 

    if (!refreshToken) {
        // No hay cookie de refresh token, no podemos emitir un nuevo access token
        return res.status(401).json({ message: 'Authorization required: No refresh token.' });
    }

    try {
        // 2. Verificar la validez del Refresh Token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        
        // 3. Buscar el usuario (opcional, pero buena práctica)
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(403).json({ message: 'Invalid Refresh Token payload (user not found).' });
        }
        
        // 4. Si es válido, emitir un NUEVO Access Token
        const newAccessToken = createAccessToken(user._id);

        // 5. Devolver el nuevo Access Token al cliente
        res.json({ success: true, accessToken: newAccessToken });

    } catch (error) {
        // Si el token falló la verificación (expirado, inválido)
        // Limpiamos la cookie para forzar el re-login total.
        res.clearCookie('refreshToken'); 
        console.error("Refresh Token failed:", error.message);
        return res.status(403).json({ message: 'Refresh Token expired or invalid. Please re-login.' });
    }
};