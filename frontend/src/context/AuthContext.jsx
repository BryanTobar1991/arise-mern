import { createContext, useContext, useState, useEffect } from "react";
import api, { setOnLogout } from '../lib/axios.js';

const AuthContext = createContext(null);

const setAuthHeader = (token) => {
    if (token) {
        // Establecer el token en el header por defecto para todas las peticiones
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('accessToken', token);
    } else {
        // Eliminar el token de todas partes
        delete api.defaults.headers.common['Authorization'];
        localStorage.removeItem('accessToken');
    }
};

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("arise_user");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/auth/login', { email, password });
            const { accessToken, id, name, email: userEmail } = response.data;
            
            // 1. Guardar y configurar Access Token
            setAuthHeader(accessToken);
            
            // 2. Guardar datos de usuario (sin token, ya que expira rápido)
            const userData = { id, name, email: userEmail };
            setUser(userData);
            localStorage.setItem("arise_user", JSON.stringify(userData));
            
            setLoading(false);
            return true; // Éxito
        } catch (err) {
            setError(err.response?.data?.error || 'Error de inicio de sesión');
            setLoading(false);
            return false; // Fallo
        }
    };

  const logout = async () => {
        // Lógica de limpieza en el backend (elimina la cookie refreshToken)
        try {
            await api.post('/auth/logout');
        } catch (err) {
            console.error("Logout backend error:", err);
        } finally {
            setUser(null);
            localStorage.removeItem("arise_user");
            setAuthHeader(null);

        }
    };

    useEffect(() => {
        // A. Hidratar el Access Token en el header al cargar la aplicación
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
            // Esto solo pone el token en el header de Axios, 
            // no lo valida, asumimos que el interceptor lo validará en la primera petición protegida
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }

        // B. Conectar la función de logout al interceptor de Axios
        // Esto permite que el interceptor fuerce el logout si el Refresh Token falla.
        setOnLogout(logout);

        // C. (Opcional) Implementar un endpoint GET /auth/validate para verificar la validez 
        //    del Access Token y Refresh Token al inicio, si no quieres depender de 
        //    que la primera petición protegida falle. Por ahora, lo omitimos para simplicidad.
    }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
    // Aseguramos que se use dentro del proveedor
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
