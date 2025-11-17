import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";

import DashboardLayout from "./components/layout/DashboardLayout";

// IMPORTS CORREGIDOS
import Index from "./pages/Dashboard/Index";
import Workouts from "./pages/Dashboard/Workouts";
import Nutrition from "./pages/Dashboard/Nutrition";
import Reminders from "./pages/Dashboard/Reminders";
import Profile from "./pages/Dashboard/Profile";

// RUTA PROTEGIDA
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas privadas */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Index />} />
            <Route path="workouts" element={<Workouts />} />
            <Route path="nutrition" element={<Nutrition />} />
            <Route path="reminders" element={<Reminders />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Por defecto */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}
