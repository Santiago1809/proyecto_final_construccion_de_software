import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Agencia de Viajes</h3>
            <p className="text-gray-300 text-sm">
              Descubre los mejores destinos para tus vacaciones soñadas.
              Ofrecemos experiencias únicas, paquetes personalizados y atención
              al cliente excepcional.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>
                <Link href="/" className="hover:text-indigo-300 transition">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/travels" className="hover:text-indigo-300 transition">
                  Destinos
                </Link>
              </li>
              <li>
                <a href="/about" className="hover:text-indigo-300 transition">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-indigo-300 transition">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>Calle Principal #123</li>
              <li>Ciudad, Estado, País</li>
              <li>Teléfono: +123 456 7890</li>
              <li>Email: info@agenciadeviajes.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400 text-sm">
          <p>
            © {new Date().getFullYear()} Agencia de Viajes. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
