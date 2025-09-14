# Frontend - TDEA Viajes

Frontend moderno para el sistema de gestión de agencia de viajes desarrollado con HTML5, CSS3 y JavaScript vanilla.

## 🚀 Características Principales

### Para Usuarios (Clientes)
- **Autenticación**: Registro e inicio de sesión
- **Catálogo de Viajes**: Exploración de destinos disponibles
- **Sistema de Reservas**: Creación y gestión de reservas
- **Procesamiento de Pagos**: Pago seguro de reservas confirmadas
- **Dashboard Personal**: Visualización de reservas propias

### Para Administradores
- **Gestión de Viajes**: CRUD completo de destinos
- **Gestión de Reservas**: Supervisión y actualización de estados
- **Dashboard de Pagos**: Estadísticas e historial de transacciones
- **Panel de Control**: Vista completa del sistema

## 📁 Estructura del Proyecto

```
frontend/
├── index.html              # Página principal (SPA)
├── css/
│   └── styles.css          # Estilos CSS modernos y responsive
└── js/
    ├── config.js           # Configuración de la aplicación
    ├── utils.js            # Utilidades y helpers
    ├── api.js              # Módulo de comunicación con la API
    ├── auth.js             # Sistema de autenticación
    ├── travels.js          # Gestión de viajes
    ├── bookings.js         # Sistema de reservas
    ├── payments.js         # Procesamiento de pagos
    └── app.js              # Archivo principal de la aplicación
```

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica moderna
- **CSS3**: Variables CSS, Grid, Flexbox, animaciones
- **JavaScript ES6+**: Módulos, async/await, fetch API
- **Font Awesome**: Iconografía
- **Responsive Design**: Móvil primero

## 🎨 Características del Diseño

### Sistema de Design
- **Paleta de Colores**: Azul primario con acentos modernos
- **Tipografía**: Segoe UI para legibilidad óptima
- **Componentes**: Sistema modular de UI components
- **Iconografía**: Font Awesome 6.0

### Responsive Design
- **Mobile First**: Optimizado para dispositivos móviles
- **Breakpoints**: 768px (tablet) y 480px (móvil pequeño)
- **Grid System**: CSS Grid y Flexbox
- **Navigation**: Menú hamburguesa en móviles

## 🔧 Configuración

### 1. Configurar URL del Backend
Edita `js/config.js` para ajustar la URL base del API:

```javascript
const CONFIG = {
    API_BASE_URL: 'http://localhost:8080/api', // Cambiar según tu backend
    // ... resto de configuración
};
```

### 2. Estructura de Carpetas
Asegúrate de que la estructura esté en el directorio `frontend/` dentro de tu proyecto:

```
construccion_de_software/
├── frontend/           # ← Esta carpeta
│   ├── index.html
│   ├── css/
│   └── js/
├── src/               # Backend Spring Boot
└── ...
```

## 🚀 Cómo Usar

### 1. Servir Archivos Estáticos

**Opción A: Servidor HTTP Simple (Python)**
```bash
cd frontend
python -m http.server 3000
```

**Opción B: Live Server (VS Code)**
- Instala la extensión "Live Server"
- Click derecho en `index.html` → "Open with Live Server"

**Opción C: Servidor Local (Node.js)**
```bash
cd frontend
npx serve .
```

### 2. Acceder a la Aplicación
- Frontend: `http://localhost:3000` (o puerto que uses)
- Backend debe estar corriendo en: `http://localhost:8080`

## 👥 Funcionalidades por Rol

### 🛡️ Usuario No Autenticado
- ✅ Ver página de inicio
- ✅ Explorar catálogo de viajes
- ✅ Ver detalles de viajes
- ✅ Registrarse como nuevo usuario
- ✅ Iniciar sesión

### 👤 Cliente Autenticado
- ✅ Todas las funciones anteriores
- ✅ Crear reservas de viajes
- ✅ Ver mis reservas
- ✅ Cancelar reservas pendientes
- ✅ Pagar reservas confirmadas
- ✅ Cerrar sesión

### 👨‍💼 Administrador
- ✅ Todas las funciones anteriores
- ✅ Crear nuevos viajes
- ✅ Eliminar viajes
- ✅ Ver todas las reservas
- ✅ Actualizar estados de reservas
- ✅ Dashboard de pagos con estadísticas

