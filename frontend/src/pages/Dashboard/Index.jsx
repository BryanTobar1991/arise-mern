import React, { useState, useEffect } from 'react';
import ProgressCharts from "../../components/charts/ProgressCharts";
import { fetchAISuggestion } from '../../lib/suggestionService';
import { fetchUserMetrics } from '../../lib/userService'; // Importar el nuevo servicio

// Estado inicial para las métricas
const initialMetricsState = {
    workoutsLastWeek: 0,
    caloriesToday: 0,
    proteinToday: 0,
    carbsToday: 0,
    fatsToday: 0,
    latestWeight: "N/D",
    // Necesitamos datos para los gráficos. Asumimos una estructura de datos estática temporal aquí
    workoutFrequencyData: [
        { day: "Lunes", value: 0 },
        { day: "Martes", value: 0 },
        { day: "Miércoles", value: 0 },
        { day: "Jueves", value: 0 },
        { day: "Viernes", value: 0 },
        { day: "Sábado", value: 0 },
        { day: "Domingo", value: 0 },
    ] 
    // Nota: La data real de frecuencia se obtendría de un endpoint más avanzado
};

export default function Index() {
    // Estados existentes para la sugerencia IA
    const [aiSuggestion, setAiSuggestion] = useState(null);
    const [loadingSuggestion, setLoadingSuggestion] = useState(true);

    // NUEVOS ESTADOS para las métricas dinámicas
    const [metrics, setMetrics] = useState(initialMetricsState);
    const [loadingMetrics, setLoadingMetrics] = useState(true);

    // Cargar sugerencia IA (Lógica existente)
    useEffect(() => {
        const loadSuggestion = async () => {
            setLoadingSuggestion(true);
            try {
                const suggestion = await fetchAISuggestion();
                setAiSuggestion(suggestion);
            } catch (error) {
                setAiSuggestion("No pudimos obtener una recomendación en este momento.");
            } finally {
                setLoadingSuggestion(false);
            }
        };
        loadSuggestion();
    }, []);

    // NUEVO EFECTO: Cargar métricas del usuario
    useEffect(() => {
        const loadMetrics = async () => {
            setLoadingMetrics(true);
            try {
                const data = await fetchUserMetrics();
                setMetrics(prev => ({
                    ...prev,
                    workoutsLastWeek: data.workoutsLastWeek,
                    caloriesToday: data.caloriesToday,
                    proteinToday: data.proteinToday,
                    carbsToday: data.carbsToday,
                    fatsToday: data.fatsToday,
                    latestWeight: data.latestWeight,
                    // Si el backend tuviera más datos, los mapearíamos aquí
                }));
            } catch (error) {
                console.error("Failed to load dashboard metrics:", error);
            } finally {
                setLoadingMetrics(false);
            }
        };
        loadMetrics();
    }, []);
    
    // Función para calcular el porcentaje de calorías (Asume una meta de 2500 kcal para demostración)
    const calorieGoal = 2500;
    const caloriePercentage = Math.min(100, (metrics.caloriesToday / calorieGoal) * 100);

    // Función para simular el porcentaje de pasos (Asume una meta de 10000 pasos para demostración)
    const stepGoal = 10000;
    const stepsToday = 7452; // Mantener estático hasta tener integración de pasos
    const stepPercentage = Math.min(100, (stepsToday / stepGoal) * 100);
    const stepDisplay = stepsToday.toLocaleString();

    return (
        <div className="space-y-10 animate-fade">

            {/* TITULO */}
            <h1 className="text-3xl font-extrabold tracking-tight text-cyan-400">
                Tu progreso general
            </h1>

            {/* SUGERENCIA IA */}
            <div className="p-6 bg-slate-800 border border-indigo-700 rounded-2xl shadow-xl shadow-indigo-500/10">
                <h2 className="text-sm font-semibold text-indigo-400 mb-2 flex items-center gap-2">
                    🧠 Sugerencia Inteligente ARISE
                    {loadingSuggestion && <span className="text-xs text-slate-500">(Analizando...)</span>}
                </h2>
                <p className="text-lg text-white">
                    {aiSuggestion || (loadingSuggestion ? "Cargando el análisis de tus hábitos..." : "No hay sugerencias.")}
                </p>
            </div>
            
            {/* GRID DE ESTADÍSTICAS - DATOS DINÁMICOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                {/* Tarjeta 1: Entrenamientos esta semana */}
                <div className="p-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-lg hover:shadow-cyan-500/20 transition">
                    <h2 className="text-sm text-slate-400">Entrenamientos esta semana</h2>
                    <p className="text-4xl font-bold mt-2">
                        {loadingMetrics ? '...' : metrics.workoutsLastWeek}
                    </p>
                    <div className="mt-4 w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        {/* Se puede simular la barra con un porcentaje fijo por ahora */}
                        <div className="h-full bg-cyan-500 rounded-full w-[80%]"></div> 
                    </div>
                </div>

                {/* Tarjeta 2: Calorías consumidas hoy */}
                <div className="p-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-lg hover:shadow-emerald-500/20 transition">
                    <h2 className="text-sm text-slate-400">Calorías consumidas hoy</h2>
                    <p className="text-4xl font-bold mt-2">
                        {loadingMetrics ? '...' : metrics.caloriesToday.toLocaleString()}
                    </p>
                    <div className="mt-4 w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-emerald-500 rounded-full transition-all" 
                            style={{ width: `${caloriePercentage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Tarjeta 3: Peso actual */}
                <div className="p-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-lg hover:shadow-rose-500/20 transition">
                    <h2 className="text-sm text-slate-400">Peso actual</h2>
                    <p className="text-4xl font-bold mt-2">
                        {loadingMetrics ? '...' : metrics.latestWeight}
                    </p>
                    <p className="text-rose-400 text-sm mt-1">
                        {/* Esto requiere lógica de historial de peso futura */}
                        ↓ -2.8 kg (Estático)
                    </p>
                </div>

                {/* Tarjeta 4: Pasos hoy (Estático, en espera de integración) */}
                <div className="p-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-lg hover:shadow-indigo-500/20 transition">
                    <h2 className="text-sm text-slate-400">Pasos hoy</h2>
                    <p className="text-4xl font-bold mt-2">
                        {stepDisplay}
                    </p>
                    <div className="mt-4 w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-indigo-500 rounded-full transition-all"
                            style={{ width: `${stepPercentage}%` }}
                        ></div>
                    </div>
                </div>

            </div>

            {/* BLOQUES DE PROGRESO */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                {/* Entrenamientos (Mapeo estático a dinámico) */}
                <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-2xl shadow-xl">
                    <h2 className="text-xl font-bold text-white mb-4">
                        Frecuencia de entrenamientos
                    </h2>

                    {/* USANDO DATA ESTÁTICA TEMPORAL DENTRO DEL STATE */}
                    <div className="space-y-3">
                        {metrics.workoutFrequencyData.map((d) => (
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

                {/* Nutrición (Mapeo estático a dinámico) */}
                <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-2xl shadow-xl">
                    <h2 className="text-xl font-bold text-white mb-4">
                        Consumo de macronutrientes hoy
                    </h2>

                    <div className="grid grid-cols-3 gap-6 text-center">
                        {/* Proteínas */}
                        <div>
                            <p className="text-3xl font-bold text-rose-400">
                                {loadingMetrics ? '...' : `${metrics.proteinToday}g`}
                            </p>
                            <p className="text-sm text-slate-400">Proteínas</p>
                        </div>
                        {/* Carbohidratos */}
                        <div>
                            <p className="text-3xl font-bold text-cyan-400">
                                {loadingMetrics ? '...' : `${metrics.carbsToday}g`}
                            </p>
                            <p className="text-sm text-slate-400">Carbohidratos</p>
                        </div>
                        {/* Grasas */}
                        <div>
                            <p className="text-3xl font-bold text-amber-400">
                                {loadingMetrics ? '...' : `${metrics.fatsToday}g`}
                            </p>
                            <p className="text-sm text-slate-400">Grasas</p>
                        </div>
                    </div>
                </div>

            </div>

            {/* GRAFICAS PROFESIONALES */}
            <div className="pt-6">
                {/* Asumimos que ProgressCharts internamente manejará su propia carga de datos complejos o usará los props si se los pasamos */}
                <ProgressCharts /> 
            </div>

        </div>
    );
}