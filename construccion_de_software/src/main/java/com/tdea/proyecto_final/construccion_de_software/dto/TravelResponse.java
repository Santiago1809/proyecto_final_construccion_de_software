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
public class TravelResponse {
  private Long id;
  private String destination;
  private LocalDate departureDate;
  private LocalDate returnDate;
  private BigDecimal price;
  private String itinerary;

  // Lista de usuarios que han reservado este viaje
  private List<BookingInfo> bookings;

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class BookingInfo {
    private Long bookingId;
    private String status;
    private UserInfo user;
  }

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
}