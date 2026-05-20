const API_URL = '/api/employees'; 

const token = localStorage.getItem('token'); 

let editandoId = null;

if (!token) {
    window.location.href = 'index.html';
}

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'auth-token': token 
});

document.addEventListener('DOMContentLoaded', () => {
    ejecutarBusquedaInicial();
    configurarEnvioFormulario();
});

async function ejecutarBusquedaInicial() {
    try {
        const response = await fetch(`${API_URL}/empleados`, { headers: getHeaders() });
        if (response.status === 401 || response.status === 400) { logout(); return; }
        const data = await response.json();
        renderizarTablaEmpleados(data);
    } catch (error) {
        console.error('Error al cargar empleados:', error);
    }
}

async function buscarEmpleado() {
    const nombre = document.getElementById('searchInput').value.trim();
    
    // Ahora construirá: /api/employees?name=Gabriel o /api/employees
    const url = nombre 
        ? `${API_URL}?name=${encodeURIComponent(nombre)}` 
        : API_URL;

    try {
        const response = await fetch(url, { headers: getHeaders() });
        
        if (!response.ok) {
            throw new Error(`Error en el servidor. Código de estado: ${response.status}`);
        }
        
        const data = await response.json();
        renderizarTablaEmpleados(data);
    } catch (error) {
        console.error('DETALLE DEL ERROR EN LA PETICIÓN:', error);
        alert(`Error al realizar la búsqueda: ${error.message}`);
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
        tr.innerHTML = `
            <td>${emp.username}</td>
            <td>${emp.lastname}</td>
            <td>${emp.phone}</td>
            <td>${emp.email}</td>
            <td>${emp.address}</td>
            <td>${emp.rol}</td>
            <td>
                <button onclick="prepararFormularioEdicion(${JSON.stringify(emp).replace(/"/g, '&quot;')})" class="btn-primary" style="padding: 2px 8px; cursor: pointer;">Editar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openModal() {
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
    document.getElementById('empPassword').value = emp.password; 
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
        
        if (!editandoId) {
            alert("Acción no configurada (El modo creación está pausado).");
            return;
        }

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
            const response = await fetch(`${API_URL}/${editandoId}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(datosFormulario)
            });

            if (!response.ok) throw new Error('Error al actualizar');

            const resultado = await response.json();
            alert(resultado.msg); 
            closeModal();
            ejecutarBusquedaInicial(); 
            
        } catch (error) {
            console.error(error);
            alert('Hubo un problema al guardar los cambios');
        }
    });
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}


