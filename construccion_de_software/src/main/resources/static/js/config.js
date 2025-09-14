// Configuración global de la aplicación
const CONFIG = {
  // URL base del API
  API_BASE_URL: "http://localhost:8080/api",

  // Endpoints del API
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
    },
    TRAVELS: {
      BASE: "/travels",
      CREATE: "/travels/create",
      DELETE: "/travels/delete",
    },
    BOOKINGS: {
      BASE: "/bookings",
      CREATE: "/bookings/create",
      BY_USER: "/bookings/user",
      UPDATE_STATUS: "/bookings/:id/status",
      DELETE: "/bookings/delete",
    },
    PAYMENTS: {
      BASE: "/payments",
      SUMMARY: "/payments/booking/:bookingId/summary",
    },
  },

  // Configuración de la aplicación
  APP: {
    NAME: "TDEA Viajes",
    VERSION: "1.0.0",
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos en milisegundos
    TOAST_DURATION: 5000, // 5 segundos
  },

  // Estados de reserva
  BOOKING_STATUSES: {
    PENDING: "PENDING",
    CONFIRMED: "CONFIRMED",
    CANCELLED: "CANCELLED",
    REJECTED: "REJECTED",
    ON_HOLD: "ON_HOLD",
    REFUNDED: "REFUNDED",
    NO_SHOW: "NO_SHOW",
    PAID: "PAID",
  },

  // Métodos de pago
  PAYMENT_METHODS: {
    CREDIT_CARD: "CREDIT_CARD",
    DEBIT_CARD: "DEBIT_CARD",
    BANK_TRANSFER: "BANK_TRANSFER",
  },

  // Roles de usuario
  USER_ROLES: {
    CLIENT: "CLIENT",
    ADMIN: "ADMIN",
  },

  // Configuración de validación
  VALIDATION: {
    PASSWORD_MIN_LENGTH: 6,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
  },
};

// Exportar configuración para uso en otros módulos
window.CONFIG = CONFIG;
