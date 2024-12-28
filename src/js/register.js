
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const legajo = document.getElementById('legajo').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Validación simple de campos
        if (!legajo || !username || !email || !password) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        const user = { legajo, username, email, password };

        console.log('Datos del usuario a enviar:', user);
         // Definir la URL base desde una variable o constante
         const API_URL =  'https://apptareaselec.onrender.com';


        try {
           // const response = await fetch('http://localhost:3000/api/register', {
            const response = await fetch(`${API_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Error desconocido al registrar el usuario');
            }

            alert('Usuario registrado exitosamente.');
            window.location.href = 'login.html'; // Redirigir al login

        } catch (error) {
            console.error('Error al registrar:', error);
            alert('Hubo un problema con la solicitud. ' + error.message);
        }
    });
});
