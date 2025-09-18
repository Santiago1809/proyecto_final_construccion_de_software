package com.tdea.proyecto_final.construccion_de_software.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tdea.proyecto_final.construccion_de_software.dto.PaymentRequest;
import com.tdea.proyecto_final.construccion_de_software.dto.PaymentResponse;
import com.tdea.proyecto_final.construccion_de_software.dto.PaymentSummaryResponse;
import com.tdea.proyecto_final.construccion_de_software.entity.BookingEntity;
import com.tdea.proyecto_final.construccion_de_software.entity.PaymentEntity;
import com.tdea.proyecto_final.construccion_de_software.mapper.PaymentMapper;
import com.tdea.proyecto_final.construccion_de_software.repository.BookingRepository;
import com.tdea.proyecto_final.construccion_de_software.repository.PaymentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ManagePaymentsService {

  private final PaymentRepository paymentRepository;
  private final BookingRepository bookingRepository;
  private final PaymentMapper paymentMapper;

  @Transactional
  public PaymentResponse processPayment(PaymentRequest request) {
    // Verificar que la reserva existe
    BookingEntity booking = bookingRepository.findById(request.getBookingId())
        .orElseThrow(() -> new RuntimeException("Booking not found with id: " + request.getBookingId()));

    // Verificar que la reserva está confirmada
    if ("CONFIRMED".equals(booking.getStatus())) {
      throw new RuntimeException("Cannot process payment for booking with status: " + booking.getStatus());
    }

    // Calcular el monto total de la reserva
    BigDecimal totalAmount = booking.getTravel().getPrice();

    // Calcular el monto ya pagado
    BigDecimal paidAmount = paymentRepository.getTotalPaidAmountByBookingId(booking.getId());

    // Verificar que no se exceda el monto total
    BigDecimal newTotal = paidAmount.add(request.getAmount());
    if (newTotal.compareTo(totalAmount) > 0) {
      throw new RuntimeException("Payment amount exceeds remaining balance. " +
          "Remaining: " + totalAmount.subtract(paidAmount) +
          ", Attempted: " + request.getAmount());
    }

    // Crear el pago
    PaymentEntity payment = new PaymentEntity();
    payment.setAmount(request.getAmount());
    payment.setPaymentDate(LocalDate.now());
    payment.setPaymentMethod(request.getPaymentMethod());
    payment.setBooking(booking);

    // Guardar el pago
    PaymentEntity savedPayment = paymentRepository.save(payment);

    // Actualizar el estado de la reserva si está completamente pagada
    if (newTotal.compareTo(totalAmount) == 0) {
      booking.setStatus("PAID");
      bookingRepository.save(booking);
    }

    return paymentMapper.toResponse(savedPayment);
  }

  @Transactional(readOnly = true)
  public PaymentSummaryResponse getPaymentSummary(Long bookingId) {
    // Verificar que la reserva existe
    BookingEntity booking = bookingRepository.findById(bookingId)
        .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));

    // Obtener todos los pagos de la reserva
    List<PaymentEntity> payments = paymentRepository.findByBookingIdOrderByPaymentDateDesc(bookingId);

    // Calcular montos
    BigDecimal totalAmount = booking.getTravel().getPrice();
    BigDecimal paidAmount = paymentRepository.getTotalPaidAmountByBookingId(bookingId);

    return paymentMapper.toPaymentSummary(bookingId, totalAmount, paidAmount, payments);
  }

  @Transactional(readOnly = true)
  public List<PaymentResponse> getPaymentsByBooking(Long bookingId) {
    // Verificar que la reserva existe
    bookingRepository.findById(bookingId)
        .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));

    List<PaymentEntity> payments = paymentRepository.findByBookingIdOrderByPaymentDateDesc(bookingId);
    return paymentMapper.toResponseList(payments);
  }

  @Transactional(readOnly = true)
  public List<PaymentResponse> getPaymentsByUser(Long userId) {
    List<PaymentEntity> payments = paymentRepository.findByUserIdOrderByPaymentDateDesc(userId);
    return paymentMapper.toResponseList(payments);
  }

  @Transactional(readOnly = true)
  public PaymentResponse getPaymentById(Long paymentId) {
    PaymentEntity payment = paymentRepository.findById(paymentId)
        .orElseThrow(() -> new RuntimeException("Payment not found with id: " + paymentId));

    return paymentMapper.toResponse(payment);
  }

  @Transactional
  public void cancelPayment(Long paymentId) {
    PaymentEntity payment = paymentRepository.findById(paymentId)
        .orElseThrow(() -> new RuntimeException("Payment not found with id: " + paymentId));

    // Solo permitir cancelar pagos del día actual (simulación de política de
    // negocio)
    if (!payment.getPaymentDate().equals(LocalDate.now())) {
      throw new RuntimeException("Can only cancel payments made today");
    }

    // Actualizar el estado de la reserva si es necesario
    BookingEntity booking = payment.getBooking();
    BigDecimal totalAmount = booking.getTravel().getPrice();
    BigDecimal currentPaidAmount = paymentRepository.getTotalPaidAmountByBookingId(booking.getId());
    BigDecimal newPaidAmount = currentPaidAmount.subtract(payment.getAmount());

    if (currentPaidAmount.compareTo(totalAmount) == 0 && newPaidAmount.compareTo(totalAmount) < 0) {
      // Si estaba completamente pagado y ahora ya no, cambiar estado
      booking.setStatus("CONFIRMED");
      bookingRepository.save(booking);
    }

    // Eliminar el pago
    paymentRepository.deleteById(paymentId);
  }

  public List<PaymentResponse> getAllPayments() {
    List<PaymentEntity> payments = paymentRepository.findAll();
    return payments.stream()
        .map(paymentMapper::toResponse)
        .collect(Collectors.toList());
  }

  public List<PaymentResponse> filterPayments(String userEmail, String paymentMethod, 
      BigDecimal minAmount, BigDecimal maxAmount, LocalDate dateFrom, LocalDate dateTo) {
    List<PaymentEntity> payments = paymentRepository.findAll();
    
    return payments.stream()
        .filter(payment -> userEmail == null || (payment.getBooking() != null && payment.getBooking().getUser() != null && 
            payment.getBooking().getUser().getEmail().toLowerCase().contains(userEmail.toLowerCase())))
        .filter(payment -> paymentMethod == null || payment.getPaymentMethod().equalsIgnoreCase(paymentMethod))
        .filter(payment -> minAmount == null || payment.getAmount().compareTo(minAmount) >= 0)
        .filter(payment -> maxAmount == null || payment.getAmount().compareTo(maxAmount) <= 0)
        .filter(payment -> dateFrom == null || !payment.getPaymentDate().isBefore(dateFrom))
        .filter(payment -> dateTo == null || !payment.getPaymentDate().isAfter(dateTo))
        .map(paymentMapper::toResponse)
        .collect(Collectors.toList());
  }
}
