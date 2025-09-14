// Módulo de gestión de reservas

/**
 * Muestra el modal para crear una reserva
 * @param {number} travelId - ID del viaje
 */
function showBookingModal(travelId) {
  const modal = document.getElementById("booking-modal");
  const travelIdInput = document.getElementById("booking-travel-id");

  if (travelIdInput) {
    travelIdInput.value = travelId;
  }

  Modal.show("booking-modal");
}

/**
 * Inicializa el formulario de reserva
 */
function initBookingForm() {
  const form = document.getElementById("booking-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Verificar que el usuario esté logueado
    const user = AppState.getUser();
    if (!user) {
      Toast.error("Debes iniciar sesión para hacer una reserva");
      Modal.hide();
      showPage("login");
      return;
    }

    // Validar formulario
    const validation = FormValidator.validateForm("booking-form");
    if (!validation.isValid) {
      validation.errors.forEach((error) => Toast.error(error));
      return;
    }

    // Obtener datos del formulario
    const formData = new FormData(form);
    const bookingData = {
      travelId: parseInt(
        formData.get("travelId") ||
          document.getElementById("booking-travel-id").value
      ),
      userId: user.id,
      status: CONFIG.BOOKING_STATUSES.PENDING,
    };

    try {
      const booking = await BookingAPI.create(bookingData);
      Modal.hide();
      form.reset();

      Toast.success("¡Reserva creada exitosamente!");

      // Redirigir directamente al pago de la reserva recién creada
      showPaymentModal(booking.id);
    } catch (error) {
      console.error("Error creando reserva:", error);
    }
  });
}

/**
 * Carga las reservas del usuario actual
 */
async function loadMyBookings() {
  const user = AppState.getUser();
  if (!user) {
    showPage("login");
    return;
  }

  try {
    const bookings = await BookingAPI.getByUserId(user.id);
    displayMyBookings(bookings);
  } catch (error) {
    console.error("Error cargando reservas del usuario:", error);
    document.getElementById("my-bookings-list").innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-exclamation-triangle text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600">Error al cargar tus reservas. Intenta de nuevo más tarde.</p>
            </div>
        `;
  }
}

/**
 * Muestra las reservas del usuario
 * @param {Array} bookings - Lista de reservas
 */
function displayMyBookings(bookings) {
  const list = document.getElementById("my-bookings-list");
  if (!list) return;

  if (!bookings || bookings.length === 0) {
    list.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-suitcase text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600">No tienes reservas aún.</p>
                <button class="primary-button mt-4" onclick="event.preventDefault(); showPage('travels')">>
                    <i class="fas fa-search"></i>
                    Explorar Destinos
                </button>
            </div>
        `;
    return;
  }

  list.innerHTML = bookings
    .map((booking) => createBookingCard(booking, false))
    .join("");
}

/**
 * Carga todas las reservas para administradores
 */
async function loadAdminBookings() {
  try {
    const bookings = await BookingAPI.getAll();
    displayAdminBookings(bookings);
  } catch (error) {
    console.error("Error cargando reservas para admin:", error);
  }
}

/**
 * Muestra las reservas en la vista de administrador
 * @param {Array} bookings - Lista de reservas
 */
