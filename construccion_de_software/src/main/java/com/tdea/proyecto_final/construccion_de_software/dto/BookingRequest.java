package com.tdea.proyecto_final.construccion_de_software.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
  private LocalDate bookingDate;
  private String status;
  private Long userId;
  private Long travelId;
}
