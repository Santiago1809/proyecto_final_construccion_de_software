// Módulo de gestión de pagos

/**
 * Muestra el modal de pago para una reserva
 * @param {number} bookingId - ID de la reserva
 */
async function showPaymentModal(bookingId) {
  try {
    // Cargar resumen de pago
    const summary = await PaymentAPI.getPaymentSummary(bookingId);

    // Establecer el ID de la reserva en el formulario
    document.getElementById("payment-booking-id").value = bookingId;

    // Calcular monto pendiente y establecerlo como valor por defecto
    const pendingAmount =
      (summary.totalAmount || 0) - (summary.paidAmount || 0);
    const amountInput = document.getElementById("payment-amount");
    if (amountInput && pendingAmount > 0) {
      amountInput.value = pendingAmount.toFixed(2);
      amountInput.max = pendingAmount.toFixed(2); // Establecer el máximo permitido
    }

    // Mostrar resumen de pago
    displayPaymentSummary(summary);

    Modal.show("payment-modal");
  } catch (error) {
    console.error("Error cargando resumen de pago:", error);
    Toast.error("Error al cargar la información de pago");
  }
}

/**
 * Muestra el resumen de pago
 * @param {Object} summary - Resumen del pago
 */
function displayPaymentSummary(summary) {
  const container = document.getElementById("payment-summary");
  if (!container) return;

  container.innerHTML = `
        <h4>Resumen del Pago</h4>
        <div class="summary-row">
            <span>Destino:</span>
            <span>${escapeHtml(summary.destination || "No disponible")}</span>
        </div>
        <div class="summary-row">
            <span>Fechas:</span>
            <span>${formatDate(summary.departureDate)} - ${formatDate(
    summary.returnDate
  )}</span>
        </div>
        <div class="summary-row">
            <span>Precio base:</span>
            <span>${formatCurrency(
              summary.baseAmount || summary.totalAmount
            )}</span>
        </div>
        ${
          summary.taxes
            ? `
            <div class="summary-row">
                <span>Impuestos:</span>
                <span>${formatCurrency(summary.taxes)}</span>
            </div>
        `
            : ""
        }
        ${
          summary.fees
            ? `
            <div class="summary-row">
                <span>Tasas:</span>
                <span>${formatCurrency(summary.fees)}</span>
            </div>
        `
            : ""
        }
        <div class="summary-row">
            <span><strong>Total a pagar:</strong></span>
            <span><strong>${formatCurrency(summary.totalAmount)}</strong></span>
        </div>
    `;
}

/**
 * Inicializa el formulario de pago
 */
function initPaymentForm() {
  const form = document.getElementById("payment-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validar formulario
    const validation = FormValidator.validateForm("payment-form");
    if (!validation.isValid) {
      validation.errors.forEach((error) => Toast.error(error));
      return;
    }

    // Obtener datos del formulario
    const formData = new FormData(form);
    const bookingId = parseInt(
      document.getElementById("payment-booking-id").value
    );
    const paymentMethod = formData.get("paymentMethod");
    const amount = parseFloat(formData.get("amount"));

    const paymentData = {
      bookingId: bookingId,
      paymentMethod: paymentMethod,
      amount: amount,
    };

    try {
      const payment = await PaymentAPI.processPayment(paymentData);

      Modal.hide();
      form.reset();

      Toast.success("¡Pago procesado exitosamente!");

      // Recargar las reservas para mostrar el estado actualizado
      if (AppState.isAdmin()) {
        loadAdminBookings();
      } else {
        loadMyBookings();
      }
    } catch (error) {
      console.error("Error procesando pago:", error);
    }
  });
}

/**
 * Carga los pagos para la vista de administrador
 */
