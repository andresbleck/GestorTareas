# Gestor de Tareas - Arquitectura 3 Capas

## 📦 Estructura del Proyecto

```
3capas/
├── backend/      # Lógica de negocio (Node.js + Express)
│   └── server.js
├── data/         # Persistencia de datos (JSON)
│   ├── database.js
│   └── db.json
├── frontend/     # Interfaz de usuario (HTML, CSS, JS)
│   ├── app.js
│   ├── index.html
│   └── styles.css
```

## 🚀 ¿Cómo correr el proyecto?

1. **Instala dependencias** (en la raíz de GestorTareas):
   ```bash
   npm install
   ```
2. **Inicia el backend**:
   ```bash
   cd 3capas/backend
   node server.js
   ```
   El backend corre en `http://localhost:3000`
3. **Abre el frontend**:
   - Abre `3capas/frontend/index.html` en tu navegador

## 📝 Funcionalidad principal

- **Registro e inicio de sesión** de usuarios
- **Agregar, editar, eliminar tareas**
- **Marcar tareas como Pendiente o Completada**
- **Visualización clara del estado**:
  - Si la tarea está pendiente, aparece debajo el texto "Pendiente" con un círculo amarillo
  - Si la tarea está completada, toda la tarea se pone verde y el texto se tacha
- **Botón de acción**:
  - "Marcar Completada" (verde) si está pendiente
  - "Marcar Pendiente" (amarillo) si está completada

## 🎨 Ejemplo visual

- **Pendiente:**
  - Tarea normal
  - ⬤ Pendiente (círculo amarillo)
- **Completada:**
  - Fondo verde
  - Texto tachado
  - Sin indicador de pendiente

## 🏗️ Arquitectura 3 Capas

- **Frontend:** Solo maneja la UI y llama a la API
- **Backend:** Expone endpoints REST y valida lógica
- **Data:** Persistencia en archivo JSON

## 📡 Endpoints principales

- `POST /register` - Registrar usuario
- `POST /login` - Login
- `GET /tasks?user=usuario` - Listar tareas
- `POST /tasks` - Crear tarea
- `PUT /tasks/:id` - Editar tarea
- `PUT /tasks/:id/toggle` - Cambiar estado pendiente/completada
- `DELETE /tasks/:id` - Eliminar tarea

## 👨‍💻 Autor
- Desarrollado por Juan Pablo Benedetti y equipo

---
¡Listo para usar y mejorar! Si tienes dudas o quieres agregar nuevas funcionalidades, edita este README o consulta el código fuente. 