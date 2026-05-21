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
            localStorage.setItem('token', data.token);
            
            try {
                const base64Url = data.token.split('.');
                const base64 = base64Url[1].replace(/-/g, '+').replace(/_/g, '/');

                const payloadDecodificado = JSON.parse(window.atob(base64));

                localStorage.setItem('userRole', payloadDecodificado.rol || 'user');
                localStorage.setItem('username', payloadDecodificado.username || usernameInput);
            } catch (e) {
                console.error("Error al extraer el rol del token:", e);
                localStorage.setItem('userRole', 'user'); 
            }
            
            alert('¡Login exitoso!');

            window.location.href = '/dashboard.html'; 
        } else {
            alert(data.msg || 'Error al iniciar sesión');
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        alert('No se pudo conectar con el servidor');
    }
});


