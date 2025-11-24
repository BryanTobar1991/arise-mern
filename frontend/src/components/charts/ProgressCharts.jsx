import React, { useState, useEffect } from 'react';
import { fetchHistoricalMetrics } from '../../lib/userService';
import { 
    ResponsiveContainer, 
    AreaChart, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend,
    Area
} from 'recharts';

// Componente para formatear la fecha en el eje X
const CustomXAxisTick = ({ x, y, payload }) => {
    // Mostrar solo las etiquetas cada 7 días para no saturar
    const date = new Date(payload.value);
    if (date.getDate() % 7 === 1) {
        return (
            <g transform={`translate(${x},${y})`}>
                <text x={0} y={0} dy={16} textAnchor="middle" fill="#94a3b8" className="text-xs">
                    {date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                </text>
            </g>
        );
    }
    return null;
};


export default function ProgressCharts() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHistory = async () => {
            setLoading(true);
            const data = await fetchHistoricalMetrics();
            setHistory(data);
            setLoading(false);
        };
        loadHistory();
    }, []);

    if (loading) {
        return <div className="p-10 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400">Cargando historial de progreso...</div>;
    }

    if (history.length === 0) {
        return <div className="p-10 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400">No hay datos históricos para mostrar los gráficos.</div>;
    }

    return (
        <div className="space-y-10">
            
            {/* Gráfico 1: Tendencia de Entrenamientos */}
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl shadow-xl">
                <h2 className="text-xl font-bold text-white mb-6">
                    Entrenamientos Registrados (30 días)
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={history} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                        <defs>
                            <linearGradient id="colorWorkouts" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis 
                            dataKey="date" 
                            stroke="#475569" 
                            tick={CustomXAxisTick} 
                            height={40} 
                            interval="preserveStartEnd"
                        />
                        <YAxis stroke="#475569" tickFormatter={(value) => `${value}`} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} 
                            labelStyle={{ color: '#06b6d4' }}
                            formatter={(value) => [`${value} entrenamientos`, 'Día']}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="workouts" 
                            stroke="#06b6d4" 
                            fillOpacity={1} 
                            fill="url(#colorWorkouts)" 
                            name="Entrenamientos"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Gráfico 2: Calorías Logradas */}
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl shadow-xl">
                <h2 className="text-xl font-bold text-white mb-6">
                    Calorías Consumidas (30 días)
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={history} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                        <defs>
                            <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis 
                            dataKey="date" 
                            stroke="#475569" 
                            tick={CustomXAxisTick} 
                            height={40} 
                            interval="preserveStartEnd"
                        />
                        <YAxis stroke="#475569" tickFormatter={(value) => `${value} kcal`} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} 
                            labelStyle={{ color: '#10b981' }}
                            formatter={(value) => [`${value} kcal`, 'Día']}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="caloriesLogged" 
                            stroke="#10b981" 
                            fillOpacity={1} 
                            fill="url(#colorCalories)" 
                            name="Calorías Logradas"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
}