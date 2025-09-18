package com.tdea.proyecto_final.construccion_de_software.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
  private Long id;
  private BigDecimal amount;
  private LocalDate paymentDate;
  private String paymentMethod;
  private Long bookingId;

  // Información adicional del usuario y viaje
  private UserInfo userInfo;
  private TravelInfo travelInfo;

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class UserInfo {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
  }

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class TravelInfo {
    private Long id;
    private String destination;
    private LocalDate departureDate;
    private LocalDate returnDate;
  }
}
