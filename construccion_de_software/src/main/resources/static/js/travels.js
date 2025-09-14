// Módulo de gestión de viajes

/**
 * Carga y muestra todos los viajes
 */
async function loadTravels() {
  try {
    const travels = await TravelAPI.getAll();
    displayTravels(travels);
  } catch (error) {
    console.error("Error cargando viajes:", error);
    document.getElementById("travels-grid").innerHTML = `
            <div class="col-span-full text-center py-8">
                <i class="fas fa-exclamation-triangle text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600">Error al cargar los viajes. Intenta de nuevo más tarde.</p>
            </div>
        `;
  }
}

/**
 * Muestra los viajes en la grilla
 * @param {Array} travels - Lista de viajes
 */
function displayTravels(travels) {
  const grid = document.getElementById("travels-grid");
  if (!grid) return;

  if (!travels || travels.length === 0) {
    grid.innerHTML = `
            <div class="col-span-full text-center py-8">
                <i class="fas fa-suitcase-rolling text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600">No hay viajes disponibles en este momento.</p>
            </div>
        `;
    return;
  }

  grid.innerHTML = travels.map((travel) => createTravelCard(travel)).join("");
}

/**
 * Crea una tarjeta de viaje
 * @param {Object} travel - Datos del viaje
 * @returns {string} HTML de la tarjeta
 */
function createTravelCard(travel) {
  const isLoggedIn = AppState.isLoggedIn();
  const isAdmin = AppState.isAdmin();

  return `
        <div class="travel-card">
            <div class="travel-card-header">
                <h3>${escapeHtml(travel.destination)}</h3>
                <div class="travel-dates">
                    <i class="fas fa-calendar-alt"></i>
                    <span>${formatDate(travel.departureDate)} - ${formatDate(
    travel.returnDate
  )}</span>
                </div>
            </div>
            <div class="travel-card-body">
                <div class="travel-price">${formatCurrency(travel.price)}</div>
                <div class="travel-itinerary">${escapeHtml(
                  travel.itinerary || "Itinerario no disponible"
                )}</div>
                <div class="travel-actions">
                    <button class="secondary-button" onclick="showTravelDetails(${
                      travel.id
                    })">
                        <i class="fas fa-info-circle"></i>
                        Ver Detalles
                    </button>
                    ${
                      isLoggedIn && !isAdmin
                        ? `
                        <button class="primary-button" onclick="showBookingModal(${travel.id})">
                            <i class="fas fa-ticket-alt"></i>
                            Reservar
                        </button>
                    `
                        : ""
                    }
                    ${
                      isAdmin
                        ? `
                        <button class="danger-button" onclick="deleteTravel(${travel.id})">
                            <i class="fas fa-trash"></i>
                            Eliminar
                        </button>
                    `
                        : ""
                    }
                </div>
            </div>
        </div>
    `;
}

/**
 * Muestra los detalles de un viaje en un modal
 * @param {number} travelId - ID del viaje
 */
