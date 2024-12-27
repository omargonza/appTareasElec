 /*import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import pkg from 'pg'; // Importar la biblioteca de PostgreSQL

// Extraer `Client` desde el paquete
const { Client } = pkg;

// Función para crear la ventana principal
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: join(process.cwd(), 'preload.js'), // Cambiar __dirname por process.cwd() en ESM
            nodeIntegration: true,
        },
    });

    // Cargar el archivo HTML
    win.loadFile('index.html');
};

// Configurar la conexión con PostgreSQL
const client = new Client({
    user: 'tu_usuario',
    host: 'localhost',
    database: 'TareasDiarias',
    password: 'tu_contraseña',
    port: 5432,
});

// Intentar conectarse a la base de datos
client
    .connect()
    .then(() => {
        console.log('Conexión exitosa a PostgreSQL');
    })
    .catch((err) => {
        console.error('Error al conectar a PostgreSQL:', err);
    });

// Eventos del ciclo de vida de la app
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        client.end(); // Cierra la conexión a la base de datos
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
*/