function displayAdminBookings(bookings) {
  const list = document.getElementById("admin-bookings-list");
  if (!list) return;

  if (!bookings || bookings.length === 0) {
    list.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-calendar-times text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600">No hay reservas registradas.</p>
            </div>
        `;
    return;
  }

  list.innerHTML = bookings
    .map((booking) => createBookingCard(booking, true))
    .join("");
}

/**
 * Crea una tarjeta de reserva
 * @param {Object} booking - Datos de la reserva
 * @param {boolean} isAdmin - Si es vista de administrador
 * @returns {string} HTML de la tarjeta
 */
function createBookingCard(booking, isAdmin = false) {
  const statusClass = getBookingStatusClass(booking.status);
  const statusText = getBookingStatusText(booking.status);

  return `
        <div class="booking-card">
            <div class="booking-header">
                <div class="booking-info">
                    <h3>
                        ${escapeHtml(
                          booking.travel?.destination || "Destino no disponible"
                        )}
                        ${
                          isAdmin && booking.user
                            ? ` - ${escapeHtml(booking.user.name)} ${escapeHtml(
                                booking.user.surname
                              )}`
                            : ""
                        }
                    </h3>
                    <div class="booking-date">
                        <i class="fas fa-calendar-alt"></i>
                        <span>Reservado: ${formatDate(
                          booking.bookingDate
                        )}</span>
                        ${
                          isAdmin
                            ? `<span class="booking-id">ID: #${booking.id}</span>`
                            : ""
                        }
                    </div>
                </div>
                <div class="booking-status ${statusClass}">
                    ${statusText}
                </div>
            </div>
            <div class="booking-details">
                ${
                  booking.travel
                    ? `
                    <div class="booking-detail">
                        <i class="fas fa-plane-departure"></i>
                        <span>Salida: ${formatDate(
                          booking.travel.departureDate
                        )}</span>
                    </div>
                    <div class="booking-detail">
                        <i class="fas fa-plane-arrival"></i>
                        <span>Regreso: ${formatDate(
                          booking.travel.returnDate
                        )}</span>
                    </div>
                    <div class="booking-detail">
                        <i class="fas fa-money-bill-wave"></i>
                        <span>Precio: ${formatCurrency(
                          booking.travel.price
                        )}</span>
                    </div>
                    ${
                      !isAdmin && booking.travel.itinerary
                        ? `
                    <div class="booking-detail itinerary-detail">
                        <i class="fas fa-map-marked-alt"></i>
                        <span>Itinerario: ${escapeHtml(
                          booking.travel.itinerary.substring(0, 100)
                        )}${
                            booking.travel.itinerary.length > 100 ? "..." : ""
                          }</span>
                    </div>
                    `
                        : ""
                    }
                `
                    : ""
                }
                ${
                  isAdmin && booking.user
                    ? `
                    <div class="booking-detail">
                        <i class="fas fa-user"></i>
                        <span>Cliente: ${escapeHtml(
                          booking.user.name
                        )} ${escapeHtml(booking.user.surname)}</span>
                    </div>
                    <div class="booking-detail">
                        <i class="fas fa-envelope"></i>
                        <span>${escapeHtml(booking.user.email)}</span>
                    </div>
                    <div class="booking-detail">
                        <i class="fas fa-phone"></i>
                        <span>${escapeHtml(
                          booking.user.phoneNumber || "No disponible"
                        )}</span>
                    </div>
                    <div class="booking-detail">
                        <i class="fas fa-id-card"></i>
                        <span>Usuario: ${escapeHtml(
                          booking.user.username
                        )}</span>
                    </div>
                `
                    : ""
                }
            </div>
            ${
              isAdmin && booking.payments && booking.payments.length > 0
                ? `
                <div class="booking-payments">
                    <h5><i class="fas fa-receipt"></i> Pagos (${
                      booking.payments.length
                    })</h5>
                    <div class="payments-list">
                        ${booking.payments
                          .map(
                            (payment) => `
                            <div class="payment-item">
                                <span><i class="fas fa-money-bill"></i> ${formatCurrency(
                                  payment.amount
                                )}</span>
                                <span><i class="fas fa-calendar"></i> ${formatDate(
                                  payment.paymentDate
                                )}</span>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                </div>
            `
                : ""
            }
            <div class="booking-actions">
                ${
                  !isAdmin && booking.status === CONFIG.BOOKING_STATUSES.PENDING
                    ? `
                    <button class="danger-button" onclick="cancelBooking(${booking.id})">
                        <i class="fas fa-times"></i>
                        Cancelar
                    </button>
                `
                    : ""
                }
                ${
                  !isAdmin &&
                  booking.status !== CONFIG.BOOKING_STATUSES.PAID &&
                  booking.status !== CONFIG.BOOKING_STATUSES.CONFIRMED &&
                  booking.status !== CONFIG.BOOKING_STATUSES.CANCELLED &&
                  booking.status !== CONFIG.BOOKING_STATUSES.REJECTED &&
                  booking.status !== CONFIG.BOOKING_STATUSES.REFUNDED &&
                  booking.status !== CONFIG.BOOKING_STATUSES.NO_SHOW
                    ? `
                    <button class="primary-button" onclick="showPaymentModal(${booking.id})">
                        <i class="fas fa-credit-card"></i>
                        Pagar
                    </button>
                `
                    : ""
                }
                ${
                  booking.paymentInfo
                    ? `
                    <span class="text-success">
                        <i class="fas fa-check-circle"></i>
                        Pagado
                    </span>
                `
                    : ""
                }
                ${
                  isAdmin
                    ? `
                    <select onchange="updateBookingStatus(${
                      booking.id
                    }, this.value)" class="form-select">
                        <option value="${CONFIG.BOOKING_STATUSES.PENDING}" ${
                        booking.status === CONFIG.BOOKING_STATUSES.PENDING
                          ? "selected"
                          : ""
                      }>Pendiente</option>
                        <option value="${CONFIG.BOOKING_STATUSES.CONFIRMED}" ${
                        booking.status === CONFIG.BOOKING_STATUSES.CONFIRMED
                          ? "selected"
                          : ""
                      }>Confirmada</option>
                        <option value="${CONFIG.BOOKING_STATUSES.CANCELLED}" ${
                        booking.status === CONFIG.BOOKING_STATUSES.CANCELLED
                          ? "selected"
                          : ""
                      }>Cancelada</option>
                        <option value="${CONFIG.BOOKING_STATUSES.REJECTED}" ${
                        booking.status === CONFIG.BOOKING_STATUSES.REJECTED
                          ? "selected"
                          : ""
                      }>Rechazada</option>
                        <option value="${CONFIG.BOOKING_STATUSES.ON_HOLD}" ${
                        booking.status === CONFIG.BOOKING_STATUSES.ON_HOLD
                          ? "selected"
                          : ""
                      }>En Espera</option>
                        <option value="${CONFIG.BOOKING_STATUSES.REFUNDED}" ${
                        booking.status === CONFIG.BOOKING_STATUSES.REFUNDED
                          ? "selected"
                          : ""
                      }>Reembolsada</option>
                        <option value="${CONFIG.BOOKING_STATUSES.NO_SHOW}" ${
                        booking.status === CONFIG.BOOKING_STATUSES.NO_SHOW
                          ? "selected"
                          : ""
                      }>No se Presentó</option>
                        <option value="${CONFIG.BOOKING_STATUSES.PAID}" ${
                        booking.status === CONFIG.BOOKING_STATUSES.PAID
                          ? "selected"
                          : ""
                      }>Pagada</option>
                    </select>
                    <button class="danger-button" onclick="deleteBooking(${
                      booking.id
                    })">
                        <i class="fas fa-trash"></i>
                        Eliminar
                    </button>
                `
                    : ""
                }
            </div>
        </div>
    `;
}

