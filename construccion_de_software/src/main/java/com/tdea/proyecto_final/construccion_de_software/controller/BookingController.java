package com.tdea.proyecto_final.construccion_de_software.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tdea.proyecto_final.construccion_de_software.dto.BookingRequest;
import com.tdea.proyecto_final.construccion_de_software.dto.BookingResponse;
import com.tdea.proyecto_final.construccion_de_software.dto.UpdateBookingStatusRequest;
import com.tdea.proyecto_final.construccion_de_software.entity.BookingEntity;
import com.tdea.proyecto_final.construccion_de_software.mapper.BookingMapper;
import com.tdea.proyecto_final.construccion_de_software.service.ManageBookingsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
  private final ManageBookingsService manageBookingsUseCase;
  private final BookingMapper bookingMapper;

  @PostMapping("/create")
  public ResponseEntity<BookingResponse> createBooking(@RequestBody BookingRequest bookingRequest) {
    BookingEntity createdBooking = manageBookingsUseCase.createBooking(bookingRequest);
    BookingResponse response = bookingMapper.toResponse(createdBooking);
    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<List<BookingResponse>> listBookings() {
    List<BookingEntity> bookings = manageBookingsUseCase.listBookings();
    List<BookingResponse> response = bookings.stream()
        .map(bookingMapper::toResponse)
        .collect(Collectors.toList());
    return ResponseEntity.ok(response);
  }

  @GetMapping("/filter")
  public ResponseEntity<List<BookingResponse>> filter(
      @RequestParam(required = false) String status,
      @RequestParam(required = false) String userEmail,
      @RequestParam(required = false) String destination,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo) {
    
    List<BookingEntity> bookings = manageBookingsUseCase.filterBookings(status, userEmail, destination, dateFrom, dateTo);
    List<BookingResponse> response = bookings.stream()
        .map(bookingMapper::toResponse)
        .collect(Collectors.toList());
    return ResponseEntity.ok(response);
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> getBookingById(@PathVariable Long id) {
    BookingEntity booking = manageBookingsUseCase.getBookingById(id);
    if (booking != null) {
      BookingResponse response = bookingMapper.toResponse(booking);
      return ResponseEntity.ok(response);
    } else {
      return ResponseEntity.status(404).body(
          Map.of("error", "Booking with id " + id + " not found"));
    }
  }

  @GetMapping("/user/{userId}")
  public ResponseEntity<List<BookingResponse>> listBookingsByUserId(@PathVariable Long userId) {
    List<BookingEntity> bookings = manageBookingsUseCase.listBookingsByUserId(userId);
    List<BookingResponse> response = bookings.stream()
        .map(bookingMapper::toResponse)
        .collect(Collectors.toList());
    return ResponseEntity.ok(response);
  }

  @PatchMapping("/{id}/status")
  public ResponseEntity<BookingResponse> updateBookingStatus(
      @PathVariable Long id,
      @RequestBody UpdateBookingStatusRequest statusRequest) {
    BookingEntity updatedBooking = manageBookingsUseCase.updateBookingStatus(id, statusRequest.getStatus());
    BookingResponse response = bookingMapper.toResponse(updatedBooking);
    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/delete/{id}")
  public ResponseEntity<?> deleteBooking(@PathVariable Long id) {
    BookingEntity booking = manageBookingsUseCase.getBookingById(id);
    if (booking != null) {
      manageBookingsUseCase.deleteBooking(id);
      return ResponseEntity.ok(Map.of("message", "Booking with id " + id + " deleted successfully"));
    } else {
      return ResponseEntity.status(404).body(
          Map.of("error", "Booking with id " + id + " not found"));
    }
  }
}
