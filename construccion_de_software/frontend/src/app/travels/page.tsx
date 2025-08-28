"use client";

import { TravelGrid } from "@/components/TravelCard";

export default function TravelsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Explora Nuestros Destinos
      </h1>

      {/* Filtros de búsqueda - Se podrían implementar en una versión más avanzada */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-sm">
        <p className="text-lg font-semibold mb-2">
          Descubre tu próxima aventura
        </p>
        <p className="text-gray-600">
          Explora nuestra selección de destinos cuidadosamente seleccionados
          para ofrecerte experiencias únicas.
        </p>
      </div>

      <TravelGrid />
    </div>
  );
}
