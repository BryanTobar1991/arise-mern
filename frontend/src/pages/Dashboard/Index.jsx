import ProgressCharts from "../../components/charts/ProgressCharts";




export default function Index() {
  return (
    <div className="space-y-10 animate-fade">

      {/* TITULO */}
      <h1 className="text-3xl font-extrabold tracking-tight text-cyan-400">
        Tu progreso general
      </h1>

      {/* GRID DE ESTADÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* Tarjeta 1 */}
        <div className="p-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-lg hover:shadow-cyan-500/20 transition">
          <h2 className="text-sm text-slate-400">Entrenamientos esta semana</h2>
          <p className="text-4xl font-bold mt-2">4</p>
          <div className="mt-4 w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 rounded-full w-[70%]"></div>
          </div>
        </div>

        {/* Tarjeta 2 */}
        <div className="p-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-lg hover:shadow-emerald-500/20 transition">
          <h2 className="text-sm text-slate-400">Calorías consumidas hoy</h2>
          <p className="text-4xl font-bold mt-2">1,850</p>
          <div className="mt-4 w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full w-[60%]"></div>
          </div>
        </div>

        {/* Tarjeta 3 */}
        <div className="p-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-lg hover:shadow-rose-500/20 transition">
          <h2 className="text-sm text-slate-400">Peso actual</h2>
          <p className="text-4xl font-bold mt-2">104.2 kg</p>
          <p className="text-rose-400 text-sm mt-1">↓ -2.8 kg este mes</p>
        </div>

        {/* Tarjeta 4 */}
        <div className="p-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-lg hover:shadow-indigo-500/20 transition">
          <h2 className="text-sm text-slate-400">Pasos hoy</h2>
          <p className="text-4xl font-bold mt-2">7,452</p>
          <div className="mt-4 w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full w-[75%]"></div>
          </div>
        </div>

      </div>

      {/* BLOQUES DE PROGRESO */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* Entrenamientos */}
        <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-2xl shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">
            Frecuencia de entrenamientos
          </h2>

          <div className="space-y-3">
            {[
              { day: "Lunes", value: 80 },
              { day: "Martes", value: 100 },
              { day: "Jueves", value: 70 },
              { day: "Viernes", value: 90 },
              { day: "Domingo", value: 50 },
            ].map((d) => (
              <div key={d.day}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">{d.day}</span>
                  <span className="text-cyan-400">{d.value}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all"
                    style={{ width: `${d.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nutrición */}
        <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-2xl shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">
            Consumo de macronutrientes hoy
          </h2>

          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-rose-400">165g</p>
              <p className="text-sm text-slate-400">Proteínas</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-cyan-400">240g</p>
              <p className="text-sm text-slate-400">Carbohidratos</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-400">62g</p>
              <p className="text-sm text-slate-400">Grasas</p>
            </div>
          </div>
        </div>

      </div>

      {/* GRAFICAS PROFESIONALES */}
      <div className="pt-6">
        <ProgressCharts />
      </div>

    </div>
  );
}
