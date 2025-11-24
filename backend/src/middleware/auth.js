import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  try {
    // 1. Buscar el token en el Header Authorization (Bearer Token)
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Access Token (Bearer) requerido" });
    }

    // 2. Extraer el token
    const token = authHeader.split(' ')[1]; // El token es la segunda parte
    // 3. Verificar el token (sigue usando el mismo secreto y lógica)
    const decoded = jwt.verify(token, process.env.JWT_SECRET); req.userId = decoded.id;

    next();
  } catch (err) {
    console.error("Error en authMiddleware:", err.message);
    // Este error 401 dispara el interceptor en el frontend
    res.status(401).json({ error: "Access Token inválido/expirado" });
  }
}