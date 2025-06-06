// Datos en localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentUser = null;

// Funciones de autenticación
function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
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
        document.getElementById('taskSection').style.display = 'block';
        loadTasks();
        alert('Inicio de sesión exitoso');
    } else {
        alert('Credenciales incorrectas');
    }
}

// Funciones de tareas
function addTask() {
    const taskText = document.getElementById('newTask').value;
    const taskDateTime = document.getElementById('taskDateTime').value;
    
    if (taskText.trim() === '') {
        alert('Por favor ingresa una descripción para la tarea');
        return;
    }
    
    tasks.push({
        id: Date.now(),
        text: taskText,
        datetime: taskDateTime,  // Guardamos la fecha y hora
        user: currentUser,
        completed: false
    });
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
    document.getElementById('newTask').value = '';
    document.getElementById('taskDateTime').value = '';
    loadTasks();
}

function loadTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    const userTasks = tasks.filter(t => t.user === currentUser);
    
    userTasks.forEach(task => {
        const li = document.createElement('li');
        const taskDate = task.datetime ? new Date(task.datetime).toLocaleString() : 'Sin fecha';
        
        li.innerHTML = `
            <div class="task-content">
                <span class="task-text">${task.text}</span>
                <span class="task-date">${taskDate}</span>
            </div>
            <div class="task-actions">
                <button class="btn-success" onclick="editTask(${task.id})">Editar</button>
                <button class="btn-danger" onclick="deleteTask(${task.id})">Eliminar</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const taskElement = document.querySelector(`li span.task-text`).parentElement;
    const currentText = task.text;
    const currentDate = task.datetime || '';

    taskElement.innerHTML = `
        <div class="edit-task-content">
            <input type="text" id="edit-text-${id}" value="${currentText}" />
            <input type="datetime-local" id="edit-date-${id}" value="${currentDate}" />
            <button class="btn-success" onclick="saveTask(${id})">Guardar</button>
        </div>
    `;
}
function saveTask(id) {
    const newText = document.getElementById(`edit-text-${id}`).value.trim();
    const newDate = document.getElementById(`edit-date-${id}`).value;
    
    if (newText === '') return;

    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex !== -1) {
        tasks[taskIndex].text = newText;
        tasks[taskIndex].datetime = newDate;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

// Inicialización
if (currentUser) {
    document.getElementById('taskSection').style.display = 'block';
    loadTasks();
}