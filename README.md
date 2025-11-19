# Zenith Task - Gestión de Proyectos con IA

Zenith Task es una aplicación de gestión de proyectos moderna y robusta, inspirada en herramientas como ClickUp. Está construida con **React 19**, **TypeScript** y **Tailwind CSS**, y se distingue por su profunda integración con la **API de Google Gemini** para automatizar y asistir en la gestión diaria.

## 🚀 Características Principales

### 🤖 Inteligencia Artificial (Powered by Gemini)
*   **Asistente Chatbot:** Un asistente conversacional que puede crear tareas, asignar usuarios y cambiar estados mediante lenguaje natural.
*   **Generación de Contenido:** Crea descripciones detalladas y desglosa tareas en subtareas automáticamente.
*   **Smart Replies:** Sugerencia de respuestas contextuales para los comentarios de las tareas.
*   **Análisis de Riesgos:** Evalúa el estado del proyecto y detecta cuellos de botella o riesgos potenciales.
*   **Resúmenes Ejecutivos:** Genera resúmenes de progreso de proyectos enteros con un solo clic.
*   **Sugerencias Inteligentes:** Recomienda prioridad y asignación de usuarios basándose en el título de la tarea.

### 📊 Vistas de Proyecto
*   **Tablero Kanban:** Gestión visual con drag-and-drop.
*   **Lista:** Vista detallada con acciones en lote y filtros potentes.
*   **Diagrama de Gantt:** Cronograma interactivo con dependencias visuales y modo lista/gráfico (optimizado para móviles).
*   **Calendario:** Visualización mensual de vencimientos.
*   **Dashboard de Proyecto:** Gráficos estadísticos sobre el estado y carga de trabajo.

### 🏢 Estructura y Organización
*   **Jerarquía:** Espacios de Trabajo > Carpetas > Proyectos (Listas) > Tareas.
*   **Gestión de Tareas:** Subtareas, adjuntos, etiquetas de prioridad, fechas de vencimiento y recordatorios.
*   **Dependencias:** Sistema de bloqueo de tareas (Bloquea a / Bloqueado por).

### 👥 Colaboración y Usuarios
*   **Roles y Permisos:** Sistema granular con roles de Admin, Miembro, Observador e Invitado.
*   **Comentarios:** Hilos de conversación con soporte para menciones (@usuario).
*   **Notificaciones:** Panel de notificaciones en tiempo real.

### 🎨 Personalización y UI
*   **Temas:** Múltiples temas de color (Default, Forest, Ocean, Sunset, Rose, Slate).
*   **Modo Oscuro:** Soporte nativo para modo claro y oscuro.
*   **Diseño Responsivo:** Interfaz totalmente adaptada para móviles, tablets y escritorio.

## 🛠️ Stack Tecnológico

*   **Frontend:** React 19, TypeScript, Vite.
*   **Estilos:** Tailwind CSS.
*   **IA:** Google GenAI SDK (`@google/genai`).
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

3.  **Configuración de Entorno**
    La aplicación requiere una API Key de Google Gemini. Asegúrate de que la variable de entorno `API_KEY` esté disponible en el proceso de construcción o ejecución (inyectada automáticamente en entornos como AIStudio).

4.  **Ejecutar en desarrollo**
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
*   **Miembro:** Crear y editar contenido (tareas, proyectos).
*   **Observador:** Solo lectura y comentarios.
*   **Invitado:** Acceso restringido.

---
© 2025 Zenith Task. Todos los derechos reservados.
