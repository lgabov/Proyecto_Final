const API_URL = '/api/employees'; 
const token = localStorage.getItem('token'); 

const userRole = localStorage.getItem('userRole');


if (userRole !== 'admin') {
    const btnAdd = document.getElementById('btnAgregarEmpleado');
    const inputSearch = document.getElementById('inputBuscarEmpleado');
    const btnSearch = document.getElementById('btnBuscar');

    if (btnAdd) btnAdd.style.display = 'none';
    if (inputSearch) inputSearch.style.display = 'none';
    if (btnSearch) btnSearch.style.display = 'none';
}

let editandoId = null;

if (!token) {
    window.location.href = 'index.html';
}

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` 
});

document.addEventListener('DOMContentLoaded', () => {
    configurarInterfazPorRol();
    ejecutarBusquedaInicial();
    configurarEnvioFormulario();
});

function configurarInterfazPorRol() {
    const btnAgregar = document.querySelector('.btn-success');
    if (userRole !== 'admin') {
        if (btnAgregar) btnAgregar.style.display = 'none'; 
    }
}

async function ejecutarBusquedaInicial() {
    try {
        const response = await fetch(API_URL, { headers: getHeaders() });
        if (response.status === 401 || response.status === 400) { 
            logout(); 
            return; 
        }
        
        const data = await response.json();
        renderizarTablaEmpleados(data);
    } catch (error) {
        console.error('Error al cargar empleados:', error);
    }
}

async function buscarEmpleado() {
    const nombre = document.getElementById('searchInput').value.trim();
    
    const url = nombre 
        ? `${API_URL}?name=${encodeURIComponent(nombre)}` 
        : API_URL;

    try {
        console.log("Buscando en URL:", url);
        const response = await fetch(url, { headers: getHeaders() });
        
        if (!response.ok) {
            throw new Error(`Error en el servidor: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(" Datos recibidos del buscador:", data);
        renderizarTablaEmpleados(data);
    } catch (error) {
        console.error('Error en la petición de búsqueda:', error);
        alert('Hubo un problema al procesar la búsqueda.');
    }
}



function renderizarTablaEmpleados(empleados) {
    const tbody = document.getElementById('employeeTableBody');
    tbody.innerHTML = '';
    
    if (!empleados || empleados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No se encontraron registros</td></tr>';
        return;
    }

    empleados.forEach(emp => {
        const tr = document.createElement('tr');

    // Validamos si es admin para meter AMBOS botones en el mismo bloque HTML
    const botonesAccionesHTML = userRole === 'admin'
        ? `<button onclick="prepararFormularioEdicion(${JSON.stringify(emp).replace(/"/g, '&quot;')})" class="btn-prim">Editar</button>
           <button onclick="deleteEmployee(${emp.idEmployee})" class="btn-danger" style="background-color: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 4px; margin-left: 5px; cursor: pointer;">Eliminar</button>`
        : `<span style="color: gray; font-style: italic;">Lectura</span>`;

    tr.innerHTML = `
        <td>${emp.username}</td>
        <td>${emp.lastname}</td>
        <td>${emp.phone}</td>
        <td>${emp.email}</td>
        <td>${emp.address}</td>
        <td>${emp.rol}</td>
        <td>${botonesAccionesHTML}</td>
    `;
    
    tbody.appendChild(tr);
});
}

function openModal() {
    if (userRole !== 'admin') {
        alert("Acceso denegado. Se requieren permisos de administrador.");
        return;
    }
    document.getElementById('employeeModal').style.display = 'block';
    document.getElementById('modalTitle').textContent = 'Nuevo Empleado';
    document.getElementById('employeeForm').reset();
    editandoId = null;
}

function closeModal() {
    document.getElementById('employeeModal').style.display = 'none';
}

function prepararFormularioEdicion(emp) {
    document.getElementById('employeeModal').style.display = 'block';
    document.getElementById('modalTitle').textContent = 'Editar Empleado';
    
    editandoId = emp.idEmployee; 
    
    document.getElementById('empUsername').value = emp.username;
    document.getElementById('empPassword').value = emp.password || ''; 
    document.getElementById('empLastname').value = emp.lastname;
    document.getElementById('empPhone').value = emp.phone;
    document.getElementById('empEmail').value = emp.email;
    document.getElementById('empAddress').value = emp.address;
    document.getElementById('empRol').value = emp.rol;
}

function configurarEnvioFormulario() {
    const form = document.getElementById('employeeForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const datosFormulario = {
            username: document.getElementById('empUsername').value.trim(),
            password: document.getElementById('empPassword').value,
            lastname: document.getElementById('empLastname').value.trim(),
            phone: document.getElementById('empPhone').value.trim(), 
            email: document.getElementById('empEmail').value.trim(),
            address: document.getElementById('empAddress').value.trim(),
            rol: document.getElementById('empRol').value.trim()
        };

        try {
            let url = API_URL;
            let method = 'POST'; 

            if (editandoId) {
                url = `${API_URL}/${editandoId}`;
                method = 'PUT'; 
            }

            const response = await fetch(url, {
                method: method,
                headers: getHeaders(),
                body: JSON.stringify(datosFormulario)
            });

            const resultado = await response.json();

            if (!response.ok) {
                throw new Error(resultado.msg || 'Hubo un problema al procesar la solicitud');
            }

            alert(resultado.msg || 'Operación realizada con éxito'); 
            closeModal();
            ejecutarBusquedaInicial(); 
            
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    });
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.location.href = 'index.html';
}

async function deleteEmployee(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar a este empleado de la base de datos?")) {
        return;
    }

    const PORT = 3000;
    const DB_HOST = 'localhost';

    try {
        const response = await fetch(`http://${DB_HOST}:${PORT}/api/employees/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        let data = {};
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        }

        if (response.ok) {
            alert(data.msg || "Empleado eliminado con éxito");
            location.reload();
        } else {
            alert(data.msg || `Error ${response.status}: No se pudo eliminar al empleado`);
        }
    } catch (error) {

        console.error("Error detallado al eliminar:", error);
        alert("Ocurrió un error al conectar con el servidor. Revisa la consola.");
    }
}
