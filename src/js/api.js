// src/js/api.js

const API_URL = 'http://localhost:3000/api/tasks';

// Obtener todas las tareas
export const getTasks = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al obtener las tareas');
    return await response.json();
  } catch (error) {
    console.error('Error en getTasks:', error);
  }
};

export const addTask = async (task) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      
      if (!response.ok) {
        const errorMessage = await response.json();  // Obtener detalles del error
        throw new Error(`Error al agregar la tarea: ${errorData.message || errorData.error}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en addTask:', error);
      alert('Hubo un problema al agregar la tarea. Intenta nuevamente.');
    }
  };
  

// Actualizar una tarea
export const updateTask = async (id, updates) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Error al actualizar la tarea');
    return await response.json();
  } catch (error) {
    console.error('Error en updateTask:', error);
  }
};

// Eliminar una tarea
export const deleteTask = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar la tarea');
    return await response.json();
  } catch (error) {
    console.error('Error en deleteTask:', error);
  }
};
