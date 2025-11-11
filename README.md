#  **OdontoLeto**

**OdontoLeto** es una plataforma web integral diseñada para la **gestión de consultorios odontológicos**.  
Este proyecto fue desarrollado por el **Grupo 4** como parte de la materia **Desarrollo de Software (Comisión S32)**.

---

##  Descripción General

El sistema está orientado a **odontólogos y ortodoncistas**, permitiéndoles gestionar pacientes, tratamientos y la evolución clínica a través de imágenes y registros cronológicos.

La aplicación busca optimizar la comunicación y el seguimiento entre el profesional y sus pacientes, mejorando la organización de turnos y el control de los tratamientos realizados.  
El objetivo es proveer una **herramienta liviana, funcional y accesible** desde laptops o dispositivos móviles.

---

##  Características Principales

- **Gestión Integral de Pacientes:** Administración ordenada de la información de pacientes.  
- **Seguimiento Clínico:** Registro detallado y cronológico de tratamientos odontológicos.  
- **Historial Completo:** Facilita el registro de pagos y antecedentes médicos.  
- **Administración de Turnos:** Sistema para agendar citas y gestionar recordatorios.  
- **Interfaz Intuitiva:** Diseño simple y claro para mejorar la comunicación entre profesional y paciente.

---

##  Tecnologías Utilizadas

El proyecto sigue una arquitectura **Cliente-Servidor**, separando el **Backend (API REST)** del **Frontend (Aplicación React)**.

### Backend
- **Python 3**  
- **Django**  
- **Django REST Framework:** Creación de la API REST.  
- **SQLite3:** Base de datos utilizada para desarrollo.  

### Frontend
- **React.js** (creado con Create React App)  
- **JavaScript (JSX)**  
- **CSS3:** Estilos y maquetación.  
- **Context API:** Manejo de estado global.  

---

## Instalación y Ejecución

Para ejecutar este proyecto, debés clonar el repositorio y levantar tanto el **servidor Backend** como el **cliente Frontend** en dos terminales separadas.

### Backend (Terminal 1)

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/valentintorres-arg/Grupo-4---Desarrollo-de-Software---S32.git
   ```

2. **Navegar al backend:**
   ```bash
   cd Grupo-4---Desarrollo-de-Software---S32/backend
   ```

3. **Crear y activar un entorno virtual:**
   ```bash
   # Windows (Git Bash)
   python -m venv venv
   source venv/Scripts/activate

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

4. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Aplicar migraciones:**
   ```bash
   python manage.py migrate
   ```

6. **Iniciar el servidor:**
   ```bash
   python manage.py runserver
   ```

El servidor de Django estará disponible en: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

---

### Frontend (Terminal 2)

1. **Abrir una nueva terminal y navegar al frontend:**
   ```bash
   cd Grupo-4---Desarrollo-de-Software---S32/frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar la aplicación:**
   ```bash
   npm start
   ```

La aplicación se abrirá automáticamente en: [http://localhost:3000/](http://localhost:3000/)

---

## Estructura del Proyecto

<details>
<summary>Ver estructura del Backend (Django)</summary>

```
backend/
├── evoluciones/         # Imágenes de evolución (autogenerada)
├── media/               # Archivos subidos por usuarios
├── odontologos/         # App de perfiles de odontólogos
│   ├── models.py
│   ├── serializers.py
│   └── views.py
├── orthodontics/        # Configuración principal del proyecto
│   ├── celery.py
│   ├── settings.py
│   └── urls.py
├── pacientes/           # App de gestión de pacientes
│   ├── models.py
│   ├── tasks.py
│   └── views.py
├── db.sqlite3           # Base de datos
├── manage.py
└── requirements.txt
```
</details>

<details>
<summary>Ver estructura del Frontend (React)</summary>

```
frontend/
├── public/              # Archivos públicos (index.html, favicon)
└── src/                 # Código fuente de React
    ├── components/      # Componentes reutilizables
    ├── contexts/        # Manejo de estado global
    ├── hooks/           # Custom hooks
    ├── pages/           # Páginas / Rutas
    ├── services/        # Peticiones a la API
    ├── utils/           # Funciones auxiliares
    ├── App.jsx
    └── index.js
```
</details>

---

## Autores

- Ulises Vetere  
- Thomas Asandez  
- Martín Forlini  
- Nicolás Sampaoli  
- Valentín Torres  
- Luca De Paola  

---

## Docentes

- Emilio Watemberg  
- Paula Giudici
