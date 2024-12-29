// src/js/login.js
console.log(document.getElementById('login-form'));
console.log(document.getElementById('username'));
console.log(document.getElementById('password'));

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!username || !password) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        const user = { username, password };

        const API_URL = 'https://apptareaselec.onrender.com';

        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });

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

console.log('Estado del servidor:', response.status);
console.log('Respuesta:', await response.text());