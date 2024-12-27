document.addEventListener('DOMContentLoaded', function () {
  
    async function loadTasks() {
        try {
            const response = await fetch('http://localhost:3000/api/tasks');
            if (!response.ok) {
                throw new Error('Error al obtener las tareas');
            }
            const tasks = await response.json();

            const taskTableBody = document.querySelector('#task-table tbody');
            taskTableBody.innerHTML = '';

            // Verificar si la respuesta es un array de tareas
            if (Array.isArray(tasks)) {
                tasks.forEach(task => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${task.tablero}</td>
                        <td>${task.descripcion}</td>
                        <td>${task.fecha}</td>
                        <td>${task.hora_inicio}</td>
                        <td>${task.hora_fin}</td>
                        <td>${task.estado}</td>
                        <td>${task.materiales}</td>
                        <td>${task.zona}</td>
                        <td>${task.tecnicos}</td>
                        <td><button onclick="deleteTask('${task.tablero}')">Eliminar</button></td>
                    `;
                    taskTableBody.appendChild(row);
                });
            } else {
                // Si solo se recibe una tarea, agregarla directamente
                const task = tasks;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${task.tablero}</td>
                    <td>${task.descripcion}</td>
                    <td>${task.fecha}</td>
                    <td>${task.hora_inicio}</td>
                    <td>${task.hora_fin}</td>
                    <td>${task.estado}</td>
                    <td>${task.materiales}</td>
                    <td>${task.zona}</td>
                    <td>${task.tecnicos}</td>
                    <td><button onclick="deleteTask('${task.tablero}')">Eliminar</button></td>
                `;
                taskTableBody.appendChild(row);
            }
        } catch (error) {
            console.error('Error al cargar tareas:', error);
        }
    }

    // Función para agregar nueva tarea
    const form = document.getElementById('taskForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
        
            // Obtener los valores de los campos
            const tablero = document.getElementById('tablero').value;
            const descripcion = document.getElementById('descripcion').value;
            const zona = document.getElementById('zona').value;
            const materiales = document.getElementById('materiales').value;
            const tecnicos = document.getElementById('tecnicos').value;
            const fecha = document.getElementById('fecha').value;
            const hora_inicio = document.getElementById('start_time').value;
            const hora_fin = document.getElementById('end_time').value;
            const estado = document.getElementById('status').value;

            // Validación de campos requeridos
            if (!tablero || !descripcion || !fecha || !hora_inicio || !hora_fin || !estado || !zona || !materiales || !tecnicos) {
                alert('Todos los campos son obligatorios.');
                return;
            }
        
            // Crear objeto de nueva tarea
            const newTask = { tablero, descripcion, fecha, hora_inicio, hora_fin, estado, zona, materiales, tecnicos };
        
            try {
                // Enviar solicitud para agregar la tarea
                const response = await fetch('http://localhost:3000/api/tasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newTask)
                });

                const result = await response.json();
        
                // Manejo de respuesta
                if (response.ok) {
                    alert('Tarea agregada exitosamente.');
                    loadTasks();  // Recargar la lista de tareas
                } else {
                    alert('Error al agregar la tarea: ' + (result.error || 'Desconocido.'));
                }
            } catch (error) {
                console.error('Error al agregar tarea:', error);
                alert('Hubo un problema con la solicitud.');
            }
        });

        // Inicializar carga de tareas
        loadTasks();
    } else {
        console.error("El formulario 'taskForm' no existe.");
    }
});

// Función para eliminar tarea
async function deleteTask(tablero) {
    try {
        const response = await fetch(`http://localhost:3000/api/tasks/${tablero}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Tarea eliminada exitosamente.');
            loadTasks();  // Recargar la lista de tareas
        } else {
            alert('Error al eliminar la tarea.');
        }
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        alert('Hubo un problema con la solicitud.');
    }
}
