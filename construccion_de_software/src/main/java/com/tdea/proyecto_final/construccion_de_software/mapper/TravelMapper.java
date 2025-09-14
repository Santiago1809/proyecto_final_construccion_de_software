package com.tdea.proyecto_final.construccion_de_software.mapper;

import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.tdea.proyecto_final.construccion_de_software.dto.TravelResponse;
import com.tdea.proyecto_final.construccion_de_software.entity.TravelEntity;

@Component
public class TravelMapper {

  public TravelResponse toResponse(TravelEntity travel) {
    if (travel == null) {
      return null;
    }

    TravelResponse response = new TravelResponse();
    response.setId(travel.getId());
    response.setDestination(travel.getDestination());
    response.setDepartureDate(travel.getDepartureDate());
    response.setReturnDate(travel.getReturnDate());
    response.setPrice(travel.getPrice());
    response.setItinerary(travel.getItinerary());

    // Mapear las reservas y usuarios
    if (travel.getBookings() != null) {
      response.setBookings(
          travel.getBookings().stream()
              .map(booking -> {
                TravelResponse.BookingInfo bookingInfo = new TravelResponse.BookingInfo();
                bookingInfo.setBookingId(booking.getId());
                bookingInfo.setStatus(booking.getStatus());

                if (booking.getUser() != null) {
                  TravelResponse.UserInfo userInfo = new TravelResponse.UserInfo();
                  userInfo.setId(booking.getUser().getId());
                  userInfo.setUsername(booking.getUser().getUsername());
                  userInfo.setName(booking.getUser().getName());
                  userInfo.setSurname(booking.getUser().getSurname());
                  userInfo.setEmail(booking.getUser().getEmail());
                  userInfo.setPhoneNumber(booking.getUser().getPhoneNumber());
                  bookingInfo.setUser(userInfo);
                }

                return bookingInfo;
              })
              .collect(Collectors.toList()));
    }

    return response;
  }
}