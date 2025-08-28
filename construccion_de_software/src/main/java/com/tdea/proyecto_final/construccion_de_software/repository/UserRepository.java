package com.tdea.proyecto_final.construccion_de_software.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.tdea.proyecto_final.construccion_de_software.entity.UserEntity;

import lombok.RequiredArgsConstructor;

@Repository
interface JpaUserRepository extends JpaRepository<UserEntity, Long> {
  Optional<UserEntity> findByUsername(String username);
}

@Component
@RequiredArgsConstructor
public class UserRepository {

  private final JpaUserRepository jpaUserRepository;

  public UserEntity save(UserEntity user) {
    return jpaUserRepository.save(user);
  }

  public Optional<UserEntity> findByUsername(String username) {
    return jpaUserRepository.findByUsername(username);
  }

  public Optional<UserEntity> findById(Long id) {
    return jpaUserRepository.findById(id);
  }

}
