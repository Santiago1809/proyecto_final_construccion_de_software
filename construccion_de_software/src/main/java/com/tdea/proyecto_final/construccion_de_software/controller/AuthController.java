package com.tdea.proyecto_final.construccion_de_software.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tdea.proyecto_final.construccion_de_software.dto.LoginRequest;
import com.tdea.proyecto_final.construccion_de_software.entity.UserEntity;
import com.tdea.proyecto_final.construccion_de_software.service.LoginUserService;
import com.tdea.proyecto_final.construccion_de_software.service.RegisterUserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
  private final RegisterUserService registerUserUseCase;
  private final LoginUserService loginUserUseCase;

  @PostMapping("/register")
  public ResponseEntity<UserEntity> register(@RequestBody UserEntity user) {
    UserEntity result = registerUserUseCase.register(user);
    return ResponseEntity.ok(result);
  }

  @PostMapping("/login")
  public ResponseEntity<UserEntity> login(@RequestBody LoginRequest loginRequest) {
    UserEntity loggedInUser = loginUserUseCase.login(loginRequest.getUsername(), loginRequest.getPassword());
    return ResponseEntity.ok(loggedInUser);
  }
}
