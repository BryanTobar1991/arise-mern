import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register, error: authError, loading: authLoading } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const success = await register(form.name, form.email, form.password);

      if (success){
        navigate("/login");
      }

    } catch (err) {
      console.error("Error al registrar:", err);
    } finally{
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-neutral-900 p-8 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6">Crear cuenta</h1>

        {(authError || error) && (
            <div className="mb-4 p-3 bg-red-800 text-white rounded text-sm">
                {authError || error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="name"
            type="text"
            placeholder="Nombre"
            className="w-full p-3 rounded bg-neutral-800 text-white"
            onChange={handleChange}
          />

          <input
            name="email"
            type="email"
            placeholder="Correo"
            className="w-full p-3 rounded bg-neutral-800 text-white"
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            className="w-full p-3 rounded bg-neutral-800 text-white"
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading || authLoading}
            className="w-full bg-rose-600 hover:bg-rose-700 p-3 rounded text-white font-bold"
          >
            {loading || authLoading ? "Registrando..." : "Registrarme"}
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-4">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-rose-500 underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
