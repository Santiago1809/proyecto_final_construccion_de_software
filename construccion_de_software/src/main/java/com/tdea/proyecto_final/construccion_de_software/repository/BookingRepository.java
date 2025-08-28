package com.tdea.proyecto_final.construccion_de_software.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.tdea.proyecto_final.construccion_de_software.entity.BookingEntity;

import lombok.RequiredArgsConstructor;

@Repository
interface JpaBookingRepository extends JpaRepository<BookingEntity, Long> {
  List<BookingEntity> findByUserId(Long user_id);
}

@Component
@RequiredArgsConstructor
public class BookingRepository {
  private final JpaBookingRepository jpaBookingRepository;

  public BookingEntity save(BookingEntity booking) {
    return jpaBookingRepository.save(booking);
  }

  public void deleteById(Long id) {
    jpaBookingRepository.deleteById(id);
  }

  public Optional<BookingEntity> findById(Long id) {
    return jpaBookingRepository.findById(id);
  }

  public List<BookingEntity> findAll() {
    return jpaBookingRepository.findAll();
  }

  public List<BookingEntity> findByUserId(Long userId) {
    return jpaBookingRepository.findByUserId(userId);
  }
}
