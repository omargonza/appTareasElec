// src/js/login.js

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    const user = { username, password };

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        const result = await response.json();

        if (result.success) {
            alert('Bienvenido, ' + username);
            window.location.href = 'dashboard.html'; // Redirigir al dashboard o página principal
        } else {
            alert('Usuario o contraseña incorrectos.');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Hubo un problema con la solicitud.');
    }
});
