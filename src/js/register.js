import dotenv from 'dotenv';
dotenv.config();

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        // Obtener los valores del formulario
        const legajo = document.getElementById('legajo').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Validación de campos vacíos
        if (!legajo || !username || !email || !password) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        // Crear el objeto del usuario con los datos obtenidos
        const user = { legajo, username, email, password };

        console.log('Datos del usuario a enviar:', user);

        // Definir la URL base desde una constante
        const API_URL =  process.env.API_URL;
        console.log('URL de la API:', API_URL);  // Para verificar que se pasa correctamente

        try {
            // Enviar la solicitud al servidor con el método POST
            const response = await fetch(`${API_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });

            // Verificar si la respuesta fue exitosa
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Error desconocido al registrar el usuario');
            }

            // Si el registro es exitoso, notificar al usuario y redirigir al login
            alert('Usuario registrado exitosamente.');
            window.location.href = 'login.html'; // Redirigir al login

        } catch (error) {
            // Manejo de errores
            console.error('Error al registrar:', error);
            alert('Hubo un problema con la solicitud. ' + error.message);
        }
    });
});
