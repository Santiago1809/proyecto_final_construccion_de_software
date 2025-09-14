// Utilidades generales para la aplicación

/**
 * Formatea una fecha en formato DD/MM/YYYY
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

/**
 * Formatea una fecha y hora en formato DD/MM/YYYY HH:MM
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Fecha y hora formateada
 */
function formatDateTime(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Formatea un número como moneda en pesos colombianos
 * @param {number} amount - Cantidad a formatear
 * @returns {string} Cantidad formateada como moneda
 */
function formatCurrency(amount) {
    if (typeof amount !== 'number') return '$0';
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount);
}

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} True si es válido
 */
function isValidEmail(email) {
    return CONFIG.VALIDATION.EMAIL_REGEX.test(email);
}

/**
 * Valida un número de teléfono
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} True si es válido
 */
function isValidPhone(phone) {
    return CONFIG.VALIDATION.PHONE_REGEX.test(phone);
}

/**
 * Valida una contraseña
 * @param {string} password - Contraseña a validar
 * @returns {object} Objeto con isValid y mensaje de error
 */
function validatePassword(password) {
    if (!password) {
        return { isValid: false, message: 'La contraseña es requerida' };
    }
    if (password.length < CONFIG.VALIDATION.PASSWORD_MIN_LENGTH) {
        return { 
            isValid: false, 
            message: `La contraseña debe tener al menos ${CONFIG.VALIDATION.PASSWORD_MIN_LENGTH} caracteres` 
        };
    }
    return { isValid: true, message: '' };
}

/**
 * Escapa HTML para prevenir XSS
 * @param {string} text - Texto a escapar
 * @returns {string} Texto escapado
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Genera un ID único
 * @returns {string} ID único
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Debounce para funciones
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función con debounce
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Manejo del estado de carga
 */
const LoadingManager = {
    show() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.remove('hidden');
        }
    },
    
    hide() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('hidden');
        }
    }
};

/**
 * Sistema de notificaciones toast
 */
const Toast = {
    show(message, type = 'info', duration = CONFIG.APP.TOAST_DURATION) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas ${this.getIcon(type)}"></i>
            <span class="toast-message">${escapeHtml(message)}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(toast);
        
        // Auto-remove después del tiempo especificado
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, duration);
    },
    
    getIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    },
    
    success(message, duration) {
        this.show(message, 'success', duration);
    },
    
    error(message, duration) {
        this.show(message, 'error', duration);
    },
    
    warning(message, duration) {
        this.show(message, 'warning', duration);
    },
    
    info(message, duration) {
        this.show(message, 'info', duration);
    }
};

/**
 * Manejo de modales
 */
const Modal = {
    show(modalId) {
        const overlay = document.getElementById('modal-overlay');
        const modal = document.getElementById(modalId);
        
        if (overlay && modal) {
            // Ocultar todos los modales
            const allModals = overlay.querySelectorAll('.modal');
            allModals.forEach(m => m.style.display = 'none');
            
            // Mostrar el modal especificado
            modal.style.display = 'block';
            overlay.classList.add('active');
            
            // Enfocar el primer input si existe
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    },
    
    hide() {
        const overlay = document.getElementById('modal-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            // Limpiar formularios después de cerrar
            setTimeout(() => {
                const forms = overlay.querySelectorAll('form');
                forms.forEach(form => form.reset());
            }, 200);
        }
    }
};

/**
 * Validación de formularios
 */
const FormValidator = {
    validateForm(formId) {
        const form = document.getElementById(formId);
        if (!form) return { isValid: false, errors: ['Formulario no encontrado'] };
        
        const errors = [];
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                errors.push(`El campo ${this.getFieldLabel(input)} es requerido`);
                input.classList.add('error');
            } else {
                input.classList.remove('error');
                
                // Validaciones específicas
                if (input.type === 'email' && !isValidEmail(input.value)) {
                    errors.push('El email no tiene un formato válido');
                    input.classList.add('error');
                }
                
                if (input.type === 'tel' && input.value && !isValidPhone(input.value)) {
                    errors.push('El teléfono no tiene un formato válido');
                    input.classList.add('error');
                }
                
                if (input.type === 'password') {
                    const passwordValidation = validatePassword(input.value);
                    if (!passwordValidation.isValid) {
                        errors.push(passwordValidation.message);
                        input.classList.add('error');
                    }
                }
            }
        });
        
        return { isValid: errors.length === 0, errors };
    },
    
    getFieldLabel(input) {
        const label = input.parentElement.querySelector('label');
        return label ? label.textContent : input.name || input.id || 'Campo';
    },
    
    clearErrors(formId) {
        const form = document.getElementById(formId);
        if (form) {
            const inputs = form.querySelectorAll('.error');
            inputs.forEach(input => input.classList.remove('error'));
        }
    }
};

/**
 * Manejo del estado de la aplicación
 */
const AppState = {
    currentPage: 'home',
    user: null,
    travels: [],
    bookings: [],
    
    setCurrentPage(page) {
        this.currentPage = page;
    },
    
    setUser(user) {
        this.user = user;
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('currentUser');
        }
    },
    
    getUser() {
        if (!this.user) {
            const stored = localStorage.getItem('currentUser');
            if (stored) {
                this.user = JSON.parse(stored);
            }
        }
        return this.user;
    },
    
    isLoggedIn() {
        return !!this.getUser();
    },
    
    isAdmin() {
        const user = this.getUser();
        return user && user.rol === CONFIG.USER_ROLES.ADMIN;
    }
};

// Funciones globales para uso en HTML
window.formatDate = formatDate;
window.formatDateTime = formatDateTime;
window.formatCurrency = formatCurrency;
window.isValidEmail = isValidEmail;
window.isValidPhone = isValidPhone;
window.validatePassword = validatePassword;
window.escapeHtml = escapeHtml;
window.generateId = generateId;
window.debounce = debounce;
window.LoadingManager = LoadingManager;
window.Toast = Toast;
window.Modal = Modal;
window.FormValidator = FormValidator;
window.AppState = AppState;