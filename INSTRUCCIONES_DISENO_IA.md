# GUÍA Y PROMPT DE DISEÑO UI/UX PARA STITCH (MEGAPUNTO)

¡Hola **Stitch**! Este documento contiene tus instrucciones directas, el contexto completo del proyecto, la lista de pantallas reales adjuntas y el prompt final para diseñar y elevar al más alto estándar visual y de experiencia de usuario (UI/UX) la plataforma **MEGAPUNTO**.

---

## 🎯 Tu Misión como Stitch
Rediseñar y modernizar la interfaz completa de **MEGAPUNTO**, una tienda multidepartamento (electrodomésticos, tecnología, celulares, motocicletas y servicios) con paneles de gestión por roles (Administrador, Empleado y Cliente) para entrega al SENA.

---

## 🎨 Paleta de Colores y Requerimiento Estético

> ### ☀️ REQUERIMIENTO PRINCIPAL DE COLOR: INTERFAZ CLARA (LIGHT THEME)
> El cliente requiere una **estética de colores más claros, luminosa, moderna y limpia**, pero **SIN IGNORAR NI PERDER LOS COLORES IDENTITARIOS DEL LOGO**.

### 1. Colores de Identidad del Logo (Obligatorios y Protagónicos)
- **Naranja MegaPunto**: `#EA580C` a `#F97316`
  - *Uso*: Botones de acción principal (CTA como "Comprar Ahora", "Agregar al Carrito", "Guardar"), badges de ofertas y descuentos, indicadores dinámicos.
- **Púrpura / Violeta MegaPunto**: `#7C3AED` a `#6D28D9`
  - *Uso*: Encabezados secundarios, tags de categorías, estados activos de navegación, acentos ejecutivos y gradientes armónicos Púrpura-Naranja (como en el logo 3D).

### 2. Colores de Base y Superficie (Estética Clara y Pulida)
- **Fondo General**: Blancos y grises perla muy claros (`#FFFFFF`, `#F8FAFC`, `#F1F5F9`).
- **Tarjetas y Superficies**: Fondo blanco puro (`#FFFFFF`) con bordes muy sutiles (`#E2E8F0` o `rgba(0,0,0,0.06)`), sombras suaves multicapa (`box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.04), 0 8px 10px -6px rgba(0, 0, 0, 0.04)`).
- **Tipografía y Textos**:
  - Títulos principales: Gris pizarra oscuro de alto contraste (`#0F172A`, `#1E293B`).
  - Textos secundarios / descripciones: Gris neutro legible (`#475569`, `#64748B`).
- **Colores de Soporte y Estados**:
  - Éxito / Facturación / Aprobado: Verde Esmeralda (`#10B981`).
  - Alerta / Stock bajo: Ámbar cálido (`#F59E0B`).
  - Error / Cancelado: Rojo Coral (`#EF4444`).

---

## 📸 Inventario de Pantallas Actuales Adjuntas (Carpeta `capturas_stitch_jpg/`)

Adjuntamos las imágenes reales tomadas del sistema actual para que tomes como referencia su estructura y las lleves al siguiente nivel:

