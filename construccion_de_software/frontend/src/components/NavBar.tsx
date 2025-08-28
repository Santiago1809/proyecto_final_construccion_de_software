"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export default function NavBar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div>
            <Link href="/" className="text-xl font-bold">
              Agencia de Viajes
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link href="/" className="hover:text-indigo-200 transition">
              Inicio
            </Link>
            <Link href="/travels" className="hover:text-indigo-200 transition">
              Viajes
            </Link>

            {user ? (
              <>
                <Link
                  href="/bookings"
                  className="hover:text-indigo-200 transition"
                >
                  Mis Reservas
                </Link>
                <div className="relative group">
                  <button className="hover:text-indigo-200 transition">
                    {user.name}
                  </button>
                  <div className="absolute right-0 z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-150">
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Perfil
                      </Link>
                      {user.rol === "ADMIN" && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hover:text-indigo-200 transition"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100 transition"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-indigo-200 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link href="/" className="block hover:text-indigo-200 transition">
              Inicio
            </Link>
            <Link
              href="/travels"
              className="block hover:text-indigo-200 transition"
            >
              Viajes
            </Link>

            {user ? (
              <>
                <Link
                  href="/bookings"
                  className="block hover:text-indigo-200 transition"
                >
                  Mis Reservas
                </Link>
                <Link
                  href="/profile"
                  className="block hover:text-indigo-200 transition"
                >
                  Perfil
                </Link>
                {user.rol === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="block hover:text-indigo-200 transition"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="block w-full text-left hover:text-indigo-200 transition"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block hover:text-indigo-200 transition"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="block hover:text-indigo-200 transition"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
