
/*document.addEventListener('DOMContentLoaded', () => {
    console.log('Archivo login.js cargado correctamente');
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!username || !password) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        const user = { username, password };


   
        const API_API_URL = process.env.API_URL

        try {
            const response = await fetch(`${API_API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });

            console.log('Estado del servidor:', response.status);
            console.log('Respuesta:', await response.text());

            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            const result = await response.json();

            if (result.success) {
                alert('Bienvenido, ' + username);
                window.location.href = 'dashboard.html';
            } else {
                alert('Usuario o contraseña incorrectos.');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('Hubo un problema con la solicitud: ' + error.message);
        }
    });
});
*/

document.addEventListener('DOMContentLoaded', () => {
    console.log('Archivo login.js cargado correctamente'); // Confirma que el script se carga

    const form = document.getElementById('login-form');
    console.log('Formulario encontrado:', form); // Verifica que el formulario exista en el DOM

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Evento submit capturado'); // Indica que el evento submit fue disparado

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        console.log('Valor de username:', username); // Verifica el valor del input username
        console.log('Valor de password:', password); // Verifica el valor del input password

        if (!username || !password) {
            console.log('Formulario incompleto'); // Mensaje si los campos están vacíos
            alert('Por favor, complete todos los campos.');
            return;
        }

        const user = { username, password };
        console.log('Datos enviados al servidor:', user); // Muestra el objeto que será enviado

      //  const API_URL = 'https://apptareaselec.onrender.com';
       // console.log('URL del API:', API_URL); // Confirma la URL usada en la solicitud

        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });

            console.log('Estado de la respuesta:', response.status); // Estado HTTP de la respuesta
            const result = await response.json();
            console.log('Respuesta del servidor:', result); // Muestra el cuerpo de la respuesta

            if (result.success) {
                console.log('Inicio de sesión exitoso'); // Si la autenticación fue exitosa
                alert('Bienvenido, ' + username);
                window.location.href = 'dashboard.html';
            } else {
                console.log('Error de autenticación'); // Si hubo un fallo en las credenciales
                alert('Usuario o contraseña incorrectos.');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error); // Manejo de errores del fetch
            alert('Hubo un problema con la solicitud: ' + error.message);
        }
    });
});
