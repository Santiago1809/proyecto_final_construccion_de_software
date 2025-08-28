import { TravelGrid } from "@/components/TravelCard";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="bg-indigo-600 text-white rounded-lg p-8 shadow-md">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              Descubre el mundo con nosotros
            </h1>
            <p className="text-lg mb-6">
              Encuentra los mejores destinos para tus próximas vacaciones.
              Paquetes completos con vuelos, alojamiento y experiencias únicas.
            </p>
            <Link
              href="/travels"
              className="inline-block bg-white text-indigo-600 font-semibold px-6 py-3 rounded-md hover:bg-indigo-100 transition"
            >
              Ver Destinos
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          Destinos Populares
        </h2>
        <TravelGrid />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          ¿Por qué elegirnos?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-indigo-600 text-4xl mb-4">
              {/* Icon placeholder */}
              <div className="h-16 w-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Destinos Internacionales
            </h3>
            <p className="text-gray-600">
              Ofrecemos una amplia selección de destinos en todo el mundo para
              que puedas cumplir tus sueños de viaje.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-indigo-600 text-4xl mb-4">
              {/* Icon placeholder */}
              <div className="h-16 w-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Precios Competitivos</h3>
            <p className="text-gray-600">
              Comparamos cientos de sitios de viajes para asegurarnos de
              ofrecerte los mejores precios disponibles.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-indigo-600 text-4xl mb-4">
              {/* Icon placeholder */}
              <div className="h-16 w-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Soporte 24/7</h3>
            <p className="text-gray-600">
              Nuestro equipo de atención al cliente está disponible las 24 horas
              para ayudarte en cualquier momento.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-8">
          Testimonios de Clientes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gray-300 mr-4"></div>
              <div>
                <h4 className="font-semibold">Carlos Rodríguez</h4>
                <div className="text-yellow-500">★★★★★</div>
              </div>
            </div>
            <p className="text-gray-600 italic">
              Excelente servicio, todo funcionó perfectamente. El hotel era
              fantástico y las actividades organizadas fueron increíbles.
              ¡Definitivamente volveré a reservar con ustedes!
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gray-300 mr-4"></div>
              <div>
                <h4 className="font-semibold">Laura Martínez</h4>
                <div className="text-yellow-500">★★★★★</div>
              </div>
            </div>
            <p className="text-gray-600 italic">
              Mi viaje a París fue mágico gracias a la organización impecable.
              Todo estaba muy bien coordinado y el itinerario era perfecto.
              Recomiendo totalmente esta agencia.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
