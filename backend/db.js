// db.js
// Trabajo realizado por Javier Adrian Pedraza Garcia

const { Pool } = require('pg'); // <-- Importa Pool en lugar de Client

// Datos de conexión con Supabase
const pool = new Pool({ // <-- Crea una instancia de Pool
    host: 'aws-0-us-west-1.pooler.supabase.com',
    port: 5432,
    user: 'postgres.qoikvqxwrymvwgppitco',
    password: 'ProyectoBD2025.',
    database: 'postgres',
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect((err, client, done) => {
    if (err) {
        console.error('Error al conectar con la base de datos desde el pool:', err);
    } else {
        console.log('Conectado con la base de datos (Pool listo)');
    }
    if (client) {
        done(); // Libera el cliente al pool inmediatamente después de la prueba
    }
});

module.exports = pool; 