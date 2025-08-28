package com.tdea.proyecto_final.construccion_de_software.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentSummaryResponse {
  private Long bookingId;
  private BigDecimal totalAmount;
  private BigDecimal paidAmount;
  private BigDecimal remainingAmount;
  private String paymentStatus; // PENDING, PARTIAL, COMPLETED
  private List<PaymentResponse> payments;
}
