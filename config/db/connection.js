// src/config/db/connection.js// src/config/db/connection.js

import pg from 'pg';

import dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env
dotenv.config();


// Imprimir las variables de entorno para verificar su carga
console.log('user:', process.env.DB_USER);
console.log('host:', process.env.DB_HOST);
console.log('database:', process.env.DB_NAME);
console.log('password:', process.env.DB_PASSWORD);
console.log('port:', process.env.DB_PORT);

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});





// Exportar el pool para que pueda ser utilizado en otros archivos
export default pool;




if (process.env.NODE_ENV === 'development') {
    (async () => {
      try {
        const client = await pool.connect();
        console.log('Conexión exitosa a la base de datos');
        client.release();
      } catch (error) {
        console.error('Error al conectar a la base de datos:', error.message);
      }
    })();
  }
  