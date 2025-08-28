package com.tdea.proyecto_final.construccion_de_software.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ErrorResponse {
  private int status;
  private String error;
  private String message;
  private LocalDateTime timestamp;
}
