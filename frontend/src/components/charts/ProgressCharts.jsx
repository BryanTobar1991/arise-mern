import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function ProgressCharts() {
  // Datos de ejemplo
  const weightData = [
    { day: "Lun", weight: 106 },
    { day: "Mar", weight: 105.4 },
    { day: "Mié", weight: 105 },
    { day: "Jue", weight: 104.8 },
    { day: "Vie", weight: 104.5 },
    { day: "Sáb", weight: 104.3 },
    { day: "Dom", weight: 104.2 },
  ];

  const caloriesData = [
    { day: "Lun", kcal: 2200 },
    { day: "Mar", kcal: 2000 },
    { day: "Mié", kcal: 1800 },
    { day: "Jue", kcal: 1950 },
    { day: "Vie", kcal: 2100 },
    { day: "Sáb", kcal: 2300 },
    { day: "Dom", kcal: 1850 },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

      {/* Progreso de peso */}
      <div className="p-8 bg-slate-900/60 rounded-2xl border border-slate-800 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4">
          Evolución del peso esta semana
        </h2>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={weightData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#06b6d4"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Calorías */}
      <div className="p-8 bg-slate-900/60 rounded-2xl border border-slate-800 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4">
          Consumo calórico semanal
        </h2>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={caloriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="kcal" fill="#f43f5e" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
