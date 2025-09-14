package com.tdea.proyecto_final.construccion_de_software.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.tdea.proyecto_final.construccion_de_software.entity.UserEntity;
import com.tdea.proyecto_final.construccion_de_software.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LoginUserService {

  private final UserRepository userRepositoryAdapter;
  private final PasswordEncoder passwordEncoder;

  public UserEntity login(String username, String rawPassword) {
    UserEntity user = userRepositoryAdapter.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("User not found"));
      System.out.println(rawPassword);
    // Verify password using BCrypt
    if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    return user;
  }
}
