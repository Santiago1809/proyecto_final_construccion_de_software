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
 * Muestra las reservas en la vista de administrador agrupadas por viaje
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

  // Agrupar reservas por viaje
  const bookingsByTravel = groupBookingsByTravel(bookings);

  list.innerHTML = Object.entries(bookingsByTravel)
    .map(([travelId, travelBookings]) =>
      createTravelBookingsTable(travelBookings)
    )
    .join("");
}

/**
 * Agrupa las reservas por viaje
 * @param {Array} bookings - Lista de reservas
 * @returns {Object} Reservas agrupadas por ID de viaje
 */
function groupBookingsByTravel(bookings) {
  return bookings.reduce((groups, booking) => {
    const travelId = booking.travel?.id || "unknown";
    if (!groups[travelId]) {
      groups[travelId] = [];
    }
    groups[travelId].push(booking);
    return groups;
  }, {});
}

/**
 * Crea una tabla de reservas para un viaje específico
 * @param {Array} bookings - Lista de reservas del viaje
 * @returns {string} HTML de la tabla
 */
function createTravelBookingsTable(bookings) {
  if (!bookings || bookings.length === 0) return "";

  const travel = bookings[0].travel;
  const totalBookings = bookings.length;

  return `
    <div class="travel-bookings-group">
      <div class="travel-group-header">
        <div class="travel-info">
          <h3>${escapeHtml(travel?.destination || "Destino no disponible")}</h3>
          <p><i class="fas fa-calendar-alt"></i> ${formatDate(
            travel?.departureDate
          )} - ${formatDate(travel?.returnDate)}</p>
          <p><i class="fas fa-money-bill-wave"></i> ${formatCurrency(
            travel?.price
          )} | <i class="fas fa-users"></i> ${totalBookings} reservas</p>
        </div>
      </div>
      <div class="bookings-table-container">
        <table class="bookings-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Pagos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${bookings
              .map((booking) => createBookingTableRow(booking))
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/**
 * Crea una fila de la tabla para una reserva
 * @param {Object} booking - Datos de la reserva
 * @returns {string} HTML de la fila
 */
function createBookingTableRow(booking) {
  const statusClass = getBookingStatusClass(booking.status);
  const statusText = getBookingStatusText(booking.status);
  const totalPaid =
    booking.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

  return `
    <tr class="booking-row">
      <td class="booking-id">#${booking.id}</td>
      <td class="client-name">
        ${escapeHtml(booking.user?.name || "")} ${escapeHtml(
    booking.user?.surname || ""
  )}
      </td>
      <td class="client-email">${escapeHtml(
        booking.user?.email || "No disponible"
      )}</td>
      <td class="client-phone">${escapeHtml(
        booking.user?.phoneNumber || "No disponible"
      )}</td>
      <td class="booking-status">
        <span class="status-badge ${statusClass}">${statusText}</span>
      </td>
      <td class="payments-info">
        ${
          booking.payments && booking.payments.length > 0
            ? `<span class="payment-amount">${formatCurrency(
                totalPaid
              )}</span><br><small>${booking.payments.length} pago(s)</small>`
            : '<span class="no-payments">Sin pagos</span>'
        }
      </td>
      <td class="booking-actions">
        <button class="btn btn-sm btn-primary" onclick="showEditBookingModal(${
          booking.id
        })" title="Editar reserva">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-info" onclick="showBookingDetailsModal(${
          booking.id
        })" title="Ver detalles">
          <i class="fas fa-eye"></i>
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteBooking(${
          booking.id
        })" title="Eliminar reserva">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `;
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
 * Muestra el modal para editar una reserva
 * @param {number} bookingId - ID de la reserva
 */
async function showEditBookingModal(bookingId) {
  try {
    const booking = await BookingAPI.getById(bookingId);

    // Llenar el formulario con los datos existentes
    document.getElementById("edit-booking-id").value = booking.id;
    document.getElementById("edit-booking-status").value = booking.status;

    // Mostrar información del viaje y cliente
    document.getElementById("edit-booking-destination").textContent =
      booking.travel?.destination || "No disponible";
    document.getElementById("edit-booking-client").textContent =
      `${booking.user?.name || ""} ${booking.user?.surname || ""}`.trim() ||
      "No disponible";
    document.getElementById("edit-booking-email").textContent =
      booking.user?.email || "No disponible";
    document.getElementById("edit-booking-date").textContent = formatDate(
      booking.bookingDate
    );

    Modal.show("edit-booking-modal");
  } catch (error) {
    console.error("Error cargando datos de la reserva:", error);
    Toast.error("Error al cargar los datos de la reserva");
  }
}

/**
 * Muestra el modal con detalles completos de una reserva
 * @param {number} bookingId - ID de la reserva
 */
