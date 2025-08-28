package com.tdea.proyecto_final.construccion_de_software.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBookingStatusRequest {
  private String status;
}
