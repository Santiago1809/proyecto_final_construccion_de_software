package com.tdea.proyecto_final.construccion_de_software.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.tdea.proyecto_final.construccion_de_software.dto.BookingRequest;
import com.tdea.proyecto_final.construccion_de_software.entity.BookingEntity;
import com.tdea.proyecto_final.construccion_de_software.entity.TravelEntity;
import com.tdea.proyecto_final.construccion_de_software.entity.UserEntity;
import com.tdea.proyecto_final.construccion_de_software.repository.BookingRepository;
import com.tdea.proyecto_final.construccion_de_software.repository.TravelRepository;
import com.tdea.proyecto_final.construccion_de_software.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ManageBookingsService {
  private final BookingRepository bookingRepository;
  private final UserRepository userRepository;
  private final TravelRepository travelRepository;
  private final List<String> status = List.of("PENDING", "CONFIRMED", "CANCELLED", "REJECTED", "ON_HOLD", "REFUNDED",
      "NO_SHOW", "PAID");

  public BookingEntity createBooking(BookingRequest bookingRequest) {
    // Validate status
    if (!status.contains(bookingRequest.getStatus())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
          "Invalid booking status: " + bookingRequest.getStatus());
    }

    // Fetch user
    UserEntity user = userRepository.findById(bookingRequest.getUserId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
            "User not found with id: " + bookingRequest.getUserId()));

    // Fetch travel
    TravelEntity travel = travelRepository.findById(bookingRequest.getTravelId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
            "Travel not found with id: " + bookingRequest.getTravelId()));

    // Create booking entity
    BookingEntity booking = new BookingEntity();
    booking.setStatus(bookingRequest.getStatus());
    booking.setUser(user);
    booking.setTravel(travel);

    return bookingRepository.save(booking);
  }

  public BookingEntity createBooking(BookingEntity booking) {
    if (!status.contains(booking.getStatus())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid booking status: " + booking.getStatus());
    }

    if (booking.getUser() == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking must be associated with a user.");
    }
    return bookingRepository.save(booking);
  }

  public BookingEntity getBookingById(Long id) {
    return bookingRepository.findById(id).orElse(null);
  }

  public void deleteBooking(Long id) {
    bookingRepository.deleteById(id);
  }

  public List<BookingEntity> listBookings() {
    return bookingRepository.findAll();
  }

  public List<BookingEntity> listBookingsByUserId(Long userId) {
    return bookingRepository.findByUserId(userId);
  }

  public BookingEntity updateBookingStatus(Long bookingId, String newStatus) {
    if (!status.contains(newStatus)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid booking status: " + newStatus);
    }

    BookingEntity booking = bookingRepository.findById(bookingId)
        .orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found with id: " + bookingId));

    booking.setStatus(newStatus);
    return bookingRepository.save(booking);
  }

  public List<BookingEntity> filterBookings(String status, String userEmail, String destination, LocalDate dateFrom,
      LocalDate dateTo) {
    List<BookingEntity> bookings = bookingRepository.findAll();

    return bookings.stream()
        .filter(booking -> status == null || status.equals("") || booking.getStatus().equalsIgnoreCase(status))
        .filter(booking -> userEmail == null
            || booking.getUser().getEmail().toLowerCase().contains(userEmail.toLowerCase()))
        .filter(booking -> destination == null
            || booking.getTravel().getDestination().toLowerCase().contains(destination.toLowerCase()))
        .filter(booking -> dateFrom == null || !booking.getTravel().getDepartureDate().isBefore(dateFrom))
        .filter(booking -> dateTo == null || !booking.getTravel().getDepartureDate().isAfter(dateTo))
        .collect(Collectors.toList());
  }
}
