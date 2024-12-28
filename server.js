

//import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { join } from 'path';
import express from 'express';
import { getAllTasks, addTask, updateTask, deleteTask, getTasksByTablero, getUserByUsername, addUser } from './config/db/queries.js';
import { fileURLToPath } from 'url';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';


import dotenv from 'dotenv';
dotenv.config();



// Definir __dirname manualmente para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear una instancia de Express
const server = express();
const port =  process.env.PORT || 3000;

// Usar CORS en todas las rutas
server.use(cors());

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
server.use(express.json());
server.use(bodyParser.json());

// Servir archivos estáticos
server.use(express.static(join(__dirname, 'src')));

const SECRET_KEY = process.env.SECRET_KEY;

// Rutas de la API con Express
server.post('/api/register', async (req, res) => {
    const { legajo, username, email, password } = req.body;

    console.log('Datos recibidos del cliente:', req.body);

    // Validación básica
    if (!legajo || !username || !email || !password) {
        console.log('Faltan campos obligatorios:', req.body);
        return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    try {
        // Verificar si el usuario ya existe
        const existingUser = await getUserByUsername(username);
        console.log('Verificación de usuario existente:', existingUser);

        if (existingUser) {
            console.log('El usuario ya existe:', username);
            return res.status(400).json({ success: false, message: 'El usuario ya existe' });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Contraseña encriptada:', hashedPassword);

        // Insertar usuario en la base de datos
        const newUser = await addUser({ legajo, username, email, password: hashedPassword });
        console.log('Usuario registrado con éxito:', newUser);

        res.status(201).json({ success: true, message: 'Usuario registrado con éxito', user: newUser });
    } catch (err) {
        console.error('Error al registrar usuario:', err);
        res.status(500).json({ success: false, message: 'Error al registrar usuario' });
    }
});

// Ruta de login
server.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    // Validación básica
    if (!username || !password) {
        console.log('Faltan campos obligatorios:', req.body);
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        // Buscar usuario por nombre
        const user = await getUserByUsername(username);
        console.log('Usuario encontrado:', user);
        if (!user) {
            console.log('Usuario no encontrado:', username);
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Comparar contraseñas
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Resultado de comparación de contraseña:', isPasswordValid);
        if (!isPasswordValid) {
            console.log('Contraseña incorrecta para el usuario:', username);
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Generar token (opcional)
        const token = jwt.sign({ id: user.id_usuario, username: user.username }, SECRET_KEY, {
            expiresIn: '1h',
        });
        console.log('Token generado:', token);

        // Responder con éxito
        res.status(200).json({ success: true, message: 'Inicio de sesión exitoso', token });
    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// Ruta para obtener todas las tareas
server.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await getAllTasks();
        res.json(tasks);
    } catch (err) {
        console.error('Error al obtener tareas:', err);
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
});

// Ruta para obtener tareas por nombre del tablero
server.get('/api/tasks/:tablero', async (req, res) => {
    const tablero = decodeURIComponent(req.params.tablero);
    try {
        const tasks = await getTasksByTablero(tablero);
        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ message: `No se encontraron tareas para el tablero ${tablero}` });
        }
        console.log('Tareas obtenidas:', tasks);
        res.json(tasks);
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
});

// Ruta para agregar una nueva tarea
server.post('/api/tasks', async (req, res) => {
    console.log('Datos recibidos:', req.body);
    try {
        const newTask = await addTask(req.body);
        res.json(newTask);
    } catch (err) {
        console.error('Error al agregar tarea:', err);
        res.status(500).json({ error: 'Error al agregar tarea' });
    }
});

// Ruta para actualizar una tarea existente
server.put('/api/tasks/:id', async (req, res) => {
  console.log('Datos recibidos para actualización:', req.body);

  const id = req.params.id;
  const { estado, descripcion, zona, fecha, hora_inicio, hora_fin, tecnicos, materiales } = req.body;

  if (!id) {
      return res.status(400).json({ error: 'Falta el ID de la tarea' });
  }

  try {
      const updatedTask = await updateTask(id, {
          estado,
          descripcion,
          zona,
          fecha,
          hora_inicio,
          hora_fin,
          tecnicos,
          materiales,
      });

      if (!updatedTask) {
          return res.status(404).json({ error: 'Tarea no encontrada' });
      }

      res.json(updatedTask);
  } catch (err) {
      console.error('Error al actualizar la tarea:', err);
      res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
});

// Ruta para eliminar una tarea
server.delete('/api/tasks/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const deletedTask = await deleteTask(id);
        res.json(deletedTask);
    } catch (err) {
        console.error('Error al eliminar la tarea:', err);
        res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
});

server.get('/api/tasks', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM tareasunificadas');
      console.log('Tareas obtenidas:', result.rows); // Asegúrate de que los datos se están obteniendo correctamente
      res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
      res.status(500).send('Error al obtener las tareas');
  }
});

// Ruta para obtener las tareas filtradas por tablero
server.get('/api/tasks/:tablero', async (req, res) => {
  const { tablero } = req.params;
  try {
      const result = await pool.query('SELECT * FROM tareasunificadas WHERE tablero = $1', [tablero]);
      res.json(result.rows);
  } catch (error) {
      console.error('Error al obtener las tareas filtradas', error);
      res.status(500).send('Error al obtener las tareas filtradas');
  }
});

// Ruta para eliminar una tarea (por ejemplo, por tablero)
server.delete('/api/tasks/:tablero', async (req, res) => {
  const { tablero } = req.params;
  try {
      await pool.query('DELETE FROM tareasunificadas WHERE tablero = $1', [tablero]);
      res.status(200).send('Tarea eliminada');
  } catch (error) {
      console.error('Error al eliminar la tarea', error);
      res.status(500).send('Error al eliminar la tarea');
  }
});


// Iniciar el servidor Express
server.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
});

// Configuración de Electron
/*let mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: join(__dirname, 'src/js/preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });
    mainWindow.loadFile('src/index.html');
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('get-tasks', async () => await getAllTasks());
ipcMain.handle('add-task', async (event, task) => await addTask(task));
ipcMain.handle('update-task', async (event, id, estado) => await updateTask(id, estado));
ipcMain.handle('delete-task', async (event, id) => await deleteTask(id));
*/