async function showTravelDetails(travelId) {
  try {
    const travel = await TravelAPI.getById(travelId);
    const content = document.getElementById("travel-detail-content");

    content.innerHTML = `
            <div class="travel-detail">
                <h4>${escapeHtml(travel.destination)}</h4>
                <div class="detail-section">
                    <h5><i class="fas fa-calendar-alt"></i> Fechas</h5>
                    <p><strong>Salida:</strong> ${formatDate(
                      travel.departureDate
                    )}</p>
                    <p><strong>Regreso:</strong> ${formatDate(
                      travel.returnDate
                    )}</p>
                </div>
                <div class="detail-section">
                    <h5><i class="fas fa-money-bill-wave"></i> Precio</h5>
                    <p class="text-2xl font-bold text-primary">${formatCurrency(
                      travel.price
                    )}</p>
                </div>
                <div class="detail-section">
                    <h5><i class="fas fa-map-marked-alt"></i> Itinerario</h5>
                    <p class="whitespace-pre-line">${escapeHtml(
                      travel.itinerary || "Itinerario no disponible"
                    )}</p>
                </div>
                ${
                  AppState.isAdmin() &&
                  travel.bookings &&
                  travel.bookings.length > 0
                    ? `
                    <div class="detail-section">
                        <h5><i class="fas fa-users"></i> Usuarios que han reservado (${
                          travel.bookings.length
                        })</h5>
                        <div class="bookings-list">
                            ${travel.bookings
                              .map(
                                (booking) => `
                                <div class="booking-user-card">
                                    <div class="user-info">
                                        <strong>${escapeHtml(
                                          booking.user?.name || ""
                                        )} ${escapeHtml(
                                  booking.user?.surname || ""
                                )}</strong>
                                        <small>${escapeHtml(
                                          booking.user?.email || ""
                                        )}</small>
                                        <span class="booking-status status-${booking.status?.toLowerCase()}">${escapeHtml(
                                  booking.status || ""
                                )}</span>
                                    </div>
                                </div>
                            `
                              )
                              .join("")}
                        </div>
                    </div>
                `
                    : ""
                }
                ${
                  AppState.isLoggedIn() && !AppState.isAdmin()
                    ? `
                    <div class="detail-actions">
                        <button class="primary-button" onclick="closeModal(); showBookingModal(${travel.id});">
                            <i class="fas fa-ticket-alt"></i>
                            Reservar Ahora
                        </button>
                    </div>
                `
                    : ""
                }
            </div>
        `;

    Modal.show("travel-detail-modal");
  } catch (error) {
    console.error("Error cargando detalles del viaje:", error);
  }
}

/**
 * Configura la búsqueda de viajes
 */
function initTravelSearch() {
  const searchInput = document.getElementById("travel-search");
  if (!searchInput) return;

  const debouncedSearch = debounce((query) => {
    filterTravels(query);
  }, 300);

  searchInput.addEventListener("input", (e) => {
    debouncedSearch(e.target.value);
  });
}

/**
 * Filtra los viajes según la búsqueda
 * @param {string} query - Término de búsqueda
 */
function filterTravels(query) {
  const travels = AppState.travels || [];

  if (!query.trim()) {
    displayTravels(travels);
    return;
  }

  const filteredTravels = travels.filter(
    (travel) =>
      travel.destination.toLowerCase().includes(query.toLowerCase()) ||
      (travel.itinerary &&
        travel.itinerary.toLowerCase().includes(query.toLowerCase()))
  );

  displayTravels(filteredTravels);
}

/**
 * Elimina un viaje (solo admin)
 * @param {number} travelId - ID del viaje
 */
async function deleteTravel(travelId) {
  if (!confirm("¿Estás seguro de que quieres eliminar este viaje?")) {
    return;
  }

  try {
    await TravelAPI.delete(travelId);
    loadTravels(); // Recargar la lista
    loadAdminTravels(); // Recargar la lista de admin si está abierta
  } catch (error) {
    console.error("Error eliminando viaje:", error);
  }
}

/**
 * Carga los viajes para la vista de administrador
 */
async function loadAdminTravels() {
  try {
    const travels = await TravelAPI.getAll();
    displayAdminTravels(travels);
  } catch (error) {
    console.error("Error cargando viajes para admin:", error);
  }
}

/**
 * Muestra los viajes en la vista de administrador
 * @param {Array} travels - Lista de viajes
 */
function displayAdminTravels(travels) {
  const list = document.getElementById("admin-travels-list");
  if (!list) return;

  if (!travels || travels.length === 0) {
    list.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-suitcase-rolling text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600">No hay viajes registrados.</p>
            </div>
        `;
    return;
  }

  list.innerHTML = travels
    .map(
      (travel) => `
        <div class="admin-item">
            <div class="admin-item-info">
                <h4>${escapeHtml(travel.destination)}</h4>
                <div class="admin-item-meta">
                    <span><i class="fas fa-calendar"></i> ${formatDate(
                      travel.departureDate
                    )} - ${formatDate(travel.returnDate)}</span>
                    <span><i class="fas fa-money-bill"></i> ${formatCurrency(
                      travel.price
                    )}</span>
                    <span><i class="fas fa-ticket-alt"></i> ${
                      travel.bookings ? travel.bookings.length : 0
                    } reservas</span>
                </div>
            </div>
            <div class="admin-item-actions">
                <button class="secondary-button" onclick="showTravelDetails(${
                  travel.id
                })">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="primary-button" onclick="showEditTravelModal(${
                  travel.id
                })">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="danger-button" onclick="deleteTravel(${
                  travel.id
                })">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `
    )
    .join("");
}

