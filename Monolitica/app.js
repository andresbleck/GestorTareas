// Datos en localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentUser = null;
let editingTaskId = null;

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
        loadTasks();
        alert('Inicio de sesión exitoso');
    } else {
        alert('Credenciales incorrectas');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('taskSection').style.display = 'none';
}

// Verificar si hay usuario logueado al cargar la página
window.onload = () => {
    currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('taskSection').style.display = 'block';
        loadTasks();
    } else {
        document.getElementById('authSection').style.display = 'block';
        document.getElementById('taskSection').style.display = 'none';
    }
};

// Funciones de tareas
function addTask() {
    const taskText = document.getElementById('newTask').value;
    const taskDateTime = document.getElementById('taskDateTime').value;
    
    if (!taskText.trim()) {
        alert('La descripción de la tarea es requerida');
        return;
    }
    
    tasks.push({
        id: Date.now(),
        text: taskText,
        datetime: taskDateTime,
        user: currentUser,
        completed: false
    });
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
    document.getElementById('newTask').value = '';
    document.getElementById('taskDateTime').value = '';
    loadTasks();
}

function loadTasks() {
    if (!currentUser) return;
    const userTasks = tasks.filter(t => t.user === currentUser);
    renderTasks(userTasks);
}

function renderTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        const taskDate = task.datetime ? new Date(task.datetime).toLocaleString() : 'Sin fecha';
        const buttonText = task.completed ? 'Marcar Pendiente' : 'Marcar Completada';
        const buttonClass = task.completed ? 'btn-pending' : 'btn-complete';
        const taskClass = task.completed ? 'task-completed' : '';
        
        if (editingTaskId === task.id) {
            li.innerHTML = `
                <div class="edit-task-content">
                    <input type="text" id="edit-text-${task.id}" value="${escapeHtml(task.text)}" class="input-field">
                    <input type="datetime-local" id="edit-date-${task.id}" value="${task.datetime || ''}" class="input-field">
                </div>
                <div class="task-actions">
                    <button class="btn-edit" onclick="saveTask(${task.id})">Guardar</button>
                    <button class="btn-delete" onclick="cancelEdit()">Cancelar</button>
                </div>
            `;
        } else {
            li.innerHTML = `
                <div class="task-content ${taskClass}">
                    <span class="task-text">${escapeHtml(task.text)}</span>
                    <span class="task-date">${taskDate}</span>
                    ${!task.completed ? '<div class="task-status"><span class="status-dot status-pending"></span><span class="status-text">Pendiente</span></div>' : ''}
                </div>
                <div class="task-actions">
                    <button class="${buttonClass}" onclick="toggleTaskComplete(${task.id})">${buttonText}</button>
                    <button class="btn-edit" onclick="startEdit(${task.id})">Editar</button>
                    <button class="btn-delete" onclick="deleteTask(${task.id})">Eliminar</button>
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
    
    if (!newText) {
        alert('La descripción no puede estar vacía');
        return;
    }

    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].text = newText;
        tasks[taskIndex].datetime = newDate;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        editingTaskId = null;
        loadTasks();
    }
}

function cancelEdit() {
    editingTaskId = null;
    loadTasks();
}

function deleteTask(taskId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
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

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
