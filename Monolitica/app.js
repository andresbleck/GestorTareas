// Datos en localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentUser = null;
let editingTaskId = null;
let categorias = [];
let categoriaFiltro = '';

// Funciones de autenticación
function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert('Usuario y contraseña son requeridos');
        return;
    }
    if (users.some(u => u.username === username)) {
        alert('Usuario ya existe');
        return;
    }
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registro exitoso');
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = username;
        localStorage.setItem('currentUser', currentUser);
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('taskSection').style.display = 'block';
        document.getElementById('logoutButton').style.display = 'inline-block';
        cargarCategorias();
        loadTasks();
        alert('Inicio de sesión exitoso');
    } else {
        alert('Credenciales incorrectas');
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('taskSection').style.display = 'none';
    document.getElementById('logoutButton').style.display = 'none';
}

// Funciones para tareas
function addTask() {
    const taskText = document.getElementById('newTask').value;
    const taskDateTime = document.getElementById('taskDateTime').value;
    let categoria = document.getElementById('categoriaSelect').value;
    const nuevaCategoria = document.getElementById('newCategoria').value.trim();
    if (nuevaCategoria) categoria = nuevaCategoria;
    if (!taskText.trim()) {
        alert('La descripción de la tarea es requerida');
        return;
    }
    if (!categoria) {
        alert('La categoría es obligatoria');
        return;
    }
    tasks.push({
        id: Date.now(),
        text: taskText,
        datetime: taskDateTime,
        user: currentUser,
        categoria: categoria,
        completed: false
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    document.getElementById('newTask').value = '';
    document.getElementById('taskDateTime').value = '';
    document.getElementById('categoriaSelect').value = '';
    document.getElementById('newCategoria').value = '';
    cargarCategorias();
    loadTasks();
}

function loadTasks() {
    if (!currentUser) return;
    const userTasks = tasks.filter(t => t.user === currentUser);
    renderTasks(userTasks);
}

function filtrarPorCategoria() {
    categoriaFiltro = document.getElementById('filtroCategoria').value;
    loadTasks();
}

function renderTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    if (categoriaFiltro) tasks = tasks.filter(t => t.categoria === categoriaFiltro);
    tasks.forEach(task => {
        const li = document.createElement('li');
        const taskDate = task.datetime ? new Date(task.datetime).toLocaleString() : 'Sin fecha';
        const buttonText = task.completed ? 'Pendiente' : 'Completada';
        const buttonClass = buttonText === 'Completada' ? 'btn-completed' : 'btn-pending';
        const taskClass = task.completed ? 'task-completed' : 'task-pending';
        if (editingTaskId === task.id) {
            li.innerHTML = `
                <div class="task-content ${taskClass}">
                    <div class="task-info-block">
                        <div class="task-categoria-badge">${escapeHtml(task.categoria)}</div>
                        <div class="task-main-info">
                            <input type="text" id="edit-text-${task.id}" value="${escapeHtml(task.text)}" class="input-field" style="margin-bottom:8px;max-width:220px;">
                            <input type="datetime-local" id="edit-date-${task.id}" value="${task.datetime || ''}" class="input-field" style="max-width:180px;">
                            <input type="text" id="edit-categoria-${task.id}" value="${escapeHtml(task.categoria)}" placeholder="Categoría" class="input-field" style="max-width:180px;">
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="btn-success" onclick="saveTask(${task.id})">Guardar</button>
                        <button class="btn-cancel" onclick="cancelEdit()">Cancelar</button>
                    </div>
                </div>
            `;
        } else {
            li.innerHTML = `
                <div class="task-content ${taskClass}">
                    <div class="task-info-block">
                        <div class="task-categoria-badge">${escapeHtml(task.categoria)}</div>
                        <div class="task-main-info">
                            <span class="task-text">${escapeHtml(task.text)}</span>
                            <span class="task-date">${taskDate}</span>
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="${buttonClass}" onclick="toggleTaskComplete(${task.id})">${buttonText}</button>
                        <button class="btn-edit" onclick="startEdit(${task.id})">Editar</button>
                        <button class="btn-delete" onclick="deleteTask(${task.id})">Eliminar</button>
                    </div>
                </div>
            `;
        }
        taskList.appendChild(li);
    });
}

function startEdit(taskId) {
    editingTaskId = taskId;
    loadTasks();
}

function saveTask(taskId) {
    const newText = document.getElementById(`edit-text-${taskId}`).value.trim();
    const newDate = document.getElementById(`edit-date-${taskId}`).value;
    const newCategoria = document.getElementById(`edit-categoria-${taskId}`).value.trim();
    if (!newText) {
        alert('La descripción no puede estar vacía');
        return;
    }
    if (!newCategoria) {
        alert('La categoría es obligatoria');
        return;
    }
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].text = newText;
        tasks[taskIndex].datetime = newDate;
        tasks[taskIndex].categoria = newCategoria;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        editingTaskId = null;
        cargarCategorias();
        loadTasks();
    }
}

function toggleTaskComplete(taskId) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
    }
}

function cancelEdit() {
    editingTaskId = null;
    loadTasks();
}

function deleteTask(taskId) {
    if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;
    tasks = tasks.filter(t => t.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

// Funciones auxiliares
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function cargarCategorias() {
    if (!currentUser) return;
    const userTasks = tasks.filter(t => t.user === currentUser);
    const categoriasUnicas = [...new Set(userTasks.map(t => t.categoria).filter(c => c))];
    categorias = categoriasUnicas;
    const select = document.getElementById('categoriaSelect');
    select.innerHTML = '<option value="">Seleccionar</option>' + categorias.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    const filtro = document.getElementById('filtroCategoria');
    filtro.innerHTML = '<option value="">Todas</option>' + categorias.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('currentUser')) {
        currentUser = localStorage.getItem('currentUser');
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('taskSection').style.display = 'block';
        document.getElementById('logoutButton').style.display = 'inline-block';
        cargarCategorias();
        loadTasks();
    }
});
