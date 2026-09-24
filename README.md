# 🛒 MegaPunto - Plataforma E-Commerce Full Stack

Sistema de gestión y aplicación web desarrollado con **FastAPI** en el backend (con base de datos MongoDB Atlas) y **React** (construido con Vite) en el frontend.

---

## 🌐 Despliegue en Producción (Railway)

| Servicio | URL |
|----------|-----|
| 🖥️ **Frontend (Tienda)** | [https://megapunto-finalfrontend-production.up.railway.app](https://megapunto-finalfrontend-production.up.railway.app) |
| ⚙️ **Backend (API REST)** | [https://megapunto-backend-production.up.railway.app](https://megapunto-backend-production.up.railway.app) |
| 📄 **Documentación Swagger** | [https://megapunto-backend-production.up.railway.app/docs](https://megapunto-backend-production.up.railway.app/docs) |

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
│   ├── Dockerfile            # Docker para despliegue en Railway
│   ├── requirements.txt      # Dependencias de Python
│   └── .env.example          # Plantilla de variables de entorno
├── frontend/                 # Aplicación cliente en React + Vite
│   ├── src/                  # Componentes, vistas y lógica de UI
│   ├── Dockerfile            # Docker para despliegue en Railway
│   ├── package.json          # Dependencias de frontend
│   └── vite.config.js        # Configuración de Vite
├── iniciar_backend.bat       # Script para iniciar el servidor FastAPI
├── iniciar_frontend.bat      # Script para iniciar el servidor de desarrollo React
└── iniciar_todo.bat          # Script para iniciar backend y frontend simultáneamente
```

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Uso |
|------------|-----|
| **FastAPI** | Backend API REST |
| **MongoDB Atlas** | Base de datos NoSQL en la nube |
| **React 19** | Frontend SPA |
| **Vite** | Bundler y dev server |
| **Tailwind CSS** | Estilos y diseño responsivo |
| **JWT** | Autenticación y autorización |
| **Railway** | Despliegue en producción (Docker) |
| **Recharts** | Gráficas del dashboard |

---

## 📋 Requisitos Previos

- **Python 3.10+**
- **Node.js 18+** y npm
- Conexión a instancia o cluster de **MongoDB**

---

## ⚙️ Instalación y Configuración Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/arenasgomez209-alt/MegaPunto-Final.git
cd MegaPunto-Final
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

---

## 👥 Credenciales de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| **Administrador** | `admin@megapunto.com` | `Admin123*` |
| **Empleado** | `empleado@megapunto.com` | `Empleado123*` |

---

## 📝 Funcionalidades Principales

- 🛍️ Catálogo de productos con categorías y filtros
- 🛒 Carrito de compras interactivo
- 👤 Registro e inicio de sesión con JWT
- 👑 Panel de Administración (Dashboard, Ventas, Facturas, Reportes, PQR, Usuarios, Productos)
- 💼 Panel de Empleado
- 📊 Gráficas de analítica y reportes en PDF/Excel
- 💬 Chatbot con Inteligencia Artificial
- 📱 Diseño responsivo
- 🎨 Diseño premium con colores de la marca MegaPunto
