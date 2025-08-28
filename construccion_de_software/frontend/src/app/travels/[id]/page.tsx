"use client";

import { useApi, Travel } from "@/contexts/ApiContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { formatDate } from "@/utils/dateUtils";
import { useRouter } from "next/navigation";

export default function TravelDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { getTravelById, createBooking, isLoading, error } = useApi();
  const { user } = useAuth();
  const [travel, setTravel] = useState<Travel | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchTravel = async () => {
      try {
        const data = await getTravelById(parseInt(params.id));
        setTravel(data);
      } catch (error) {
        console.error("Error fetching travel details:", error);
      }
    };

    fetchTravel();
  }, [getTravelById, params.id]);

  const handleBooking = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!travel) return;

    try {
      setBookingError("");

      const bookingRequest = {
        bookingDate: travel.departureDate,
        status: "PENDING",
        userId: user.id,
        travelId: travel.id,
      };

      await createBooking(bookingRequest);
      setBookingSuccess(true);

      // Redirigir a la página de reservas después de 2 segundos
      setTimeout(() => {
        router.push("/bookings");
      }, 2000);
    } catch (error) {
      console.error("Error creating booking:", error);
      if (error instanceof Error) {
        setBookingError(error.message);
      } else {
        setBookingError("Ocurrió un error al crear la reserva");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error al cargar los detalles del viaje. Por favor, intenta de nuevo
          más tarde.
        </div>
      </div>
    );
  }

  if (!travel) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Viaje no encontrado
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mensaje de éxito */}
      {bookingSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          ¡Reserva creada con éxito! Redirigiendo a tus reservas...
        </div>
      )}

      {/* Mensaje de error */}
      {bookingError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {bookingError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-indigo-200 h-80 rounded-lg overflow-hidden">
            <img
              src={`https://source.unsplash.com/random/800x600/?${travel.destination.replace(
                /\s+/g,
                ""
              )}`}
              alt={travel.destination}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/800x600?text=Destino";
              }}
            />
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Itinerario</h2>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-gray-700 whitespace-pre-line">
                {travel.itinerary}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{travel.destination}</h1>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Fecha de salida:</span>
              <span className="font-semibold">
                {formatDate(travel.departureDate)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Fecha de regreso:</span>
              <span className="font-semibold">
                {formatDate(travel.returnDate)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Precio:</span>
              <span className="font-semibold text-indigo-600 text-xl">
                ${travel.price.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={handleBooking}
            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition font-semibold"
            disabled={isLoading || bookingSuccess}
          >
            {isLoading ? "Procesando..." : "Reservar Ahora"}
          </button>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              Información Importante
            </h2>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>El precio incluye alojamiento y transporte.</li>
                <li>Se recomienda llevar documentos de identidad.</li>
                <li>
                  Las excursiones opcionales pueden tener costo adicional.
                </li>
                <li>
                  Consulta las políticas de cancelación antes de reservar.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
