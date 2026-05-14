const API_URL = '/api'; 
const token = localStorage.getItem('token'); // Asegúrate que el login guarde el token aquí

// 1. Verificación de Seguridad
if (!token) {
    window.location.href = 'index.html';
}

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'auth-token': token // Este es el nombre que usas en tu middleware (req.header('auth-token'))
});

// 2. Cargar empleados al iniciar
document.addEventListener('DOMContentLoaded', cargarEmpleados);

async function cargarEmpleados() {
    try {
        const response = await fetch(`${API_URL}/empleados`, {
            headers: getHeaders()
        });
        if (response.status === 401 || response.status === 400) {
            logout(); // Si el token no es válido, fuera
            return;
        }
        const data = await response.json();
        renderTable(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

// 3. Buscar por nombre (Requisito de la rúbrica)
async function buscarEmpleado() {
    const nombre = document.getElementById('searchInput').value;
    try {
        const response = await fetch(`${API_URL}/empleados/buscar?nombre=${nombre}`, {
            headers: getHeaders()
        });
        const data = await response.json();
        renderTable(data);
    } catch (error) {
        alert('Error en la búsqueda');
    }
}

// 4. Lógica de renderizado
function renderTable(empleados) {
    const tbody = document.getElementById('employeeTableBody');
    tbody.innerHTML = '';
    
    empleados.forEach(emp => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${emp.nombre}</td>
            <td>${emp.apellidos}</td>
            <td>${emp.telefono}</td>
            <td>${emp.correo}</td>
            <td>${emp.direccion}</td>
            <td>
                <button onclick="eliminarEmpleado(${emp.id})" class="btn-danger">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}