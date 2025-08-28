package com.tdea.proyecto_final.construccion_de_software.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import com.tdea.proyecto_final.construccion_de_software.repository.UserRepository;
import com.tdea.proyecto_final.construccion_de_software.entity.UserEntity;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RegisterUserService {

  private final UserRepository userRepositoryAdapter;
  private final PasswordEncoder passwordEncoder;
  private List<String> roles = List.of("ADMIN", "CLIENT");

  public String register(UserEntity user) {
    if (!roles.contains(user.getRol()))
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role: " + user.getRol());
    if (user.getPassword().length() < 8)
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 8 characters long");
    if (user.getPassword().length() > 50)
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must not exceed 50 characters");

    try {
      // Encrypt the password before saving
      String encryptedPassword = passwordEncoder.encode(user.getPassword());
      user.setPassword(encryptedPassword);

      UserEntity saved = userRepositoryAdapter.save(user);
      return "User registered successfully: " + saved.getUsername();
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "User already exists or invalid data");
    }
  }

}
