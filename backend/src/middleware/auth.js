import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Token requerido" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    next();
  } catch (err) {
    console.error("Error en authMiddleware:", err);
    res.status(401).json({ error: "Token inválido" });
  }
}
