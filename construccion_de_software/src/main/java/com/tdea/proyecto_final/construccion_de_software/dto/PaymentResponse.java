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
  private String status;
}