async function loadAdminPayments() {
  try {
    // Como no hay un endpoint específico para listar todos los pagos,
    // podemos obtener esta información a través de las reservas
    const bookings = await BookingAPI.getAll();
    const paymentsData = extractPaymentsFromBookings(bookings);
    displayAdminPayments(paymentsData);
  } catch (error) {
    console.error("Error cargando pagos para admin:", error);
    document.getElementById("admin-payments-list").innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-exclamation-triangle text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600">Error al cargar los pagos. Intenta de nuevo más tarde.</p>
            </div>
        `;
  }
}

/**
 * Extrae información de pagos de las reservas
 * @param {Array} bookings - Lista de reservas
 * @returns {Array} Lista de pagos
 */
function extractPaymentsFromBookings(bookings) {
  const payments = [];

  bookings.forEach((booking) => {
    if (booking.paymentInfo) {
      payments.push({
        id: booking.paymentInfo.id,
        bookingId: booking.id,
        amount: booking.paymentInfo.amount,
        paymentMethod: booking.paymentInfo.paymentMethod,
        paymentDate: booking.paymentInfo.paymentDate,
        status: booking.paymentInfo.status,
        booking: booking,
      });
    }
  });

  // Ordenar por fecha de pago (más recientes primero)
  return payments.sort(
    (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
  );
}

/**
 * Muestra los pagos en la vista de administrador
 * @param {Array} payments - Lista de pagos
 */
function displayAdminPayments(payments) {
  const list = document.getElementById("admin-payments-list");
  if (!list) return;

  if (!payments || payments.length === 0) {
    list.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-credit-card text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600">No hay pagos registrados.</p>
            </div>
        `;
    return;
  }

  list.innerHTML = `
        <div class="payments-stats">
            ${generatePaymentStats(payments)}
        </div>
        <div class="payments-table">
            ${payments.map((payment) => createPaymentCard(payment)).join("")}
        </div>
    `;
}

/**
 * Genera estadísticas de pagos
 * @param {Array} payments - Lista de pagos
 * @returns {string} HTML de las estadísticas
 */
function generatePaymentStats(payments) {
  const totalAmount = payments.reduce(
    (sum, payment) => sum + (payment.amount || 0),
    0
  );
  const totalPayments = payments.length;
  const paymentMethods = {};

  payments.forEach((payment) => {
    const method = payment.paymentMethod || "Desconocido";
    paymentMethods[method] = (paymentMethods[method] || 0) + 1;
  });

  return `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${totalPayments}</div>
                <div class="stat-label">Total Pagos</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${formatCurrency(totalAmount)}</div>
                <div class="stat-label">Ingresos Totales</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${formatCurrency(
                  totalAmount / Math.max(totalPayments, 1)
                )}</div>
                <div class="stat-label">Promedio por Pago</div>
            </div>
        </div>
    `;
}

/**
 * Crea una tarjeta de pago
 * @param {Object} payment - Datos del pago
 * @returns {string} HTML de la tarjeta
 */
function createPaymentCard(payment) {
  const methodIcon = getPaymentMethodIcon(payment.paymentMethod);
  const statusClass = payment.status === "COMPLETED" ? "confirmed" : "pending";

  return `
        <div class="payment-card admin-item">
            <div class="admin-item-info">
                <h4>
                    <i class="${methodIcon}"></i>
                    Pago #${payment.id}
                </h4>
                <div class="admin-item-meta">
                    <span><i class="fas fa-calendar"></i> ${formatDateTime(
                      payment.paymentDate
                    )}</span>
                    <span><i class="fas fa-money-bill"></i> ${formatCurrency(
                      payment.amount
                    )}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(
                      payment.booking?.travel?.destination ||
                        "Destino no disponible"
                    )}</span>
                    <span><i class="fas fa-user"></i> ${escapeHtml(
                      payment.booking?.user?.name || "Usuario no disponible"
                    )} ${escapeHtml(
    payment.booking?.user?.surname || ""
  )}</span>
                </div>
            </div>
            <div class="admin-item-actions">
                <span class="booking-status ${statusClass}">
                    ${
                      payment.status === "COMPLETED"
                        ? "Completado"
                        : "Pendiente"
                    }
                </span>
            </div>
        </div>
    `;
}

/**
 * Obtiene el icono para el método de pago
 * @param {string} method - Método de pago
 * @returns {string} Clase del icono
 */
function getPaymentMethodIcon(method) {
  const icons = {
    CREDIT_CARD: "fas fa-credit-card",
    DEBIT_CARD: "fas fa-credit-card",
    BANK_TRANSFER: "fas fa-university",
    CASH: "fas fa-money-bill-alt",
  };
  return icons[method] || "fas fa-credit-card";
}

/**
 * Obtiene el texto legible para el método de pago
 * @param {string} method - Método de pago
 * @returns {string} Texto del método
 */
function getPaymentMethodText(method) {
  const texts = {
    CREDIT_CARD: "Tarjeta de Crédito",
    DEBIT_CARD: "Tarjeta de Débito",
    BANK_TRANSFER: "Transferencia Bancaria",
    CASH: "Efectivo",
  };
  return texts[method] || method;
}

/**
 * Inicializa el módulo de pagos
 */
function initPayments() {
  initPaymentForm();
}

// Exportar funciones para uso global
window.showPaymentModal = showPaymentModal;
window.loadAdminPayments = loadAdminPayments;
window.initPayments = initPayments;
