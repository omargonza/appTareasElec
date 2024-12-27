//Consultas SQL para la base de datos PostgreSQL.
// config/db/queries.js

import pool from './connection.js';
import  query  from './connection.js';

// Consulta para obtener todas las tareas
export const getAllTasks = async () => {
  const result = await pool.query(`
    SELECT * FROM tareasunificadas
    ORDER BY fecha DESC
  `);
  return result.rows;
};
export const addTask = async (task) => {
  console.log('Datos recibidos:', task);

  const {
      tablero,
      descripcion,
      zona,
      fecha,
      status,  // Cambié "estado" por "status" para que coincida con lo que se recibe
      start_time,  // Esto es para "hora_inicio"
      end_time,  // Esto es para "hora_fin"
      tecnicos,
      materiales,
  } = task;

  console.log('Valores para INSERT:', { tablero, descripcion, zona, fecha, status, start_time, end_time, tecnicos, materiales });

  const result = await pool.query(
      `
      INSERT INTO tareasunificadas (
          tablero, descripcion, zona, fecha, estado, hora_inicio, hora_fin, tecnicos, materiales
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
      `,
      [tablero, descripcion, zona, fecha, status, start_time, end_time, tecnicos, materiales]
  );

  return result.rows[0];
};



// Consulta para actualizar una tarea
export const  updateTask =async (id_tarea, updates)  =>{
  const { tablero, descripcion, zona, fecha, estado, hora_inicio, hora_fin, tecnicos, materiales } = updates;

  const result = await pool.query(
    `
    UPDATE tareasunificadas
    SET
      tablero = $1,
      descripcion = $2,
      zona = $3,
      estado = $4,
      fecha = $5,
      hora_inicio = $6,
      hora_fin = $7,
      tecnicos = $8,
      materiales = $9
    WHERE id_tarea = $10
    RETURNING *;
    `,
    [tablero, descripcion, zona, estado, fecha, hora_inicio, hora_fin, tecnicos, materiales, id_tarea] // Ahora estamos usando el id_tarea como filtro
  );
  return result.rows[0];
}
;
// Consulta para eliminar una tarea
export const deleteTask = async (tablero) => {
  try {
      const result = await pool.query(
          `DELETE FROM tareasunificadas WHERE tablero = $1 RETURNING *`,
          [tablero]
      );
      console.log('Tarea eliminada:', result.rows[0]);
  } catch (error) {
      console.error('Error al eliminar la tarea:', error);
  }
};


/* Exportar las consultas
export default {
  getAllTasks,
  addTask,
  updateTask,
  deleteTask,
}; 
*/

export async function addUser({ legajo, username, email, password }) {
    const query = `
        INSERT INTO usuarios (legajo, username, email, password)
        VALUES ($1, $2, $3, $4) RETURNING legajo, username, email;
    `;
    const values = [legajo, username, email, password];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export async function getUserByUsername(username) {
    const query = `
        SELECT * FROM usuarios WHERE username = $1;
    `;
    const values = [username];
    const result = await pool.query(query, values);
    return result.rows[0];
}


export async function registerUser(legajo, username, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
        INSERT INTO usuarios (legajo, username, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [legajo, username, email, hashedPassword];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export async function getTasksByTablero(tablero) {
  // Aquí deberías consultar la base de datos para obtener las tareas
  const query = 'SELECT * FROM tareas WHERE tablero = $1';
  const result = await pool.query(query, [tablero]);
  return result.rows;  // Devuelve las filas obtenidas
}
