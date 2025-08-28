import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { ApiProvider } from "@/contexts/ApiContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Agencia de Viajes",
  description: "Reserva tus próximas vacaciones con nosotros",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} min-h-screen flex flex-col`}>
        <AuthProvider>
          <ApiProvider>
            <NavBar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </ApiProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
