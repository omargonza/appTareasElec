

//import { app, BrowserWindow, ipcMain } from 'electron';
import express from 'express';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';

import {
    getAllTasks,
    addTask,
    updateTask,
    deleteTask,
    getTasksByTablero,
    getUserByUsername,
    addUser,
} from './config/db/queries.js';
 // Conexión a la base de datos

dotenv.config();

// Configuración de Express
const server = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

server.use(cors());
server.use(bodyParser.json());
server.use(express.json());
server.use(express.static(join(__dirname, 'src')));
server.use(morgan('dev'));

// Clave secreta para JWT
const SECRET_KEY = process.env.SECRET_KEY;

// Ruta: Registro de usuario
server.post('/api/register', async (req, res) => {
    const { legajo, username, email, password } = req.body;

    if (!legajo || !username || !email || !password) {
        return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    try {
        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'El usuario ya existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await addUser({ legajo, username, email, password: hashedPassword });
        res.status(201).json({ success: true, message: 'Usuario registrado con éxito', user: newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error al registrar usuario' });
    }
});

// Ruta: Login
server.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const user = await getUserByUsername(username);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user.id_usuario, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ success: true, message: 'Inicio de sesión exitoso', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Ruta: Obtener todas las tareas
server.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await getAllTasks();
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
});

// Ruta: Obtener tareas por tablero
server.get('/api/tasks/:tablero', async (req, res) => {
    try {
        const tasks = await getTasksByTablero(req.params.tablero);
        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ message: 'No se encontraron tareas para el tablero' });
        }
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
});

// Middleware de errores genéricos
server.use((err, req, res, next) => {
    console.error('Error no manejado:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar el servidor
server.listen(port, () => console.log(`API escuchando en http://localhost:${port}`));

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