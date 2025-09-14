package interfaces;

import enums.Estado;

public interface ObjetoBiblioteca {
  public String codigo = "";
  public String titulo = "";
  public Estado estado = Estado.DISPONIBLE;
  public String añoPublicacion = "";
  public void prestar();
  public void devolver();
  public void reservar();
  public String mostrarInfo();

}
