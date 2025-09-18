package com.tdea.proyecto_final.construccion_de_software.mapper;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.tdea.proyecto_final.construccion_de_software.dto.PaymentResponse;
import com.tdea.proyecto_final.construccion_de_software.dto.PaymentSummaryResponse;
import com.tdea.proyecto_final.construccion_de_software.entity.PaymentEntity;

@Component
public class PaymentMapper {

  public PaymentResponse toResponse(PaymentEntity payment) {
    if (payment == null) {
      return null;
    }

    PaymentResponse response = new PaymentResponse();
    response.setId(payment.getId());
    response.setAmount(payment.getAmount());
    response.setPaymentDate(payment.getPaymentDate());
    response.setPaymentMethod(payment.getPaymentMethod());
    response.setBookingId(payment.getBooking() != null ? payment.getBooking().getId() : null);

    // Mapear información del usuario
    if (payment.getBooking() != null && payment.getBooking().getUser() != null) {
      PaymentResponse.UserInfo userInfo = new PaymentResponse.UserInfo();
      userInfo.setId(payment.getBooking().getUser().getId());
      userInfo.setEmail(payment.getBooking().getUser().getEmail());
      userInfo.setFirstName(payment.getBooking().getUser().getName());
      userInfo.setLastName(payment.getBooking().getUser().getSurname());
      response.setUserInfo(userInfo);
    }

    // Mapear información del viaje
    if (payment.getBooking() != null && payment.getBooking().getTravel() != null) {
      PaymentResponse.TravelInfo travelInfo = new PaymentResponse.TravelInfo();
      travelInfo.setId(payment.getBooking().getTravel().getId());
      travelInfo.setDestination(payment.getBooking().getTravel().getDestination());
      travelInfo.setDepartureDate(payment.getBooking().getTravel().getDepartureDate());
      travelInfo.setReturnDate(payment.getBooking().getTravel().getReturnDate());
      response.setTravelInfo(travelInfo);
    }

    return response;
  }

  public List<PaymentResponse> toResponseList(List<PaymentEntity> payments) {
    if (payments == null) {
      return null;
    }

    return payments.stream()
        .map(this::toResponse)
        .collect(Collectors.toList());
  }

  public PaymentSummaryResponse toPaymentSummary(Long bookingId, BigDecimal totalAmount,
      BigDecimal paidAmount, List<PaymentEntity> payments) {
    PaymentSummaryResponse summary = new PaymentSummaryResponse();
    summary.setBookingId(bookingId);
    summary.setTotalAmount(totalAmount);
    summary.setPaidAmount(paidAmount != null ? paidAmount : BigDecimal.ZERO);
    summary.setRemainingAmount(totalAmount.subtract(summary.getPaidAmount()));

    // Determinar el estado del pago
    String paymentStatus;
    if (summary.getPaidAmount().compareTo(BigDecimal.ZERO) == 0) {
      paymentStatus = "PENDING";
    } else if (summary.getPaidAmount().compareTo(totalAmount) < 0) {
      paymentStatus = "PARTIAL";
    } else {
      paymentStatus = "COMPLETED";
    }
    summary.setPaymentStatus(paymentStatus);

    summary.setPayments(toResponseList(payments));

    return summary;
  }
}
