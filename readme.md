ODONTOLETO
Descripción general
OdontoLeto es una plataforma web desarrollada por el Grupo 4 para la materia Desarrollo de Software (comosión S32).
El sistema está orientado a odontólogos y ortodoncistas, permitiendo gestionar pacientes, tratamientos y la evolución clínica a través de imágenes y registros cronológicos.

La aplicación busca optimizar la comunicación y el seguimiento entre el profesional y sus pacientes, mejorando la organización de turnos y el control de los tratamientos realizados.


Esta idea la tuvimos para crear una herramienta que los odontologos puedan usar desde una laptop o celular, es una aplicacion relativamente liviana y tiene muchas funcionalidades

Tecnologías utilizadas

Backend

* Python 3
* Django
* SQLite3
* Django REST Framework para la creación de la API y comunicación con el frontend

Frontend

* React.js con Create React App
* JavaScript y JSX
* CSS3
* Componentes personalizados y uso de Context API

Estructura del proyecto

Backend (carpeta backend)
Contiene la configuración principal de Django, ENDPOINTS, y configuraciones de la bdd

Estructura:
backend
│
├── odontologos
│   admin.py
│   apps.py
│   models.py
│   serializers.py
│   urls.py
│   views.py
│   tests.py
│
├── pacientes
│   admin.py
│   apps.py
│   models.py
│   serializers.py
│   urls.py
│   views.py
│   tests.py
│
├── orthodontics
│   settings.py
│   urls.py
│   asgi.py
│   wsgi.py
│   init.py
│
├── manage.py
└── db.sqlite3

Frontend (carpeta frontend)
Contiene el desarrollo visual y funcional del cliente. Está dividido en componentes reutilizables, páginas y contextos.

Estructura general:
frontend
│
├── public
│
└── src
├── assets
├── components
│   ├── assets
│   ├── componentes de paciente
│   ├── iconos
│   ├── Antecedentes.jsx
│   ├── carrousel.jsx
│   ├── headerp.jsx
│   ├── informacion.jsx
│   ├── Modal-agregar.jsx
│   ├── Odontograma.css
│   ├── paciente.jsx
│   ├── Tratamientos.jsx
│   └── Turnos.jsx
│
├── contexts
├── data
├── pages
│   AppointmentsPage.js
│   HomePage.js
│   LoginPage.js
│   NewPatientsPage.js
│   PatientDetailPage.js
│   PatientsList.js
│   PatientsPage.js
│   RegisterTreatment.js
│
├── App.js
├── App.test.js
├── index.css
└── index.js

Instalación y ejecución

Backend

1. Crear y activar un entorno virtual.
2. Instalar dependencias con pip install -r requirements.txt.
3. Ejecutar las migraciones con python manage.py migrate.
4. Iniciar el servidor con python manage.py runserver.

Frontend

1. Entrar en la carpeta frontend.
2. Instalar dependencias con npm install.
3. Ejecutar la aplicación con npm start.
!
En resumen:
servidor del front (npm run start) y después el del back (python manage.py runserver)
obviamente habiendo instalado las dependencias antes

Objetivos principales del proyecto

* Gestionar la información de pacientes de manera ordenada.
* Facilitar el registro y seguimiento de tratamientos odontológicos.
* Registrar pagos y antecedentes médicos.
* Administrar turnos y recordatorios.
* Mejorar la comunicación entre profesional y paciente mediante una interfaz simple e intuitiva.

Autores:
Ulises Vetere
Thomas ASandez
Forlini Martin
Sampaoli Nicolas
TorresValentin
De Paola Luca

Proyecto desarrollado por el Grupo 4 - Desarrollo de Software S32.
Nombre del sistema: OdontoLeto.

Profesores: Emilio Watemmberg Paula Giudici
---
