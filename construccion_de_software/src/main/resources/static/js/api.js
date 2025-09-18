// Módulo para manejo de llamadas a la API

const API = {
  /**
   * Realiza una petición HTTP
   * @param {string} endpoint - Endpoint de la API
   * @param {object} options - Opciones de la petición
   * @returns {Promise} Respuesta de la API
   */
  async request(endpoint, options = {}) {
    const url = `${CONFIG.API_BASE_URL}${endpoint}`;

    const defaultOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const finalOptions = { ...defaultOptions, ...options };

    try {
      LoadingManager.show();

      const response = await fetch(url, finalOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `Error ${response.status}: ${response.statusText}`
        );
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      Toast.error(`Error de conexión: ${error.message}`);
      throw error;
    } finally {
      LoadingManager.hide();
    }
  },

  /**
   * Petición GET
   * @param {string} endpoint - Endpoint de la API
   * @returns {Promise} Respuesta de la API
   */
  async get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  },

  /**
   * Petición POST
   * @param {string} endpoint - Endpoint de la API
   * @param {object} data - Datos a enviar
   * @returns {Promise} Respuesta de la API
   */
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Petición PUT
   * @param {string} endpoint - Endpoint de la API
   * @param {object} data - Datos a enviar
   * @returns {Promise} Respuesta de la API
   */
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Petición PATCH
   * @param {string} endpoint - Endpoint de la API
   * @param {object} data - Datos a enviar
   * @returns {Promise} Respuesta de la API
   */
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Petición DELETE
   * @param {string} endpoint - Endpoint de la API
   * @returns {Promise} Respuesta de la API
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  },
};

/**
 * API específica para autenticación
 */
const AuthAPI = {
  /**
   * Inicia sesión
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Promise} Usuario autenticado
   */
  async login(username, password) {
    try {
      const user = await API.post(CONFIG.ENDPOINTS.AUTH.LOGIN, {
        username,
        password,
      });

      AppState.setUser(user);
      Toast.success("¡Sesión iniciada correctamente!");
      return user;
    } catch (error) {
      Toast.error("Credenciales incorrectas");
      throw error;
    }
  },

  /**
   * Registra un nuevo usuario
   * @param {object} userData - Datos del usuario
   * @returns {Promise} Resultado del registro
   */
  async register(userData) {
    try {
      const result = await API.post(CONFIG.ENDPOINTS.AUTH.REGISTER, userData);
      Toast.success(
        "¡Cuenta creada correctamente! Ahora puedes iniciar sesión."
      );
      return result;
    } catch (error) {
      Toast.error(
        "Error al crear la cuenta. Verifica que el usuario y email no estén en uso."
      );
      throw error;
    }
  },

  /**
   * Cierra sesión
   */
  logout() {
    AppState.setUser(null);
    Toast.info("Sesión cerrada");
    showPage("home");
    updateNavigation();
  },
};

/**
 * API específica para viajes
 */
const TravelAPI = {
  /**
   * Obtiene todos los viajes
   * @returns {Promise} Lista de viajes
   */
  async getAll() {
    const travels = await API.get(CONFIG.ENDPOINTS.TRAVELS.BASE);
    AppState.travels = travels;
    return travels;
  },

  /**
   * Obtiene un viaje por ID
   * @param {number} id - ID del viaje
   * @returns {Promise} Datos del viaje
   */
  async getById(id) {
    return await API.get(`${CONFIG.ENDPOINTS.TRAVELS.BASE}/${id}`);
  },

  /**
   * Crea un nuevo viaje
   * @param {object} travelData - Datos del viaje
   * @returns {Promise} Viaje creado
   */
  async create(travelData) {
    const travel = await API.post(CONFIG.ENDPOINTS.TRAVELS.CREATE, travelData);
    Toast.success("Viaje creado correctamente");
    return travel;
  },

  /**
   * Actualiza un viaje existente
   * @param {number} id - ID del viaje
   * @param {object} travelData - Datos actualizados del viaje
   * @returns {Promise} Viaje actualizado
   */
  async update(id, travelData) {
    const travel = await API.put(
      `${CONFIG.ENDPOINTS.TRAVELS.BASE}/update/${id}`,
      travelData
    );
    Toast.success("Viaje actualizado correctamente");
    return travel;
  },

  /**
   * Elimina un viaje
   * @param {number} id - ID del viaje
   * @returns {Promise} Resultado de la eliminación
   */
  async delete(id) {
    const result = await API.delete(`${CONFIG.ENDPOINTS.TRAVELS.DELETE}/${id}`);
    Toast.success("Viaje eliminado correctamente");
    return result;
  },

  /**
   * Filtra viajes por criterios
   * @param {object} filters - Filtros a aplicar
   * @returns {Promise} Lista de viajes filtrados
   */
  async filter(filters) {
    const params = new URLSearchParams();

    if (filters.destination) params.append("destination", filters.destination);
    if (filters.departureDate)
      params.append("departureDate", filters.departureDate);
    if (filters.arrivalDate) params.append("arrivalDate", filters.arrivalDate);
    if (filters.status) params.append("status", filters.status);

    const endpoint = `${
      CONFIG.ENDPOINTS.TRAVELS.BASE
    }/filter?${params.toString()}`;
    return await API.get(endpoint);
  },
};

/**
 * API específica para reservas
 */
