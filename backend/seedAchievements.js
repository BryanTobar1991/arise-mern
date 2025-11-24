import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Achievement from './src/models/Achievement.js';
import { connectDB } from './src/config/db.js';
dotenv.config();


const achievementsData = [
    {
        name: 'Primer Paso',
        description: 'Completa tu primer registro de entrenamiento.',
        icon: '👟',
        criteria: { 
            module: 'workout', 
            action: 'create', 
            count: 1 
        }
    },
    {
        name: 'Dedicación Semanal',
        description: 'Registra un total de 5 entradas de nutrición.',
        icon: '🍎',
        criteria: { 
            module: 'nutrition', 
            action: 'log', 
            count: 5 
        }
    },
    {
        name: 'Iniciativa',
        description: 'Registra tu primer recordatorio.',
        icon: '🔔',
        criteria: { 
            module: 'reminder', 
            action: 'create', 
            count: 1 
        }
    },
];

const seedAchievements = async () => {
    try {
        const MONGO_URI = process.env.MONGODB_URI;

        if (!MONGO_URI) {
            console.error("❌ ERROR: MONGODB_URI no definida en el archivo .env.");
            // Salimos del proceso si no hay URI
            process.exit(1);
        }

        // Conectar a la DB
        await connectDB(MONGO_URI);

        console.log('--- Conectado a MongoDB ---');

        // Opcional: Eliminar logros existentes para evitar duplicados en cada ejecución
        await Achievement.deleteMany({});
        console.log('Logros existentes eliminados.');

        // Insertar los nuevos logros
        await Achievement.insertMany(achievementsData);
        console.log(`✅ ${achievementsData.length} logros insertados exitosamente.`);

        // Desconectar
        mongoose.connection.close();
        process.exit();

    } catch (error) {
        console.error(`❌ ERROR en el proceso de Seed: ${error.message}`);
        process.exit(1);
    }
};

seedAchievements();