| # | Archivo JPG | Descripción de la Pantalla |
|---|-------------|----------------------------|
| 🏷️ | `MegaPunto_Logo.jpg` | **Logotipo Oficial**: Letra "M" facetada en gradiente púrpura/naranja con eslogan *"Tu mundo en un solo lugar"*. |
| 1 | `captura_01_home.jpg` | **Página de Inicio (Home)**: Barra superior de contacto, Header de navegación, Hero Banner principal con botón CTA, categorías y chatbot flotante PuntoBot. |
| 2 | `captura_02_productos_catalogo.jpg` | **Catálogo de Productos**: Buscador inteligente, filtros por categorías (Celulares, Motos, Electrodomésticos), cuadrícula de tarjetas de productos con precios en pesos colombianos (COP), stock y botón agregar al carrito. |
| 3 | `captura_03_servicios.jpg` | **Página de Servicios**: Beneficios exclusivos, envíos nacionales, garantía extendida, financiación y devoluciones. |
| 4 | `captura_04_quienes_somos.jpg` | **Quiénes Somos**: Historia de Almacenes MegaPunto, misión, visión y valores corporativos. |
| 5 | `captura_05_contacto.jpg` | **Contacto y PQR**: Formulario de radicación de mensajes, líneas directas de atención (WhatsApp, email), sedes y acordeón de Preguntas Frecuentes (FAQ). |
| 6 | `captura_06_login.jpg` | **Iniciar Sesión**: Formulario de autenticación de clientes y empleados con recuperación de contraseña. |
| 7 | `captura_07_registro.jpg` | **Registro de Usuario**: Formulario para nuevos usuarios con nombres, cédula, teléfono, dirección y contraseña. |
| 8 | `captura_08_recuperar_pass.jpg` | **Recuperación de Contraseña**: Flujo de restablecimiento de contraseña segura. |
| 9 | `captura_09_admin_panel.jpg` | **Panel Administrador**: Barra lateral exclusiva, tarjetas métricas KPI, gráficos Recharts, historial de ventas, descarga de facturas en PDF, reportes diarios en Excel/PDF y gestión de PQR. |
| 10 | `captura_10_empleado_panel.jpg` | **Panel Empleado**: Barra lateral exclusiva, control de despacho de ventas, inventario y atención operativa de PQR. |
| 11 | `captura_11_cliente_panel.jpg` | **Panel Cliente**: Barra lateral exclusiva, historial de compras en vivo, descarga de facturas en PDF y radicación directa de PQR. |

---

## ⚠️ REGLA ARQUITECTÓNICA DE NAVEGACIÓN

1. **Sitio Público (`/`, `/productos`, `/servicios`, `/quienes-somos`, `/contacto`)**:
   - Header superior global con logo, buscador, enlaces, selector de tema, carrito y botones de acceso.
   - Footer global inferior con enlaces corporativos, métodos de pago (PSE, Bancolombia, Visa, Mastercard) y derechos reservados.
   - Botones flotantes: WhatsApp y Chatbot IA (PuntoBot).

2. **Paneles de Control (`/admin`, `/empleado`, `/cliente`)**:
   - **EL HEADER Y FOOTER GLOBALES DESAPARECEN**.
   - Se utiliza un **Sidebar lateral izquierdo** a pantalla completa con:
     - Logo oficial MegaPunto.
     - Perfil del usuario activo (Avatar, nombre, rol).
     - Menú de navegación por pestañas con iconos Lucide.
     - Botón obligatorio: **"Volver al Sitio Web"** (para regresar al e-commerce público).
     - Botón obligatorio: **"Cerrar Sesión"**.

---

## 📋 PROMPT FINAL PARA COPIAR Y PEGAR DIRECTO EN STITCH

```text
Actúa como un Diseñador UI/UX y Desarrollador Frontend Senior de clase mundial.
Te he adjuntado las imágenes de la aplicación actual de MEGAPUNTO (logo oficial y 11 capturas de pantalla de la tienda y paneles de gestión).

REQUERIMIENTOS DE DISEÑO:
1. ESTÉTICA Y PALETA DE COLORES:
   - Aplica una interfaz CLARA, limpia, luminosa y moderna (Light Theme con fondos blancos #FFFFFF, grises perla #F8FAFC y tarjetas con sombras sutiles).
   - Mantén y resalta con orgullo la identidad del logo: Naranja vibrante (#EA580C / #F97316) para botones de llamada a la acción ("Comprar", "Agregar", "Facturar") y Púrpura elegante (#7C3AED / #6D28D9) para elementos de navegación, categorías y detalles tecnológicos.
   - Tipografía moderna y nítida (Inter / Outfit) con alto contraste y legibilidad.

2. ESTRUCTURA Y PANTALLAS A MEJORAR:
   - Tienda Pública (Home, Productos con cuadrícula de tarjetas, Servicios, Quiénes Somos, Contacto y Formularios de Login/Registro): Diseño e-commerce atractivo, intuitivo y responsivo.
   - Paneles de Control (Admin, Empleado, Cliente): Estilo SaaS contemporáneo con Sidebar lateral izquierdo dedicado, sin Header ni Footer globales, con botones obligatorios de "Volver al Sitio Web" y "Cerrar Sesión", KPIs visuales, gráficos interactivos, tablas de ventas con botones de descarga PDF/Excel y gestión de PQR.
   - Asistente Chatbot IA (PuntoBot) y Carrito de compras deslizante.

Por favor genera las propuestas visuales, componentes y especificaciones CSS/Tailwind para implementar este rediseño claro y premium en React.
```
