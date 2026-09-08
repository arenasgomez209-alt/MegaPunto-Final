# Megapunto - FastAPI & React

Sistema de gestión y aplicación web desarrollado con **FastAPI** en el backend (con base de datos MongoDB) y **React** (construido con Vite) en el frontend.

---

## 🚀 Arquitectura del Proyecto

```text
├── backend/                  # Servidor de API REST en FastAPI
│   ├── app/                  # Lógica de la aplicación, rutas, modelos y esquemas
│   │   ├── routes/           # Endpoints de la API
│   │   ├── database.py       # Conexión a MongoDB Atlas
│   │   ├── main.py           # Entrada de FastAPI
│   │   ├── schemas.py        # Esquemas de Pydantic
│   │   ├── security.py       # Autenticación JWT y hashing de contraseñas
│   │   └── seed.py           # Datos iniciales
│   ├── requirements.txt      # Dependencias de Python
│   └── .env.example          # Plantilla de variables de entorno
├── frontend/                 # Aplicación cliente en React + Vite
│   ├── src/                  # Componentes, vistas y lógica de UI
│   ├── package.json          # Dependencias de frontend
│   └── vite.config.js        # Configuración de Vite
├── iniciar_backend.bat       # Script para iniciar el servidor FastAPI
├── iniciar_frontend.bat      # Script para iniciar el servidor de desarrollo React
└── iniciar_todo.bat          # Script para iniciar backend y frontend simultáneamente
```

---

## 🛠️ Requisitos Previos

- **Python 3.10+**
- **Node.js 18+** y npm
- Conexión a instancia o cluster de **MongoDB**

---

## ⚙️ Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/arenasgomez209-alt/Megapunto-Fastapi.git
cd Megapunto-Fastapi
```

### 2. Configurar el Backend

1. Entra a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Crea y activa un entorno virtual de Python:
   ```bash
   python -m venv venv
   # En Windows:
   venv\Scripts\activate
   # En Linux/macOS:
   source venv/bin/activate
   ```
3. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```
4. Configura el archivo de entorno `.env`:
   - Copia `.env.example` a `.env`
   - Ajusta las credenciales de MongoDB y la clave secreta `SECRET_KEY`.

### 3. Configurar el Frontend

1. Entra a la carpeta del frontend:
   ```bash
   cd ../frontend
   ```
2. Instala las dependencias de Node:
   ```bash
   npm install
   ```

---

## ▶️ Ejecución del Proyecto

### Opción rápida (Windows):
Ejecuta el archivo:
```bat
iniciar_todo.bat
```

### Opción manual:

- **Backend:**
  ```bash
  cd backend
  uvicorn app.main:app --reload --port 8000
  ```
  API y documentación Swagger disponible en: [http://localhost:8000/docs](http://localhost:8000/docs)

- **Frontend:**
  ```bash
  cd frontend
  npm run dev
  ```
  Disponible en: [http://localhost:5173](http://localhost:5173)