const BookingAPI = {
  /**
   * Obtiene todas las reservas
   * @returns {Promise} Lista de reservas
   */
  async getAll() {
    return await API.get(CONFIG.ENDPOINTS.BOOKINGS.BASE);
  },

  /**
   * Obtiene las reservas de un usuario
   * @param {number} userId - ID del usuario
   * @returns {Promise} Lista de reservas del usuario
   */
  async getByUserId(userId) {
    try {
      return await API.get(`${CONFIG.ENDPOINTS.BOOKINGS.BY_USER}/${userId}`);
    } catch (error) {
      Toast.error("Error al cargar tus reservas");
      throw error;
    }
  },

  /**
   * Obtiene una reserva por ID
   * @param {number} id - ID de la reserva
   * @returns {Promise} Datos de la reserva
   */
  async getById(id) {
    try {
      return await API.get(`${CONFIG.ENDPOINTS.BOOKINGS.BASE}/${id}`);
    } catch (error) {
      Toast.error("Error al cargar la reserva");
      throw error;
    }
  },

  /**
   * Crea una nueva reserva
   * @param {object} bookingData - Datos de la reserva
   * @returns {Promise} Reserva creada
   */
  async create(bookingData) {
    try {
      const booking = await API.post(
        CONFIG.ENDPOINTS.BOOKINGS.CREATE,
        bookingData
      );
      Toast.success("Reserva creada correctamente");
      return booking;
    } catch (error) {
      Toast.error("Error al crear la reserva");
      throw error;
    }
  },

  /**
   * Actualiza el estado de una reserva
   * @param {number} id - ID de la reserva
   * @param {string} status - Nuevo estado
   * @returns {Promise} Reserva actualizada
   */
  async updateStatus(id, status) {
    try {
      const endpoint = CONFIG.ENDPOINTS.BOOKINGS.UPDATE_STATUS.replace(
        ":id",
        id
      );
      const booking = await API.patch(endpoint, { status });
      Toast.success("Estado de la reserva actualizado");
      return booking;
    } catch (error) {
      Toast.error("Error al actualizar la reserva");
      throw error;
    }
  },

  /**
   * Elimina una reserva
   * @param {number} id - ID de la reserva
   * @returns {Promise} Resultado de la eliminación
   */
  async delete(id) {
    try {
      const result = await API.delete(
        `${CONFIG.ENDPOINTS.BOOKINGS.DELETE}/${id}`
      );
      Toast.success("Reserva eliminada correctamente");
      return result;
    } catch (error) {
      Toast.error("Error al eliminar la reserva");
      throw error;
    }
  },

  /**
   * Filtra reservas por criterios
   * @param {object} filters - Filtros a aplicar
   * @returns {Promise} Lista de reservas filtradas
   */
  async filter(filters) {
    try {
      const params = new URLSearchParams();

      if (filters.status) params.append("status", filters.status);
      if (filters.userEmail) params.append("userEmail", filters.userEmail);
      if (filters.destination)
        params.append("destination", filters.destination);
      if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.append("dateTo", filters.dateTo);

      const endpoint = `${
        CONFIG.ENDPOINTS.BOOKINGS.BASE
      }/filter?${params.toString()}`;
      return await API.get(endpoint);
    } catch (error) {
      Toast.error("Error al filtrar reservas");
      throw error;
    }
  },
};

/**
 * API específica para pagos
 */
const PaymentAPI = {
  /**
   * Procesa un pago
   * @param {object} paymentData - Datos del pago
   * @returns {Promise} Resultado del pago
   */
  async processPayment(paymentData) {
    try {
      const payment = await API.post(
        CONFIG.ENDPOINTS.PAYMENTS.BASE,
        paymentData
      );
      Toast.success("Pago procesado correctamente");
      return payment;
    } catch (error) {
      Toast.error("Error al procesar el pago");
      throw error;
    }
  },

  /**
   * Obtiene el resumen de pago de una reserva
   * @param {number} bookingId - ID de la reserva
   * @returns {Promise} Resumen del pago
   */
  async getPaymentSummary(bookingId) {
    try {
      const endpoint = CONFIG.ENDPOINTS.PAYMENTS.SUMMARY.replace(
        ":bookingId",
        bookingId
      );
      return await API.get(endpoint);
    } catch (error) {
      Toast.error("Error al cargar el resumen de pago");
      throw error;
    }
  },

  /**
   * Obtiene todos los pagos
   * @returns {Promise} Lista de pagos
   */
  async getAll() {
    try {
      return await API.get(CONFIG.ENDPOINTS.PAYMENTS.BASE);
    } catch (error) {
      Toast.error("Error al cargar los pagos");
      throw error;
    }
  },

  /**
   * Filtra pagos por criterios
   * @param {object} filters - Filtros a aplicar
   * @returns {Promise} Lista de pagos filtrados
   */
  async filter(filters) {
    try {
      const params = new URLSearchParams();

      if (filters.userEmail) params.append("userEmail", filters.userEmail);
      if (filters.paymentMethod)
        params.append("paymentMethod", filters.paymentMethod);
      if (filters.minAmount) params.append("minAmount", filters.minAmount);
      if (filters.maxAmount) params.append("maxAmount", filters.maxAmount);
      if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.append("dateTo", filters.dateTo);

      const endpoint = `${
        CONFIG.ENDPOINTS.PAYMENTS.BASE
      }/filter?${params.toString()}`;
      return await API.get(endpoint);
    } catch (error) {
      Toast.error("Error al filtrar pagos");
      throw error;
    }
  },
};

// Exportar APIs para uso global
window.API = API;
window.AuthAPI = AuthAPI;
window.TravelAPI = TravelAPI;
window.BookingAPI = BookingAPI;
window.PaymentAPI = PaymentAPI;
