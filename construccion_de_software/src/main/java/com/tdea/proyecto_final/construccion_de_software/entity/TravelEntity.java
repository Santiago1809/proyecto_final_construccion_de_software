package com.tdea.proyecto_final.construccion_de_software.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "travels")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TravelEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String destination;
  private LocalDate departureDate;
  private LocalDate returnDate;
  private BigDecimal price;
  @Column(length = 2000)
  private String itinerary;

  @OneToMany(mappedBy = "travel")
  @JsonManagedReference("travel-bookings")
  private List<BookingEntity> bookings;
}
