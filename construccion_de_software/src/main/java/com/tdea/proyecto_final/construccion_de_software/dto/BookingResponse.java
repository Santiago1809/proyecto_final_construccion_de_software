package com.tdea.proyecto_final.construccion_de_software.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
  private Long id;
  private LocalDate bookingDate;
  private String status;

  // Información básica del usuario (sin sus otros bookings)
  private UserInfo user;

  // Información básica del viaje (sin sus otros bookings)
  private TravelInfo travel;

  // Lista de pagos (sin la referencia de vuelta al booking)
  private List<PaymentInfo> payments;

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class UserInfo {
    private Long id;
    private String username;
    private String name;
    private String surname;
    private String email;
    private String phoneNumber;
  }

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class TravelInfo {
    private Long id;
    private String destination;
    private LocalDate departureDate;
    private LocalDate returnDate;
    private BigDecimal price;
    private String itinerary;
  }

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class PaymentInfo {
    private Long id;
    private BigDecimal amount;
    private LocalDate paymentDate;
    private String paymentMethod;
  }
}
