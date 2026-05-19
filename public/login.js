document.getElementById('formLogin').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameInput,
                password: passwordInput
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Guardamos el token en el navegador
            localStorage.setItem('token', data.token);
            
            alert('¡Login exitoso!');
            
            // Redirigimos a la pantalla de empleados
            window.location.href = '/dashboard.html'; 
        } else {
            alert(data.msg || 'Error al iniciar sesión');
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        alert('No se pudo conectar con el servidor');
    }
});

