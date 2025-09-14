// Archivo principal de la aplicación

/**
 * Estado de navegación de páginas
 */
let currentPageId = 'home';

/**
 * Muestra una página específica
 * @param {string} pageId - ID de la página a mostrar
 */
function showPage(pageId) {
    // Verificar permisos de página
    if (!checkPagePermissions(pageId)) {
        return;
    }
    
    // Ocultar todas las páginas
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Mostrar la página seleccionada
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPageId = pageId;
        AppState.setCurrentPage(pageId);
        
        // Cargar datos específicos de la página
        loadPageData(pageId);
        
        // Actualizar navegación activa
        updateActiveNavigation(pageId);
    }
}

/**
 * Carga los datos específicos de cada página
 * @param {string} pageId - ID de la página
 */
function loadPageData(pageId) {
    switch (pageId) {
        case 'travels':
            loadTravels();
            break;
        case 'my-bookings':
            loadMyBookings();
            break;
        case 'admin-travels':
            loadAdminTravels();
            break;
        case 'admin-bookings':
            loadAdminBookings();
            break;
        case 'admin-payments':
            loadAdminPayments();
            break;
    }
}

/**
 * Actualiza la navegación activa
 * @param {string} pageId - ID de la página activa
 */
function updateActiveNavigation(pageId) {
    // Remover clase activa de todos los enlaces
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Esta función se puede expandir para resaltar el enlace activo
    // basado en el pageId actual
}

/**
 * Cierra cualquier modal abierto
 */
function closeModal() {
    Modal.hide();
}

/**
 * Inicializa el toggle de navegación móvil
 */
function initMobileNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        
        // Cerrar menú al hacer clic en un enlace
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
    }
}

/**
 * Inicializa los event listeners globales
 */
function initGlobalEventListeners() {
    // Cerrar modal al hacer clic en el overlay
    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }
    
    // Cerrar modal con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Manejar navegación con botones del navegador
    window.addEventListener('popstate', (e) => {
        const page = e.state?.page || 'home';
        showPage(page);
    });
}

/**
 * Configura el enrutamiento básico basado en hash
 */
function initRouting() {
    // Manejar cambios en el hash de la URL
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.slice(1); // Remover el #
        if (hash) {
            showPage(hash);
        }
    });
    
    // Cargar página inicial basada en el hash
    const initialHash = window.location.hash.slice(1);
    if (initialHash) {
        showPage(initialHash);
    } else {
        showPage('home');
    }
}

/**
 * Actualiza la URL sin recargar la página
 * @param {string} pageId - ID de la página
 */
function updateURL(pageId) {
    const newURL = pageId === 'home' ? 
        window.location.pathname : 
        `${window.location.pathname}#${pageId}`;
    
    history.pushState({ page: pageId }, '', newURL);
}

/**
 * Inicializa la aplicación
 */
function initApp() {
    try {
        console.log('🚀 Iniciando TDEA Viajes...');
        
        // Inicializar módulos principales
        initAuth();
        initTravels();
        initBookings();
        initPayments();
        
        // Inicializar componentes de UI
        initMobileNavigation();
        initGlobalEventListeners();
        initRouting();
        
        // Verificar sesión y actualizar UI
        checkSession();
        updateNavigation();
        
        console.log('✅ TDEA Viajes iniciado correctamente');
        
        // Mostrar mensaje de bienvenida
        setTimeout(() => {
            if (!AppState.isLoggedIn()) {
                Toast.info('¡Bienvenido a TDEA Viajes! Explora nuestros destinos increíbles.', 3000);
            }
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error inicializando la aplicación:', error);
        Toast.error('Error al cargar la aplicación. Por favor, recarga la página.');
    }
}

/**
 * Maneja errores globales
 */
function initErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('Error global:', e.error);
        Toast.error('Ha ocurrido un error inesperado. Por favor, intenta de nuevo.');
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Promise rechazada:', e.reason);
        // No mostrar toast para todas las promesas rechazadas
        // ya que los módulos de API ya manejan sus propios errores
    });
}

/**
 * Configura funciones de depuración para desarrollo
 */
function setupDevTools() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // Funciones de utilidad para desarrollo
        window.devTools = {
            // Simular login como admin
            loginAsAdmin() {
                AppState.setUser({
                    id: 999,
                    username: 'admin',
                    name: 'Admin',
                    surname: 'Test',
                    email: 'admin@test.com',
                    rol: 'ADMIN'
                });
                updateNavigation();
                Toast.success('Logueado como admin (modo desarrollo)');
            },
            
            // Simular login como cliente
            loginAsUser() {
                AppState.setUser({
                    id: 998,
                    username: 'user',
                    name: 'Usuario',
                    surname: 'Test',
                    email: 'user@test.com',
                    rol: 'CLIENT'
                });
                updateNavigation();
                Toast.success('Logueado como usuario (modo desarrollo)');
            },
            
            // Limpiar sesión
            clearSession() {
                AppState.setUser(null);
                updateNavigation();
                showPage('home');
                Toast.info('Sesión limpiada');
            },
            
            // Ver estado actual
            getAppState() {
                return {
                    currentPage: AppState.currentPage,
                    user: AppState.getUser(),
                    isLoggedIn: AppState.isLoggedIn(),
                    isAdmin: AppState.isAdmin()
                };
            }
        };
        
        console.log('🔧 Herramientas de desarrollo disponibles en window.devTools');
    }
}

/**
 * Inicialización cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', () => {
    initErrorHandling();
    setupDevTools();
    initApp();
});

// Exportar funciones principales para uso global
window.showPage = showPage;
window.closeModal = closeModal;
window.initApp = initApp;