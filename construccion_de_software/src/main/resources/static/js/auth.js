// Módulo de autenticación

/**
 * Maneja el formulario de login
 */
function initLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Limpiar errores previos
        FormValidator.clearErrors('login-form');
        
        // Validar formulario
        const validation = FormValidator.validateForm('login-form');
        if (!validation.isValid) {
            validation.errors.forEach(error => Toast.error(error));
            return;
        }
        
        // Obtener datos del formulario
        const formData = new FormData(form);
        const loginData = {
            username: formData.get('username'),
            password: formData.get('password')
        };
        
        try {
            // Intentar login
            const user = await AuthAPI.login(loginData.username, loginData.password);
            
            // Redirigir según el rol del usuario
            if (user.rol === CONFIG.USER_ROLES.ADMIN) {
                showPage('admin-travels');
            } else {
                showPage('travels');
            }
            
            // Actualizar navegación
            updateNavigation();
            
            // Limpiar formulario
            form.reset();
            
        } catch (error) {
            console.error('Error en login:', error);
        }
    });
}

/**
 * Maneja el formulario de registro
 */
function initRegisterForm() {
    const form = document.getElementById('register-form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Limpiar errores previos
        FormValidator.clearErrors('register-form');
        
        // Validar formulario
        const validation = FormValidator.validateForm('register-form');
        if (!validation.isValid) {
            validation.errors.forEach(error => Toast.error(error));
            return;
        }
        
        // Obtener datos del formulario
        const formData = new FormData(form);
        const userData = {
            name: formData.get('name'),
            surname: formData.get('surname'),
            username: formData.get('username'),
            email: formData.get('email'),
            phoneNumber: formData.get('phoneNumber'),
            address: formData.get('address'),
            password: formData.get('password'),
            rol: CONFIG.USER_ROLES.CLIENT // Por defecto todos son clientes
        };
        
        try {
            // Registrar usuario
            await AuthAPI.register(userData);
            
            // Redirigir a login
            showPage('login');
            
            // Limpiar formulario
            form.reset();
            
        } catch (error) {
            console.error('Error en registro:', error);
        }
    });
}

/**
 * Actualiza la navegación según el estado de autenticación
 */
function updateNavigation() {
    const navGuest = document.getElementById('nav-guest');
    const navUser = document.getElementById('nav-user');
    const navAdmin = document.getElementById('nav-admin');
    const userNameSpan = document.getElementById('user-name');
    
    const user = AppState.getUser();
    const isLoggedIn = AppState.isLoggedIn();
    const isAdmin = AppState.isAdmin();
    
    if (isLoggedIn) {
        // Usuario logueado
        navGuest.classList.add('hidden');
        navUser.classList.remove('hidden');
        
        // Mostrar nombre del usuario
        if (userNameSpan && user) {
            userNameSpan.textContent = user.name || user.username;
        }
        
        // Mostrar navegación de admin si es admin
        if (isAdmin) {
            navAdmin.classList.remove('hidden');
        } else {
            navAdmin.classList.add('hidden');
        }
    } else {
        // Usuario no logueado
        navGuest.classList.remove('hidden');
        navUser.classList.add('hidden');
        navAdmin.classList.add('hidden');
    }
}

/**
 * Verifica si el usuario tiene permisos para acceder a una página
 * @param {string} page - Página a verificar
 * @returns {boolean} True si tiene permisos
 */
function checkPagePermissions(page) {
    const user = AppState.getUser();
    const isLoggedIn = AppState.isLoggedIn();
    const isAdmin = AppState.isAdmin();
    
    // Páginas que requieren autenticación
    const userPages = ['my-bookings'];
    
    // Páginas que requieren permisos de admin
    const adminPages = ['admin-travels', 'admin-bookings', 'admin-payments'];
    
    if (userPages.includes(page) && !isLoggedIn) {
        Toast.warning('Debes iniciar sesión para acceder a esta página');
        showPage('login');
        return false;
    }
    
    if (adminPages.includes(page) && !isAdmin) {
        Toast.error('No tienes permisos para acceder a esta página');
        showPage(isLoggedIn ? 'travels' : 'home');
        return false;
    }
    
    return true;
}

/**
 * Cierra la sesión del usuario
 */
function logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        AuthAPI.logout();
    }
}

/**
 * Verifica la sesión al cargar la página
 */
function checkSession() {
    const user = AppState.getUser();
    if (user) {
        updateNavigation();
        
        // Si es admin, redirigir a panel de admin
        if (user.rol === CONFIG.USER_ROLES.ADMIN) {
            // No redirigir automáticamente, mantener la página actual
        }
    }
}

/**
 * Inicializa el sistema de autenticación
 */
function initAuth() {
    initLoginForm();
    initRegisterForm();
    checkSession();
    updateNavigation();
}

// Exportar funciones para uso global
window.initAuth = initAuth;
window.updateNavigation = updateNavigation;
window.checkPagePermissions = checkPagePermissions;
window.logout = logout;
window.checkSession = checkSession;