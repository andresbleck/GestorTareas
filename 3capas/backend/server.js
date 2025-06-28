const express = require('express');
const cors = require('cors');
const app = express();
const db = require('../data/database'); 

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());


// Endpoint opcional para health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});


// Endpoint de Registro
app.post('/register', (req, res) => {
    try {
        db.addUser(req.body);
        res.status(201).send('Usuario registrado');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Endpoint de Login
app.post('/login', (req, res) => {
    try {
        const user = db.getUser(req.body.username, req.body.password);
        if (!user) {
            return res.status(401).send('Credenciales inválidas');
        }
        res.json({ message: 'Login exitoso', username: user.username });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Endpoint para obtener tareas
app.get('/tasks', (req, res) => {
    try {
        const tasks = db.getTasks(req.query.user);
        res.json(tasks);
    } catch (error) {
        res.status(500).send(error.message);
    }
});



app.post('/tasks', (req, res) => {
    try {
        const task = db.addTask({
            text: req.body.text,
            datetime: req.body.datetime, 
            user: req.body.user
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

;
// Endpoint para editar tarea
app.put('/tasks/:id', async (req, res) => {
    const taskId = parseInt(req.params.id);
    const newText = req.body.text;
    const newDateTime = req.body.datetime;

    if (isNaN(taskId)) {
        return res.status(400).json({ error: 'ID de tarea inválido' });
    }

    if (!newText || typeof newText !== 'string' || newText.trim().length === 0) {
        return res.status(400).json({ error: 'El texto de la tarea es requerido' });
    }

    try {
        const existingTask = db.getTaskById(taskId);
        if (!existingTask) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }

        const updatedTask = db.updateTask(taskId, newText.trim(), newDateTime || null);
        return res.status(200).json(updatedTask);

    } catch (error) {
        console.error('Error al editar tarea:', error);
        return res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message
        });
    }
});

// Endpoint para toggle de completado
app.put('/tasks/:id/toggle', (req, res) => {
    console.log('Toggle endpoint llamado con:', req.params.id, req.body);
    const taskId = parseInt(req.params.id);
    const user = req.body.user;

    if (isNaN(taskId)) {
        console.log('ID inválido:', req.params.id);
        return res.status(400).json({ error: 'ID de tarea inválido' });
    }

    try {
        const existingTask = db.getTaskById(taskId);
        console.log('Tarea encontrada:', existingTask);
        if (!existingTask) {
            console.log('Tarea no encontrada');
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }

        // Verificar que la tarea pertenece al usuario
        if (existingTask.user !== user) {
            console.log('Usuario no autorizado:', user, 'vs', existingTask.user);
            return res.status(403).json({ error: 'No tienes permisos para modificar esta tarea' });
        }

        const updatedTask = db.toggleTaskComplete(taskId);
        console.log('Tarea actualizada:', updatedTask);
        return res.status(200).json(updatedTask);

    } catch (error) {
        console.error('Error al cambiar estado de tarea:', error);
        return res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message
        });
    }
});

// Endpoint para eliminar tarea
app.delete('/tasks/:id', (req, res) => {
    try {
        db.deleteTask(parseInt(req.params.id));
        res.status(200).send('Tarea eliminada');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.listen(3000, () => {
    console.log('Servidor listo en http://localhost:3000');
});