async function showBookingDetailsModal(bookingId) {
  try {
    const booking = await BookingAPI.getById(bookingId);

    const content = document.getElementById("booking-details-content");
    content.innerHTML = `
      <div class="booking-details-modal">
        <div class="detail-section">
          <h5><i class="fas fa-map-marker-alt"></i> Información del Viaje</h5>
          <p><strong>Destino:</strong> ${escapeHtml(
            booking.travel?.destination || "No disponible"
          )}</p>
          <p><strong>Salida:</strong> ${formatDate(
            booking.travel?.departureDate
          )}</p>
          <p><strong>Regreso:</strong> ${formatDate(
            booking.travel?.returnDate
          )}</p>
          <p><strong>Precio:</strong> ${formatCurrency(
            booking.travel?.price
          )}</p>
        </div>
        
        <div class="detail-section">
          <h5><i class="fas fa-user"></i> Información del Cliente</h5>
          <p><strong>Nombre:</strong> ${escapeHtml(
            booking.user?.name || ""
          )} ${escapeHtml(booking.user?.surname || "")}</p>
          <p><strong>Email:</strong> ${escapeHtml(
            booking.user?.email || "No disponible"
          )}</p>
          <p><strong>Teléfono:</strong> ${escapeHtml(
            booking.user?.phoneNumber || "No disponible"
          )}</p>
          <p><strong>Usuario:</strong> ${escapeHtml(
            booking.user?.username || "No disponible"
          )}</p>
        </div>
        
        <div class="detail-section">
          <h5><i class="fas fa-calendar-alt"></i> Información de la Reserva</h5>
          <p><strong>ID:</strong> #${booking.id}</p>
          <p><strong>Fecha de Reserva:</strong> ${formatDate(
            booking.bookingDate
          )}</p>
          <p><strong>Estado:</strong> <span class="status-badge ${getBookingStatusClass(
            booking.status
          )}">${getBookingStatusText(booking.status)}</span></p>
        </div>
        
        ${
          booking.payments && booking.payments.length > 0
            ? `
        <div class="detail-section">
          <h5><i class="fas fa-receipt"></i> Pagos (${
            booking.payments.length
          })</h5>
          ${booking.payments
            .map(
              (payment) => `
            <div class="payment-detail">
              <p><strong>Monto:</strong> ${formatCurrency(payment.amount)}</p>
              <p><strong>Fecha:</strong> ${formatDate(payment.paymentDate)}</p>
            </div>
          `
            )
            .join("")}
        </div>
        `
            : ""
        }
      </div>
    `;

    Modal.show("booking-details-modal");
  } catch (error) {
    console.error("Error cargando detalles de la reserva:", error);
    Toast.error("Error al cargar los detalles de la reserva");
  }
}

/**
 * Guarda los cambios de una reserva editada
 */
async function saveBookingChanges() {
  try {
    const bookingId = parseInt(
      document.getElementById("edit-booking-id").value
    );
    const newStatus = document.getElementById("edit-booking-status").value;

    await BookingAPI.updateStatus(bookingId, newStatus);

    Modal.hide();
    Toast.success("Reserva actualizada exitosamente");

    // Recargar las reservas
    loadAdminBookings();
  } catch (error) {
    console.error("Error actualizando reserva:", error);
    Toast.error("Error al actualizar la reserva");
  }
}

/**
 * Inicializa el formulario de edición de reserva
 */
function initEditBookingForm() {
  const form = document.getElementById("edit-booking-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await saveBookingChanges();
  });
}

/**
 * Inicializa el módulo de reservas
 */
function initBookings() {
  initBookingForm();
  initEditBookingForm();
}

// Exportar funciones para uso global
window.showBookingModal = showBookingModal;
window.loadMyBookings = loadMyBookings;
window.loadAdminBookings = loadAdminBookings;
window.cancelBooking = cancelBooking;
window.updateBookingStatus = updateBookingStatus;
window.deleteBooking = deleteBooking;
window.showEditBookingModal = showEditBookingModal;
window.showBookingDetailsModal = showBookingDetailsModal;
window.saveBookingChanges = saveBookingChanges;
window.applyBookingFilters = applyBookingFilters;
window.clearBookingFilters = clearBookingFilters;
window.initBookings = initBookings;

/**
 * Aplica filtros para reservas
 */
async function applyBookingFilters() {
  try {
    const filters = {
      status: document.getElementById("booking-status-filter")?.value || null,
      userEmail:
        document.getElementById("booking-user-filter")?.value?.trim() || null,
      destination:
        document.getElementById("booking-destination-filter")?.value?.trim() ||
        null,
      dateFrom:
        document.getElementById("booking-date-from-filter")?.value || null,
      dateTo: document.getElementById("booking-date-to-filter")?.value || null,
    };

    // Remover filtros vacíos
    Object.keys(filters).forEach((key) => {
      if (!filters[key]) delete filters[key];
    });

    let bookings;
    if (Object.keys(filters).length > 0) {
      bookings = await BookingAPI.filter(filters);
    } else {
      bookings = await BookingAPI.getAll();
    }

    displayAdminBookings(bookings);
  } catch (error) {
    console.error("Error al aplicar filtros de reservas:", error);
    Toast.error("Error al filtrar reservas");
  }
}

/**
 * Limpia todos los filtros de reservas
 */
async function clearBookingFilters() {
  document.getElementById("booking-status-filter").value = "";
  document.getElementById("booking-user-filter").value = "";
  document.getElementById("booking-destination-filter").value = "";
  document.getElementById("booking-date-from-filter").value = "";
  document.getElementById("booking-date-to-filter").value = "";

  await loadAdminBookings();
}