/**
 * Muestra el modal para crear un nuevo viaje
 */
function showCreateTravelModal() {
  Modal.show("create-travel-modal");
}

/**
 * Inicializa el formulario de crear viaje
 */
function initCreateTravelForm() {
  const form = document.getElementById("create-travel-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validar formulario
    const validation = FormValidator.validateForm("create-travel-form");
    if (!validation.isValid) {
      validation.errors.forEach((error) => Toast.error(error));
      return;
    }

    // Obtener datos del formulario
    const formData = new FormData(form);
    const travelData = {
      destination: formData.get("destination"),
      departureDate: formData.get("departureDate"),
      returnDate: formData.get("returnDate"),
      price: parseFloat(formData.get("price")),
      itinerary: formData.get("itinerary"),
    };

    // Validar fechas
    const departureDate = new Date(travelData.departureDate);
    const returnDate = new Date(travelData.returnDate);
    const today = new Date();

    if (departureDate <= today) {
      Toast.error("La fecha de salida debe ser posterior a hoy");
      return;
    }

    if (returnDate <= departureDate) {
      Toast.error(
        "La fecha de regreso debe ser posterior a la fecha de salida"
      );
      return;
    }

    try {
      await TravelAPI.create(travelData);
      Modal.hide();
      form.reset();
      loadAdminTravels();
      loadTravels(); // También actualizar la vista pública
    } catch (error) {
      console.error("Error creando viaje:", error);
    }
  });
}

/**
 * Muestra el modal para editar un viaje existente
 * @param {number} travelId - ID del viaje a editar
 */
async function showEditTravelModal(travelId) {
  try {
    // Obtener los datos del viaje
    const travel = await TravelAPI.getById(travelId);

    // Llenar el formulario con los datos existentes
    document.getElementById("edit-travel-id").value = travel.id;
    document.getElementById("edit-travel-destination").value =
      travel.destination;
    document.getElementById("edit-travel-departure").value =
      travel.departureDate;
    document.getElementById("edit-travel-return").value = travel.returnDate;
    document.getElementById("edit-travel-price").value = travel.price;
    document.getElementById("edit-travel-itinerary").value =
      travel.itinerary || "";

    Modal.show("edit-travel-modal");
  } catch (error) {
    console.error("Error cargando datos del viaje:", error);
    Toast.error("Error al cargar los datos del viaje");
  }
}

/**
 * Inicializa el formulario de edición de viaje
 */
function initEditTravelForm() {
  const form = document.getElementById("edit-travel-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validar formulario
    const validation = FormValidator.validateForm("edit-travel-form");
    if (!validation.isValid) {
      validation.errors.forEach((error) => Toast.error(error));
      return;
    }

    // Obtener datos del formulario
    const formData = new FormData(form);
    const travelId = parseInt(document.getElementById("edit-travel-id").value);
    const travelData = {
      id: travelId,
      destination: formData.get("destination"),
      departureDate: formData.get("departureDate"),
      returnDate: formData.get("returnDate"),
      price: parseFloat(formData.get("price")),
      itinerary: formData.get("itinerary"),
    };

    try {
      await TravelAPI.update(travelId, travelData);

      Modal.hide();
      form.reset();

      Toast.success("¡Viaje actualizado exitosamente!");

      // Recargar las listas
      loadAdminTravels();
      loadTravels(); // También actualizar la vista pública
    } catch (error) {
      console.error("Error actualizando viaje:", error);
      Toast.error("Error al actualizar el viaje");
    }
  });
}

/**
 * Inicializa el módulo de viajes
 */
function initTravels() {
  initTravelSearch();
  initCreateTravelForm();
  initEditTravelForm();
}

// Exportar funciones para uso global
window.loadTravels = loadTravels;
window.showTravelDetails = showTravelDetails;
window.showEditTravelModal = showEditTravelModal;
window.deleteTravel = deleteTravel;
window.loadAdminTravels = loadAdminTravels;
window.showCreateTravelModal = showCreateTravelModal;
window.initTravels = initTravels;
