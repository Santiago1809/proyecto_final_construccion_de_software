package com.tdea.proyecto_final.construccion_de_software.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tdea.proyecto_final.construccion_de_software.entity.PaymentEntity;

@Repository
public interface JpaPaymentRepository extends JpaRepository<PaymentEntity, Long> {

  List<PaymentEntity> findByBookingId(Long bookingId);

  List<PaymentEntity> findByBookingIdOrderByPaymentDateDesc(Long bookingId);

  @Query("SELECT p FROM PaymentEntity p WHERE p.booking.user.id = :userId ORDER BY p.paymentDate DESC")
  List<PaymentEntity> findByUserIdOrderByPaymentDateDesc(@Param("userId") Long userId);

  @Query("SELECT COALESCE(SUM(p.amount), 0) FROM PaymentEntity p WHERE p.booking.id = :bookingId")
  java.math.BigDecimal getTotalPaidAmountByBookingId(@Param("bookingId") Long bookingId);
}
