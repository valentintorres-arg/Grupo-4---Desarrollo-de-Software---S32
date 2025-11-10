-- OdontoLeto --

OdontoLeto es una plataforma web integral diseñada para la gestión de consultorios odontológicos. Este proyecto fue desarrollado por el Grupo 4 como parte de la materia Desarrollo de Software (Comisión S32).


--- Descripción General ---

El sistema está orientado a odontólogos y ortodoncistas, permitiéndoles gestionar pacientes, tratamientos y la evolución clínica a través de imágenes y registros cronológicos.

La aplicación busca optimizar la comunicación y el seguimiento entre el profesional y sus pacientes, mejorando la organización de turnos y el control de los tratamientos realizados. El objetivo es proveer una herramienta liviana y funcional, accesible desde laptops o dispositivos móviles.



--- Características Principales ---

Gestión Integral de Pacientes: Administración ordenada de la información de pacientes.


Seguimiento Clínico: Registro detallado y cronológico de tratamientos odontológicos.


Historial Completo: Facilita el registro de pagos y antecedentes médicos.


Administración de Turnos: Sistema para agendar citas y gestionar recordatorios.


Interfaz Intuitiva: Interfaz simple e intuitiva para mejorar la comunicación entre el profesional y el paciente.

--- Tecnologías Utilizadas ---
El proyecto sigue una arquitectura Cliente-Servidor, separando el Backend (API REST) del Frontend (Aplicación de React).

--Backend

Python 3 

Django 

Django REST Framework: Para la creación de la API REST.

SQLite3: Base de datos utilizada para el desarrollo.


--Frontend

React.js (Creado con Create React App) 

JavaScript (JSX) 

CSS3: Para estilos y maquetación.

Context API: Para el manejo del estado global de la aplicación.


--- Instalación y Ejecución ---
Para ejecutar este proyecto, deberás clonar el repositorio y levantar tanto el servidor de Backend como el cliente de Frontend en dos terminales separadas.

--Backend (Terminal 1: BASH)

Clona el repositorio:
git clone https://github.com/valentintorres-arg/Grupo-4---Desarrollo-de-Software---S32.git

Navega a la carpeta del backend:
cd Grupo-4---Desarrollo-de-Software---S32/backend

Crea y activa un entorno virtual: 

# Windows (Git Bash)
python -m venv venv
source venv/Scripts/activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate

Instala las dependencias:
pip install -r requirements.txt

Aplica las migraciones (para crear la base de datos): 
python manage.py migrate

Inicia el servidor: 
python manage.py runserver

El servidor de Django estará corriendo en http://127.0.0.1:8000/. Deja esta terminal abierta.

--Frontend (Terminal 2: BASH)

Abre una nueva terminal y navega a la carpeta del frontend:
cd Grupo-4---Desarrollo-de-Software---S32/frontend

Instala las dependencias de Node.js: 
npm install

Inicia la aplicación de React: 
npm start

La aplicación se abrirá automáticamente en http://localhost:3000/.

--- Estructura del Proyecto ---
<details> <summary>Ver estructura del Backend (Django) </summary>

backend/
│
├── .venv/               # Entorno virtual de Python (alternativo)
├── evoluciones/         # Carpeta para imágenes de evolución (autogenerada)
├── media/               # Carpeta para archivos subidos por usuarios (imágenes)
│
├── odontologos/         # App de Django para perfiles de odontólogos
│   ├── migrations/
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── serializers.py
│   ├── urls.py
│   └── views.py
│
├── orthodontics/        # Configuración principal del proyecto Django
│   ├── asgi.py
│   ├── celery.py        # Configuración de Celery
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
├── pacientes/           # App de Django para gestión de pacientes
│   ├── management/
│   ├── migrations/
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tasks.py         # Tareas asíncronas (ej. recordatorios)
│   ├── urls.py
│   └── views.py
│
├── venv/                # Entorno virtual de Python
│
├── db.sqlite3           # Base de datos
├── manage.py            # Script de gestión de Django
└── requirements.txt     # Dependencias de Python

<details> <summary>Ver estructura del Frontend (React) </summary>

frontend/
│
├── node_modules/        # Dependencias de Node.js (autogenerada)
├── public/              # Archivos públicos (index.html, favicon)
│
└── src/                 # Código fuente de React
    ├── components/      # Componentes reutilizables
    ├── contexts/        # React Context para manejo de estado
    ├── data/            # Datos estáticos o mockeados
    ├── hooks/           # Custom Hooks de React
    ├── pages/           # Componentes que representan páginas/rutas
    ├── services/        # Lógica para peticiones a la API
    ├── utils/           # Funciones de utilidad
    │
    ├── App.jsx          # Componente raíz (con JSX)
    ├── App.test.js
    ├── index.css
    ├── index.js         # Punto de entrada de la aplicación
    ├── reportWebVitals.js 
    ├── setupTests.js
│
├── .gitignore
├── package.json         # Definición del proyecto y dependencias
├── tailwind.config.js   # Configuración de Tailwind CSS
</details>

--- Autores ---

Ulises Vetere
Thomas ASandez
Martin Forlini
Nicolas Sampaoli
Valentín Torres
Luca De Paola
 
--- Docentes ---
Emilio Watemmberg
Paula Giudici