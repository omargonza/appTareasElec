// src/routes/tasks.js

import { Router } from 'express';
const router = Router();
import { getAllTasks, getTaskById, addTask, updateTask, deleteTask } from '../../config/db/queries.js'; // Importamos las consultas

// Obtener todas las tareas
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await getAllTasks();
    res.json(tasks);
  } catch (error) {
    console.error('Error al obtener todas las tareas:', error);
    res.status(500).send('Error al obtener las tareas.');
  }
});

// Obtener una tarea específica por ID
router.get('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const task = await getTaskById(id);
    if (!task) {
      return res.status(404).send('Tarea no encontrada.');
    }
    res.json(task);
  } catch (error) {
    console.error(`Error al obtener la tarea con ID ${id}:`, error);
    res.status(500).send('Error al obtener la tarea.');
  }
});

// Agregar una nueva tarea
router.post('/tasks', async (req, res) => {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        console.error('Error: No se recibió el cuerpo de la solicitud.');
        return res.status(400).send('No se recibió el cuerpo de la solicitud.');
      }
  
      console.log('Cuerpo de la solicitud recibido:', req.body);
  
      // Llamada a la función para agregar la tarea
      const newTask = await addTask(req.body);
  
      console.log('Tarea agregada correctamente:', newTask);
  
      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error al agregar una nueva tarea:', error); // Captura el error completo
      res.status(500).send(`Error al agregar la tarea. Detalles del error: ${error.message || error}`);
    }
  });
  

// Actualizar una tarea existente
router.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedTask = await updateTask(id, req.body);
    if (!updatedTask) {
      return res.status(404).send('Tarea no encontrada.');
    }
    res.json(updatedTask);
  } catch (error) {
    console.error(`Error al actualizar la tarea con ID ${id}:`, error);
    res.status(500).send('Error al actualizar la tarea.');
  }
});

// Eliminar una tarea
router.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTask = await deleteTask(id);
    if (!deletedTask) {
      return res.status(404).send('Tarea no encontrada.');
    }
    res.json(deletedTask);
  } catch (error) {
    console.error(`Error al eliminar la tarea con ID ${id}:`, error);
    res.status(500).send('Error al eliminar la tarea.');
  }
  // Ruta para obtener todas las tareas de un tablero específico
router.get('/api/tasks/:id_tablero', async (req, res) => {
  const { id_tablero } = req.params;  // Obtener el id del tablero desde la URL
  try {
      // Obtener las tareas de ese tablero
      const tasks = await getTasksByTablero(id_tablero);  // Asume que tienes una función que obtiene tareas por tablero
      console.log('Tareas obtenidas:', tasks);  // Verifica las tareas que se están devolviendo
      res.json(tasks);
  } catch (error) {
      console.error('Error al obtener tareas:', error);
      res.status(500).send('Error al obtener las tareas');
  }
});

});

export default router;
