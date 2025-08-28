package com.tdea.proyecto_final.construccion_de_software.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.tdea.proyecto_final.construccion_de_software.repository.TravelRepository;
import com.tdea.proyecto_final.construccion_de_software.entity.TravelEntity;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ManageTravelsService {
  private final TravelRepository travelRepository;

  public TravelEntity createTravel(TravelEntity travel) {
    return travelRepository.save(travel);
  }

  public List<TravelEntity> listTravels() {
    return travelRepository.findAll();
  }

  public TravelEntity getTravelById(Long id) {
    return travelRepository.findById(id).orElse(null);
  }
  

  public void deleteTravel(Long id) {
    travelRepository.deleteById(id);
  }
}
