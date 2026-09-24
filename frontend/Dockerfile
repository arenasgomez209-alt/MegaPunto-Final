FROM node:20-alpine AS build

WORKDIR /app

# Copiar package files e instalar dependencias
COPY package.json package-lock.json ./
RUN npm ci

# Copiar código fuente
COPY . .

# Variable de entorno para la URL del backend (se pasa en Railway)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build de producción
RUN npm run build

# --- Etapa de producción ---
FROM node:20-alpine

WORKDIR /app

# Instalar serve para servir archivos estáticos
RUN npm install -g serve

# Copiar archivos del build
COPY --from=build /app/dist ./dist

# Puerto dinámico de Railway
EXPOSE ${PORT:-3000}

# Servir con SPA fallback (-s)
CMD serve dist -s -l ${PORT:-3000}