## 🔐 Sistema de Autenticación

### Flujo de Registro
1. Usuario completa formulario de registro
2. Validación del frontend
3. Envío al endpoint `/api/auth/register`
4. Redirección a login tras éxito

### Flujo de Login
1. Usuario ingresa credenciales
2. Validación y envío a `/api/auth/login`
3. Almacenamiento de sesión en localStorage
4. Redirección según rol (admin → panel, cliente → viajes)

### Gestión de Sesión
- **Persistencia**: localStorage del navegador
- **Verificación**: Automática al cargar página
- **Expiración**: Configurable en `CONFIG.APP.SESSION_TIMEOUT`

## 📱 Diseño Responsive

### Móvil (≤ 480px)
- Navegación: Menú hamburguesa
- Tarjetas: Una columna
- Formularios: Campos apilados verticalmente

### Tablet (≤ 768px)
- Navegación: Menú colapsible
- Grids: 2 columnas adaptables
- Espaciado reducido

### Desktop (> 768px)
- Navegación: Menú horizontal completo
- Grids: 3+ columnas
- Sidebar para admin si es necesario

## 🎯 APIs Integradas

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### Viajes
- `GET /api/travels` - Listar viajes
- `GET /api/travels/{id}` - Obtener viaje
- `POST /api/travels/create` - Crear viaje (admin)
- `DELETE /api/travels/delete/{id}` - Eliminar viaje (admin)

### Reservas
- `GET /api/bookings` - Listar reservas (admin)
- `GET /api/bookings/user/{userId}` - Reservas de usuario
- `POST /api/bookings/create` - Crear reserva
- `PATCH /api/bookings/{id}/status` - Actualizar estado
- `DELETE /api/bookings/delete/{id}` - Eliminar reserva

### Pagos
- `POST /api/payments` - Procesar pago
- `GET /api/payments/booking/{bookingId}/summary` - Resumen pago

## 🧪 Herramientas de Desarrollo

En modo desarrollo (localhost), están disponibles estas utilidades en la consola:

```javascript
// Simular login como admin
devTools.loginAsAdmin();

// Simular login como usuario
devTools.loginAsUser();

// Limpiar sesión
devTools.clearSession();

// Ver estado actual
devTools.getAppState();
```

## 🎨 Personalización

### Colores
Edita las variables CSS en `css/styles.css`:

```css
:root {
    --primary-color: #2563eb;    /* Azul principal */
    --secondary-color: #f59e0b;  /* Amarillo secundario */
    --success-color: #10b981;    /* Verde éxito */
    --danger-color: #ef4444;     /* Rojo peligro */
}
```

### Tipografía
```css
:root {
    --font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
```

## 🐛 Resolución de Problemas

### Error CORS
Si aparecen errores CORS, asegúrate de que el backend permita el origen del frontend:

```java
@CrossOrigin(origins = "http://localhost:3000")
```

### Rutas no Encontradas
Verifica que:
- El backend esté corriendo en el puerto correcto
- La URL en `config.js` sea la correcta
- No haya errores de sintaxis en los endpoints

### Problemas de Autenticación
- Limpia localStorage: `localStorage.clear()`
- Verifica que el backend devuelva el objeto usuario correctamente
- Comprueba que los roles sean exactamente 'CLIENT' o 'ADMIN'

## 📋 Lista de Verificación Pre-Producción

- [ ] ✅ Configurar URL de producción en `config.js`
- [ ] ✅ Optimizar imágenes y assets
- [ ] ✅ Minificar CSS y JavaScript
- [ ] ✅ Configurar HTTPS
- [ ] ✅ Validar responsive en dispositivos reales
- [ ] ✅ Probar flujos completos de usuario
- [ ] ✅ Verificar manejo de errores
- [ ] ✅ Configurar analytics si es necesario

## 📞 Soporte

Para preguntas o problemas:
1. Revisa la documentación del backend
2. Verifica la consola del navegador para errores
3. Utiliza las herramientas de desarrollo incluidas
4. Contacta al equipo de desarrollo

---

**TDEA Viajes** - Sistema de Gestión de Agencia de Viajes
*Frontend desarrollado con tecnologías web modernas*