import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);

      console.log("Usuario creado:", res.data);

      // 👇 REDIRECCIÓN CORRECTA
      navigate("/login");

    } catch (error) {
      console.error("Error al registrar:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Error al registrar");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-neutral-900 p-8 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6">Crear cuenta</h1>

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
            className="w-full bg-rose-600 hover:bg-rose-700 p-3 rounded text-white font-bold"
          >
            Registrarme
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
