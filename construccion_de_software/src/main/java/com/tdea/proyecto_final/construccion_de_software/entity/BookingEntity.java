package com.tdea.proyecto_final.construccion_de_software.entity;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String status;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  @JsonBackReference("user-bookings")
  private UserEntity user;

  @ManyToOne
  @JoinColumn(name = "travel_id", nullable = false)
  @JsonBackReference("travel-bookings")
  private TravelEntity travel;

  @OneToMany(mappedBy = "booking")
  @JsonManagedReference("booking-payments")
  private List<PaymentEntity> payments;
}
