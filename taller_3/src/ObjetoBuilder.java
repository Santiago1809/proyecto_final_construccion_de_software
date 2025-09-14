import enums.Estado;
import enums.TipoObjeto;
import interfaces.ObjetoBiblioteca;

public class ObjetoBuilder {
  private String codigo;
  private String titulo;
  private Estado estado;
  private String añoPublicacion;
  private TipoObjeto tipo;

  public ObjetoBuilder() {
    // Constructor vacío
  }

  public ObjetoBuilder setCodigo(String codigo) {
    this.codigo = codigo;
    return this;
  }

  public ObjetoBuilder setTitulo(String titulo) {
    this.titulo = titulo;
    return this;
  }

  public ObjetoBuilder setEstado(Estado estado) {
    this.estado = estado;
    return this;
  }

  public ObjetoBuilder setAñoPublicacion(String añoPublicacion) {
    this.añoPublicacion = añoPublicacion;
    return this;
  }

  public ObjetoBuilder setTipo(TipoObjeto tipo) {
    this.tipo = tipo;
    return this;
  }

  public ObjetoBiblioteca build() {
    if (codigo == null || titulo == null || añoPublicacion == null || tipo == null || estado == null) {
      throw new IllegalStateException("Todos los campos obligatorios deben estar configurados");
    }

    switch (tipo) {
      case LIBRO:
        return new Libro(codigo, titulo, estado, añoPublicacion);
      case REVISTA:
        return new Revista(codigo, titulo, estado, añoPublicacion);
      default:
        throw new IllegalArgumentException("Tipo de objeto no válido");
    }
  }
}
