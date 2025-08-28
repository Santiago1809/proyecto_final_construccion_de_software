"use client";
import { useApi, Travel } from "@/contexts/ApiContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/dateUtils";
import TravelImage from "./TravelImage";

export default function TravelCard({ travel }: { travel: Travel }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="h-48 bg-indigo-200 relative">
        <TravelImage destination={travel.destination} />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">
          {travel.destination}
        </h3>
        <div className="mt-2 text-sm text-gray-600">
          <p>Salida: {formatDate(travel.departureDate)}</p>
          <p>Regreso: {formatDate(travel.returnDate)}</p>
        </div>
        <p className="mt-2 font-bold text-indigo-600">
          ${travel.price.toLocaleString()}
        </p>
        <div className="mt-4">
          <Link
            href={`/travels/${travel.id}`}
            className="block w-full text-center bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Ver Detalles
          </Link>
        </div>
      </div>
    </div>
  );
}

export function TravelGrid() {
  const { getAllTravels, error } = useApi();
  const [travels, setTravels] = useState<Travel[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchTravels = async () => {
      try {
        const data = await getAllTravels();
        if (isMounted) {
          setTravels(data);
        }
      } catch (error) {
        console.error("Error fetching travels:", error);
      } finally {
        if (isMounted) {
          setIsInitialLoading(false);
        }
      }
    };

    fetchTravels();

    return () => {
      isMounted = false;
    };
  }, [getAllTravels]);

  // Solo mostramos el loader durante la carga inicial
  if (isInitialLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        <p>
          Error al cargar los viajes. Por favor, intenta de nuevo más tarde.
        </p>
      </div>
    );
  }

  if (travels.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">
          No hay viajes disponibles en este momento.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {travels.map((travel) => (
        <TravelCard key={travel.id} travel={travel} />
      ))}
    </div>
  );
}
