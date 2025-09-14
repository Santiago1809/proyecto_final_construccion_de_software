package com.tdea.proyecto_final.construccion_de_software.mapper;

import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.tdea.proyecto_final.construccion_de_software.dto.BookingResponse;
import com.tdea.proyecto_final.construccion_de_software.entity.BookingEntity;

@Component
public class BookingMapper {

  public BookingResponse toResponse(BookingEntity booking) {
    if (booking == null) {
      return null;
    }

    BookingResponse response = new BookingResponse();
    response.setId(booking.getId());
    response.setStatus(booking.getStatus());

    // Mapear información del usuario
    if (booking.getUser() != null) {
      BookingResponse.UserInfo userInfo = new BookingResponse.UserInfo();
      userInfo.setId(booking.getUser().getId());
      userInfo.setUsername(booking.getUser().getUsername());
      userInfo.setName(booking.getUser().getName());
      userInfo.setSurname(booking.getUser().getSurname());
      userInfo.setEmail(booking.getUser().getEmail());
      userInfo.setPhoneNumber(booking.getUser().getPhoneNumber());
      response.setUser(userInfo);
    }

    // Mapear información del viaje
    if (booking.getTravel() != null) {
      BookingResponse.TravelInfo travelInfo = new BookingResponse.TravelInfo();
      travelInfo.setId(booking.getTravel().getId());
      travelInfo.setDestination(booking.getTravel().getDestination());
      travelInfo.setDepartureDate(booking.getTravel().getDepartureDate());
      travelInfo.setReturnDate(booking.getTravel().getReturnDate());
      travelInfo.setPrice(booking.getTravel().getPrice());
      travelInfo.setItinerary(booking.getTravel().getItinerary());
      response.setTravel(travelInfo);
    }

    // Mapear información de los pagos
    if (booking.getPayments() != null) {
      response.setPayments(
          booking.getPayments().stream()
              .map(payment -> {
                BookingResponse.PaymentInfo paymentInfo = new BookingResponse.PaymentInfo();
                paymentInfo.setId(payment.getId());
                paymentInfo.setAmount(payment.getAmount());
                paymentInfo.setPaymentDate(payment.getPaymentDate());
                paymentInfo.setPaymentMethod(payment.getPaymentMethod());
                return paymentInfo;
              })
              .collect(Collectors.toList()));
    }

    return response;
  }
}
