const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'db.json');
let data = { users: [], tasks: [] };

// Cargar datos existentes
if (fs.existsSync(DB_FILE)) {
    data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function save() {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
    // Usuarios
    addUser: (user) => {
        if (data.users.some(u => u.username === user.username)) {
            throw new Error('Usuario ya existe');
        }
        data.users.push(user);
        save();
    },

    getUser: (username, password) => {
        return data.users.find(u => 
            u.username === username && 
            u.password === password
        ) || null;
    },

    // Tareas
    addTask: (task) => {
        if (!task.categoria || typeof task.categoria !== 'string' || !task.categoria.trim()) {
            throw new Error('La categoría es obligatoria');
        }
        const newTask = {
            id: Date.now(),
            text: task.text,
            datetime: task.datetime || null,
            user: task.user,
            categoria: task.categoria.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        };
        data.tasks.push(newTask);
        save();
        return newTask;
    },

    getTasks: (user) => {
        return data.tasks
            .filter(t => t.user === user)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    getCategorias: (user) => {
        // Devuelve categorías únicas para ese usuario
        return [...new Set(data.tasks.filter(t => t.user === user).map(t => t.categoria))];
    },

    getTaskById: (id) => {
        return data.tasks.find(t => t.id === id) || null;
    },

    updateTask: (id, text, datetime, categoria) => {
        const task = data.tasks.find(t => t.id === id);
        if (!task) throw new Error('Tarea no encontrada');
        if (!categoria || typeof categoria !== 'string' || !categoria.trim()) {
            throw new Error('La categoría es obligatoria');
        }
        task.text = text;
        task.datetime = datetime;
        task.categoria = categoria.trim();
        task.updatedAt = new Date().toISOString();
        save();
        return task;
    },

    toggleTaskComplete: (id) => {
        const task = data.tasks.find(t => t.id === id);
        if (!task) throw new Error('Tarea no encontrada');
        
        task.completed = !task.completed;
        task.updatedAt = new Date().toISOString();
        save();
        return task;
    },

    deleteTask: (id) => {
        data.tasks = data.tasks.filter(t => t.id !== id);
        save();
    }
};