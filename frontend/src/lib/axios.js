import axios from "axios";

// ------------------------------------------------------------------
// 1. INSTANCIA BASE CONFIGURADA
// ------------------------------------------------------------------
const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
    // Intentamos cargar el Access Token inicial desde el almacenamiento local si existe
    headers: {
        'Authorization': localStorage.getItem('accessToken') 
            ? `Bearer ${localStorage.getItem('accessToken')}`
            : undefined // Usar undefined o null si no hay token
    }
});

// ------------------------------------------------------------------
// 2. LÓGICA DE COLA DE REFRESH Y CALLBACK DE LOGOUT
// ------------------------------------------------------------------

let isRefreshing = false;
let failedQueue = [];

// Función para procesar todas las solicitudes que fallaron mientras refrescábamos
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Variable global para almacenar la función de logout que viene del AuthContext
let onLogoutCallback = () => {}; 

// Función para inyectar la función de logout desde el AuthContext
export const setOnLogout = (callback) => {
    onLogoutCallback = callback;
};

// ------------------------------------------------------------------
// 3. INTERCEPTOR DE RESPUESTA
// ------------------------------------------------------------------
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Verificamos si es un error 401 y si no estamos ya en un intento de reintento
        if (error.response?.status === 401 && !originalRequest._retry) {
            
            // Si el error 401 es de la ruta de refresh (significa que el refresh token falló),
            // forzamos el logout sin intentar refrescar de nuevo.
            if (originalRequest.url.endsWith('/auth/refresh')) {
                 onLogoutCallback(); // Llama al logout del Context
                 return Promise.reject(error);
            }
            
            // Si otra petición ya está refrescando, encolamos la actual
            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                .then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return api(originalRequest);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Llamar al endpoint de refresh
                const response = await api.get('/auth/refresh'); 
                const { accessToken } = response.data;

                // Actualizar token local y el header por defecto para futuras peticiones
                localStorage.setItem('accessToken', accessToken); 
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                
                isRefreshing = false;
                processQueue(null, accessToken); // Desbloquear la cola

                // Reintentar la solicitud original
                return api(originalRequest);
                
            } catch (refreshError) {
                // El refresh token falló (expirado/inválido en el backend)
                isRefreshing = false;
                processQueue(refreshError, null);
                
                onLogoutCallback(); // Forzar el logout global de la aplicación
                
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default api; // Aseguramos la exportación de la instancia