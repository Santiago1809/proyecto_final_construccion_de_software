import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import enums.Estado;
import enums.TipoObjeto;
import interfaces.ObjetoBiblioteca;

public class App {
    private static List<ObjetoBiblioteca> biblioteca = new ArrayList<>();
    private static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        mostrarMenuPrincipal();
    }

    private static void mostrarMenuPrincipal() {
        int opcion;
        do {
            System.out.println("\n=== SISTEMA DE BIBLIOTECA ===");
            System.out.println("1. Crear Libro");
            System.out.println("2. Crear Revista");
            System.out.println("3. Mostrar todos los objetos");
            System.out.println("4. Interactuar con un objeto");
            System.out.println("5. Salir");
            System.out.print("Seleccione una opción: ");

            opcion = scanner.nextInt();
            scanner.nextLine(); // Consumir el salto de línea

            switch (opcion) {
                case 1:
                    crearLibro();
                    break;
                case 2:
                    crearRevista();
                    break;
                case 3:
                    mostrarObjetos();
                    break;
                case 4:
                    interactuarConObjeto();
                    break;
                case 5:
                    System.out.println("¡Hasta luego!");
                    break;
                default:
                    System.out.println("Opción no válida. Intente nuevamente.");
            }
        } while (opcion != 5);
    }

    private static void crearLibro() {
        System.out.println("\n=== CREAR LIBRO ===");
        System.out.print("Código: ");
        String codigo = scanner.nextLine();
        System.out.print("Título: ");
        String titulo = scanner.nextLine();
        System.out.print("Año de publicación: ");
        String añoPublicacion = scanner.nextLine();

        Estado estado = seleccionarEstado();

        try {
            ObjetoBiblioteca libro = new ObjetoBuilder()
                    .setTipo(TipoObjeto.LIBRO)
                    .setCodigo(codigo)
                    .setTitulo(titulo)
                    .setEstado(estado)
                    .setAñoPublicacion(añoPublicacion)
                    .build();

            biblioteca.add(libro);
            System.out.println("¡Libro creado exitosamente!");
        } catch (Exception e) {
            System.out.println("Error al crear el libro: " + e.getMessage());
        }
    }

    private static void crearRevista() {
        System.out.println("\n=== CREAR REVISTA ===");
        System.out.print("Código: ");
        String codigo = scanner.nextLine();
        System.out.print("Título: ");
        String titulo = scanner.nextLine();
        System.out.print("Año de publicación: ");
        String añoPublicacion = scanner.nextLine();
        System.out.print("Cantidad disponible: ");
        Estado estado = seleccionarEstado();

        try {
            ObjetoBiblioteca revista = new ObjetoBuilder()
                    .setTipo(TipoObjeto.REVISTA)
                    .setCodigo(codigo)
                    .setTitulo(titulo)
                    .setEstado(estado)
                    .setAñoPublicacion(añoPublicacion)
                    .build();

            biblioteca.add(revista);
            System.out.println("¡Revista creada exitosamente!");
        } catch (Exception e) {
            System.out.println("Error al crear la revista: " + e.getMessage());
        }
    }

    private static void mostrarObjetos() {
        if (biblioteca.isEmpty()) {
            System.out.println("\nNo hay objetos en la biblioteca.");
            return;
        }

        System.out.println("\n=== OBJETOS EN LA BIBLIOTECA ===");
        for (int i = 0; i < biblioteca.size(); i++) {
            System.out.println((i + 1) + ". " + biblioteca.get(i).mostrarInfo());
        }
    }

    private static void interactuarConObjeto() {
        if (biblioteca.isEmpty()) {
            System.out.println("\nNo hay objetos en la biblioteca para interactuar.");
            return;
        }

        mostrarObjetos();
        System.out.print("Seleccione el número del objeto: ");
        int indice = scanner.nextInt() - 1;
        scanner.nextLine();

        if (indice < 0 || indice >= biblioteca.size()) {
            System.out.println("Índice no válido.");
            return;
        }

        ObjetoBiblioteca objeto = biblioteca.get(indice);
        mostrarMenuInteraccion(objeto);
    }

    private static void mostrarMenuInteraccion(ObjetoBiblioteca objeto) {
        int opcion;
        do {
            System.out.println("\n=== INTERACCIÓN CON OBJETO ===");
            System.out.println("Objeto: " + objeto.mostrarInfo());
            System.out.println("1. Prestar");
            System.out.println("2. Devolver");
            System.out.println("3. Reservar");
            System.out.println("4. Volver al menú principal");
            System.out.print("Seleccione una opción: ");

            opcion = scanner.nextInt();
            scanner.nextLine();

            switch (opcion) {
                case 1:
                    objeto.prestar();
                    break;
                case 2:
                    objeto.devolver();
                    break;
                case 3:
                    objeto.reservar();
                    break;
                case 4:
                    System.out.println("Volviendo al menú principal...");
                    break;
                default:
                    System.out.println("Opción no válida. Intente nuevamente.");
            }
        } while (opcion != 4);
    }

    private static Estado seleccionarEstado() {
        int opcionEstado;
        do {
            System.out.println("\nSeleccione el estado inicial:");
            System.out.println("1. Disponible");
            System.out.println("2. Prestado");
            System.out.println("3. Reservado");
            System.out.print("Opción: ");

            opcionEstado = scanner.nextInt();
            scanner.nextLine();

            switch (opcionEstado) {
                case 1:
                    return Estado.DISPONIBLE;
                case 2:
                    return Estado.PRESTADO;
                case 3:
                    return Estado.RESERVADO;
                default:
                    System.out.println("Opción no válida. Intente nuevamente.");
            }
        } while (true);
    }
}
