-- ==============================================================================
-- SISTEMA MEGAPUNTO COLOMBIA - SCRIPT SQL QUINTO AVANCE
-- SENA - Centro Tecnológico del Mobiliario
-- Ficha: 3406204 | Especialidad: React + Vite + FastAPI + Base de Datos + IA
-- ==============================================================================

-- Creación de la base de datos
CREATE DATABASE IF NOT EXISTS megapunto_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE megapunto_db;

-- ------------------------------------------------------------------------------
-- 1. TABLA: roles
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255) NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (nombre_rol, descripcion) VALUES
('Administrador', 'Acceso total y control ejecutivo de la plataforma'),
('Empleado', 'Gestión operativa de ventas, despachos, productos y PQR'),
('Cliente', 'Consulta de catálogo, compras, facturas descargables y radicación de PQR')
ON DUPLICATE KEY UPDATE descripcion=VALUES(descripcion);

-- ------------------------------------------------------------------------------
-- 2. TABLA: usuarios
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    tipo_documento ENUM('CC', 'CE', 'PAS', 'NIT') DEFAULT 'CC',
    numero_documento VARCHAR(20) NOT NULL UNIQUE,
    direccion VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL DEFAULT 3,
    estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON UPDATE CASCADE
);

-- ------------------------------------------------------------------------------
-- 3. TABLA: productos
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    precio DECIMAL(12, 2) NOT NULL,
    precio_formateado VARCHAR(50) NULL,
    rating DECIMAL(3, 2) DEFAULT 5.0,
    reviews INT DEFAULT 0,
    imagen VARCHAR(500) NULL,
    descripcion TEXT NULL,
    en_stock BOOLEAN DEFAULT TRUE,
    stock INT DEFAULT 10,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 4. TABLA: servicios
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS servicios (
    id_servicio INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    icono VARCHAR(100) DEFAULT 'Sparkles',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 5. TABLA: ventas (Requerimiento 1 y 2)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ventas (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    numero_venta VARCHAR(50) NOT NULL UNIQUE,
    id_cliente INT NULL,
    cliente_nombre VARCHAR(150) NOT NULL,
    cliente_email VARCHAR(150) NOT NULL,
    cliente_telefono VARCHAR(50) NULL,
    cliente_documento VARCHAR(50) NULL,
    id_usuario_operador INT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    descuento DECIMAL(12, 2) DEFAULT 0.00,
    impuestos DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    total DECIMAL(12, 2) NOT NULL,
    metodo_pago VARCHAR(50) DEFAULT 'PSE',
    direccion_envio TEXT NULL,
    estado ENUM('Completada', 'Pendiente', 'Cancelada') DEFAULT 'Completada',
    notas TEXT NULL,
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (id_usuario_operador) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
);

-- ------------------------------------------------------------------------------
-- 6. TABLA: detalle_ventas (Requerimiento 2)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS detalle_ventas (
    id_detalle_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL,
    tipo_item ENUM('Producto', 'Servicio') DEFAULT 'Producto',
    id_item_referencia VARCHAR(100) NOT NULL,
    nombre_item VARCHAR(200) NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(12, 2) NOT NULL,
    descuento DECIMAL(12, 2) DEFAULT 0.00,
    subtotal DECIMAL(12, 2) NOT NULL,
    total DECIMAL(12, 2) NOT NULL,
    FOREIGN KEY (id_venta) REFERENCES ventas(id_venta) ON DELETE CASCADE
);

-- ------------------------------------------------------------------------------
-- 7. TABLA: facturas (Requerimiento 7, 8 y 9)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS facturas (
    id_factura INT AUTO_INCREMENT PRIMARY KEY,
    numero_factura VARCHAR(50) NOT NULL UNIQUE,
    id_venta INT NOT NULL UNIQUE,
    fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(12, 2) NOT NULL,
    impuestos DECIMAL(12, 2) NOT NULL,
    descuento DECIMAL(12, 2) DEFAULT 0.00,
    total DECIMAL(12, 2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    estado ENUM('Pagada', 'Pendiente', 'Anulada') DEFAULT 'Pagada',
    FOREIGN KEY (id_venta) REFERENCES ventas(id_venta) ON DELETE CASCADE
);

-- ------------------------------------------------------------------------------
-- 8. TABLA: detalle_facturas
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS detalle_facturas (
    id_detalle_factura INT AUTO_INCREMENT PRIMARY KEY,
    id_factura INT NOT NULL,
    id_item_referencia VARCHAR(100) NOT NULL,
    nombre_item VARCHAR(200) NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(12, 2) NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    impuesto DECIMAL(12, 2) NOT NULL,
    total DECIMAL(12, 2) NOT NULL,
    FOREIGN KEY (id_factura) REFERENCES facturas(id_factura) ON DELETE CASCADE
);

-- ------------------------------------------------------------------------------
-- 9. TABLA: pqr - Peticiones, Quejas y Reclamos (Requerimiento 16)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pqr (
    id_pqr INT AUTO_INCREMENT PRIMARY KEY,
    radicado VARCHAR(50) NOT NULL UNIQUE,
    id_cliente INT NULL,
    cliente_nombre VARCHAR(150) NOT NULL,
    cliente_email VARCHAR(150) NOT NULL,
    tipo ENUM('Petición', 'Queja', 'Reclamo', 'Sugerencia') NOT NULL,
    asunto VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    estado ENUM('Pendiente', 'En Proceso', 'Respondida', 'Cerrada') DEFAULT 'Pendiente',
    respuesta TEXT NULL,
    atendido_por VARCHAR(150) NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_respuesta TIMESTAMP NULL,
    FOREIGN KEY (id_cliente) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
);

-- ------------------------------------------------------------------------------
-- 10. TABLA: conversaciones (Chatbot IA - Requerimiento 17 y 18)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS conversaciones (
    id_conversacion INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL UNIQUE,
    id_cliente INT NULL,
    creada_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_actividad TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
);

-- ------------------------------------------------------------------------------
-- 11. TABLA: mensajes (Chatbot IA - Requerimiento 17 y 18)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mensajes (
    id_mensaje INT AUTO_INCREMENT PRIMARY KEY,
    id_conversacion INT NOT NULL,
    remitente ENUM('user', 'bot') NOT NULL,
    texto TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_conversacion) REFERENCES conversaciones(id_conversacion) ON DELETE CASCADE
);

-- ------------------------------------------------------------------------------
-- ÍNDICES PARA CONSULTAS Y DASHBOARDS (Requerimiento 10, 11 y 13)
-- ------------------------------------------------------------------------------
CREATE INDEX idx_ventas_fecha ON ventas(fecha_venta);
CREATE INDEX idx_ventas_cliente ON ventas(id_cliente);
CREATE INDEX idx_ventas_estado ON ventas(estado);
CREATE INDEX idx_facturas_numero ON facturas(numero_factura);
CREATE INDEX idx_pqr_estado ON pqr(estado);
CREATE INDEX idx_pqr_radicado ON pqr(radicado);

-- ==============================================================================
-- FIN DEL SCRIPT SQL - QUINTO AVANCE MEGAPUNTO
-- ==============================================================================
