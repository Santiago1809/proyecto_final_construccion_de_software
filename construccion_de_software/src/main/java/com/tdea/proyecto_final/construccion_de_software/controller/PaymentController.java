package com.tdea.proyecto_final.construccion_de_software.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tdea.proyecto_final.construccion_de_software.dto.ErrorResponse;
import com.tdea.proyecto_final.construccion_de_software.dto.PaymentRequest;
import com.tdea.proyecto_final.construccion_de_software.dto.PaymentResponse;
import com.tdea.proyecto_final.construccion_de_software.dto.PaymentSummaryResponse;
import com.tdea.proyecto_final.construccion_de_software.service.ManagePaymentsService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

  private final ManagePaymentsService managePaymentsUseCase;

  @PostMapping
  public ResponseEntity<?> processPayment(@Valid @RequestBody PaymentRequest request) {
    try {
      PaymentResponse payment = managePaymentsUseCase.processPayment(request);
      return ResponseEntity.status(HttpStatus.CREATED).body(payment);
    } catch (RuntimeException e) {
      ErrorResponse error = new ErrorResponse(400, "PAYMENT_ERROR", e.getMessage(), LocalDateTime.now());
      return ResponseEntity.badRequest().body(error);
    }
  }

  @GetMapping("/booking/{bookingId}/summary")
  public ResponseEntity<?> getPaymentSummary(@PathVariable Long bookingId) {
    try {
      PaymentSummaryResponse summary = managePaymentsUseCase.getPaymentSummary(bookingId);
      return ResponseEntity.ok(summary);
    } catch (RuntimeException e) {
      ErrorResponse error = new ErrorResponse(400, "BOOKING_NOT_FOUND", e.getMessage(), LocalDateTime.now());
      return ResponseEntity.badRequest().body(error);
    }
  }

  @GetMapping
  public ResponseEntity<List<PaymentResponse>> getAllPayments() {
    List<PaymentResponse> payments = managePaymentsUseCase.getAllPayments();
    return ResponseEntity.ok(payments);
  }

  @GetMapping("/filter")
  public ResponseEntity<List<PaymentResponse>> filter(
      @RequestParam(required = false) String userEmail,
      @RequestParam(required = false) String paymentMethod,
      @RequestParam(required = false) BigDecimal minAmount,
      @RequestParam(required = false) BigDecimal maxAmount,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo) {

    List<PaymentResponse> payments = managePaymentsUseCase.filterPayments(userEmail, paymentMethod, minAmount,
        maxAmount, dateFrom, dateTo);
    return ResponseEntity.ok(payments);
  }

  @GetMapping("/booking/{bookingId}")
  public ResponseEntity<?> getPaymentsByBooking(@PathVariable Long bookingId) {
    try {
      List<PaymentResponse> payments = managePaymentsUseCase.getPaymentsByBooking(bookingId);
      return ResponseEntity.ok(payments);
    } catch (RuntimeException e) {
      ErrorResponse error = new ErrorResponse(400, "BOOKING_NOT_FOUND", e.getMessage(), LocalDateTime.now());
      return ResponseEntity.badRequest().body(error);
    }
  }

  @GetMapping("/user/{userId}")
  public ResponseEntity<List<PaymentResponse>> getPaymentsByUser(@PathVariable Long userId) {
    List<PaymentResponse> payments = managePaymentsUseCase.getPaymentsByUser(userId);
    return ResponseEntity.ok(payments);
  }

  @GetMapping("/{paymentId}")
  public ResponseEntity<?> getPaymentById(@PathVariable Long paymentId) {
    try {
      PaymentResponse payment = managePaymentsUseCase.getPaymentById(paymentId);
      return ResponseEntity.ok(payment);
    } catch (RuntimeException e) {
      ErrorResponse error = new ErrorResponse(404, "PAYMENT_NOT_FOUND", e.getMessage(), LocalDateTime.now());
      return ResponseEntity.badRequest().body(error);
    }
  }

  @DeleteMapping("/{paymentId}")
  public ResponseEntity<?> cancelPayment(@PathVariable Long paymentId) {
    try {
      managePaymentsUseCase.cancelPayment(paymentId);
      return ResponseEntity.ok().build();
    } catch (RuntimeException e) {
      ErrorResponse error = new ErrorResponse(400, "CANCELLATION_ERROR", e.getMessage(), LocalDateTime.now());
      return ResponseEntity.badRequest().body(error);
    }
  }
}