/**
 * Obtiene la clase CSS para el estado de la reserva
 * @param {string} status - Estado de la reserva
 * @returns {string} Clase CSS
 */
function getBookingStatusClass(status) {
  const classes = {
    [CONFIG.BOOKING_STATUSES.PENDING]: "pending",
    [CONFIG.BOOKING_STATUSES.CONFIRMED]: "confirmed",
    [CONFIG.BOOKING_STATUSES.CANCELLED]: "cancelled",
    [CONFIG.BOOKING_STATUSES.REJECTED]: "rejected",
    [CONFIG.BOOKING_STATUSES.ON_HOLD]: "on-hold",
    [CONFIG.BOOKING_STATUSES.REFUNDED]: "refunded",
    [CONFIG.BOOKING_STATUSES.NO_SHOW]: "no-show",
    [CONFIG.BOOKING_STATUSES.PAID]: "paid",
  };
  return classes[status] || "pending";
}

/**
 * Obtiene el texto legible para el estado de la reserva
 * @param {string} status - Estado de la reserva
 * @returns {string} Texto del estado
 */
function getBookingStatusText(status) {
  const texts = {
    [CONFIG.BOOKING_STATUSES.PENDING]: "Pendiente",
    [CONFIG.BOOKING_STATUSES.CONFIRMED]: "Confirmada",
    [CONFIG.BOOKING_STATUSES.CANCELLED]: "Cancelada",
    [CONFIG.BOOKING_STATUSES.REJECTED]: "Rechazada",
    [CONFIG.BOOKING_STATUSES.ON_HOLD]: "En Espera",
    [CONFIG.BOOKING_STATUSES.REFUNDED]: "Reembolsada",
    [CONFIG.BOOKING_STATUSES.NO_SHOW]: "No se Presentó",
    [CONFIG.BOOKING_STATUSES.PAID]: "Pagada",
  };
  return texts[status] || "Desconocido";
}

/**
 * Cancela una reserva
 * @param {number} bookingId - ID de la reserva
 */
async function cancelBooking(bookingId) {
  if (!confirm("¿Estás seguro de que quieres cancelar esta reserva?")) {
    return;
  }

  try {
    await BookingAPI.updateStatus(bookingId, CONFIG.BOOKING_STATUSES.CANCELLED);
    loadMyBookings(); // Recargar la lista
  } catch (error) {
    console.error("Error cancelando reserva:", error);
  }
}

/**
 * Actualiza el estado de una reserva (solo admin)
 * @param {number} bookingId - ID de la reserva
 * @param {string} newStatus - Nuevo estado
 */
async function updateBookingStatus(bookingId, newStatus) {
  try {
    await BookingAPI.updateStatus(bookingId, newStatus);
    Toast.success("Estado de la reserva actualizado");
    loadAdminBookings(); // Recargar la lista
  } catch (error) {
    console.error("Error actualizando estado de reserva:", error);
    loadAdminBookings(); // Recargar para revertir el cambio visual
  }
}

/**
 * Elimina una reserva (solo admin)
 * @param {number} bookingId - ID de la reserva
 */
async function deleteBooking(bookingId) {
  if (!confirm("¿Estás seguro de que quieres eliminar esta reserva?")) {
    return;
  }

  try {
    await BookingAPI.delete(bookingId);
    loadAdminBookings(); // Recargar la lista
  } catch (error) {
    console.error("Error eliminando reserva:", error);
  }
}

/**
 * Inicializa el módulo de reservas
 */
function initBookings() {
  initBookingForm();
}

// Exportar funciones para uso global
window.showBookingModal = showBookingModal;
window.loadMyBookings = loadMyBookings;
window.loadAdminBookings = loadAdminBookings;
window.cancelBooking = cancelBooking;
window.updateBookingStatus = updateBookingStatus;
window.deleteBooking = deleteBooking;
window.initBookings = initBookings;
