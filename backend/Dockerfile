FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y --no-install-recommends gcc && rm -rf /var/lib/apt/lists/*

# Copiar e instalar dependencias Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código fuente
COPY . .

# Puerto dinámico de Railway
EXPOSE ${PORT:-8000}

# Iniciar FastAPI con uvicorn
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
