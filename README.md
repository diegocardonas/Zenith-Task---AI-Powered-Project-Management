# Zenith Task - Gestión de Proyectos

Zenith Task es una aplicación de gestión de proyectos moderna y robusta, inspirada en herramientas como ClickUp y Jira. Está construida con **React 19**, **TypeScript** y **Tailwind CSS**, ofreciendo una experiencia fluida y organizada para la gestión diaria de equipos.

## 🚀 Características Principales

### 📊 Vistas de Proyecto
*   **Tablero Kanban:** Gestión visual con drag-and-drop.
*   **Lista:** Vista detallada con acciones en lote y filtros potentes.
*   **Diagrama de Gantt:** Cronograma interactivo con dependencias visuales y modo lista/gráfico (optimizado para móviles).
*   **Calendario:** Visualización mensual de vencimientos.
*   **Dashboard de Proyecto:** Gráficos estadísticos sobre el estado y carga de trabajo.
*   **Matriz de Eisenhower:** Priorización de tareas por Urgencia e Importancia.
*   **Backlog (Estilo Jira):** Gestión de Sprints y pila de producto con Story Points.

### 🏢 Estructura y Organización
*   **Jerarquía:** Espacios de Trabajo > Carpetas > Proyectos (Listas) > Tareas.
*   **Gestión de Tareas:** Subtareas, adjuntos, etiquetas de prioridad, fechas de vencimiento y recordatorios.
*   **Dependencias:** Sistema de bloqueo de tareas (Bloquea a / Bloqueado por).
*   **Tipos de Incidencia:** Soporte para Historias, Bugs, Tareas y Épicas con claves únicas (ej. PROJ-123).

### 👥 Colaboración y Usuarios
*   **Roles y Permisos:** Sistema granular con roles de Admin, Manager, Miembro, Observador e Invitado.
*   **Comentarios:** Hilos de conversación con soporte para menciones (@usuario).
*   **Chat de Equipo:** Canales grupales y mensajes directos en tiempo real.
*   **Notificaciones:** Panel de notificaciones.

### 🎨 Personalización y UI
*   **Temas:** Múltiples temas de color (Default, Forest, Ocean, Sunset, Rose, Slate).
*   **Modo Oscuro:** Soporte nativo para modo claro y oscuro.
*   **Diseño Responsivo:** Interfaz totalmente adaptada para móviles, tablets y escritorio.

## 🛠️ Stack Tecnológico

*   **Frontend:** React 19, TypeScript, Vite.
*   **Estilos:** Tailwind CSS.
*   **Iconos:** Heroicons (SVG).

## 📦 Instalación y Uso

1.  **Clonar el repositorio**
    ```bash
    git clone <url-del-repo>
    ```

2.  **Instalar dependencias**
    ```bash
    npm install
    ```

3.  **Ejecutar en desarrollo**
    ```bash
    npm run dev
    ```

## 📱 Funcionalidades Móviles
La aplicación ha sido optimizada específicamente para dispositivos táctiles:
*   **Gantt:** Botón flotante para alternar entre vista de lista y gráfico.
*   **Tablero:** Scroll horizontal con "snap" para columnas.
*   **Menús:** Barras laterales y modales adaptables a pantalla completa.
*   **Navegación:** Botones de acción y filtros accesibles.

## 🔐 Permisos
*   **Admin:** Control total, gestión de usuarios y configuración de la app.
*   **Manager:** Gestión de proyectos, equipos y asignaciones.
*   **Miembro:** Crear y editar contenido (tareas).
*   **Observador:** Solo lectura y comentarios.
*   **Invitado:** Acceso restringido.

---
© 2025 Zenith Task. Todos los derechos reservados.