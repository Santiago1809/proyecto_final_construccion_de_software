package com.tdea.proyecto_final.construccion_de_software.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.tdea.proyecto_final.construccion_de_software.entity.TravelEntity;

import lombok.RequiredArgsConstructor;

@Repository
interface JpaTravelRepository extends JpaRepository<TravelEntity, Long> {
}

@Component
@RequiredArgsConstructor
public class TravelRepository {

  private final JpaTravelRepository jpaTravelRepository;

  public TravelEntity save(TravelEntity travel) {
    return jpaTravelRepository.save(travel);
  }

  public void deleteById(Long id) {
    jpaTravelRepository.deleteById(id);
  }

  public Optional<TravelEntity> findById(Long id) {
    return jpaTravelRepository.findById(id);
  }

  public List<TravelEntity> findAll() {
    return jpaTravelRepository.findAll();
  }

}
