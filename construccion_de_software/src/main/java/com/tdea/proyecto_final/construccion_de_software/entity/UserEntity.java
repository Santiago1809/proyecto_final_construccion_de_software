package com.tdea.proyecto_final.construccion_de_software.entity;

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
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(unique = true, nullable = false)
  private String username;
  @Column(nullable = false)
  private String password;
  private String rol = "CLIENT";
  @Column(length = 100, nullable = false)
  private String name;
  @Column(length = 100, nullable = false)
  private String surname;
  @Column(unique = true, nullable = false)
  private String email;
  private String phoneNumber;
  private String address;
  @OneToMany(mappedBy = "user")
  @JsonManagedReference("user-bookings")
  private List<BookingEntity> bookings;
}
