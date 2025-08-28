package com.tdea.proyecto_final.construccion_de_software.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.tdea.proyecto_final.construccion_de_software.entity.PaymentEntity;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PaymentRepository {
  private final JpaPaymentRepository jpaPaymentRepository;

  public PaymentEntity save(PaymentEntity payment) {
    return jpaPaymentRepository.save(payment);
  }

  public Optional<PaymentEntity> findById(Long id) {
    return jpaPaymentRepository.findById(id);
  }

  public List<PaymentEntity> findByBookingId(Long bookingId) {
    return jpaPaymentRepository.findByBookingId(bookingId);
  }

  public List<PaymentEntity> findByBookingIdOrderByPaymentDateDesc(Long bookingId) {
    return jpaPaymentRepository.findByBookingIdOrderByPaymentDateDesc(bookingId);
  }

  public List<PaymentEntity> findByUserIdOrderByPaymentDateDesc(Long userId) {
    return jpaPaymentRepository.findByUserIdOrderByPaymentDateDesc(userId);
  }

  public BigDecimal getTotalPaidAmountByBookingId(Long bookingId) {
    return jpaPaymentRepository.getTotalPaidAmountByBookingId(bookingId);
  }

  public void deleteById(Long id) {
    jpaPaymentRepository.deleteById(id);
  }

  public List<PaymentEntity> findAll() {
    return jpaPaymentRepository.findAll();
  }
}
