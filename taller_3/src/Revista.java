import enums.Estado;
import interfaces.ObjetoBiblioteca;

public class Revista implements ObjetoBiblioteca {
  public String codigo;
  public String titulo;
  public Estado estado;
  public String añoPublicacion;

  public Revista(String codigo, String titulo, Estado estado, String añoPublicacion) {
    this.codigo = codigo;
    this.titulo = titulo;
    this.estado = estado;
    this.añoPublicacion = añoPublicacion;
  }

  public void prestar() {
    if (this.estado == Estado.DISPONIBLE) {
      this.estado = Estado.PRESTADO;
      System.out.println("La revista ha sido prestada.");
    } else {
      System.out.println("La revista no está disponible para préstamo.");
    }
  }

  public void devolver() {
    if (this.estado == Estado.PRESTADO) {
      this.estado = Estado.DISPONIBLE;
      System.out.println("La revista ha sido devuelta.");
    } else {
      System.out.println("La revista no estaba prestada.");
    }
  }

  public void reservar() {
    if (this.estado == Estado.DISPONIBLE) {
      this.estado = Estado.RESERVADO;
      System.out.println("La revista ha sido reservada.");
    } else {
      System.out.println("La revista no está disponible para reserva.");
    }
  }

  public String mostrarInfo() {
    return "Código: " + this.codigo + ", Título: " + this.titulo + ", Estado: " + this.estado + ", Año de Publicación: "
        + this.añoPublicacion;
  }

}
