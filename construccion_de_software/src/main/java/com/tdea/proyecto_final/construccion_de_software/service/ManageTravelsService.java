package com.tdea.proyecto_final.construccion_de_software.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

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

  public TravelEntity updateTravel(Long id, TravelEntity travelData) {
    TravelEntity existingTravel = travelRepository.findById(id).orElse(null);
    if (existingTravel != null) {
      existingTravel.setDestination(travelData.getDestination());
      existingTravel.setDepartureDate(travelData.getDepartureDate());
      existingTravel.setReturnDate(travelData.getReturnDate());
      existingTravel.setPrice(travelData.getPrice());
      existingTravel.setItinerary(travelData.getItinerary());
      return travelRepository.save(existingTravel);
    }
    return null;
  }

  public void deleteTravel(Long id) {
    travelRepository.deleteById(id);
  }

  public List<TravelEntity> filterTravels(String destination, LocalDate departureDate, LocalDate arrivalDate, String status) {
    List<TravelEntity> travels = travelRepository.findAll();
    
    return travels.stream()
        .filter(travel -> destination == null || travel.getDestination().toLowerCase().contains(destination.toLowerCase()))
        .filter(travel -> departureDate == null || travel.getDepartureDate().isAfter(departureDate) || travel.getDepartureDate().isEqual(departureDate))
        .filter(travel -> arrivalDate == null || travel.getReturnDate().isBefore(arrivalDate) || travel.getReturnDate().isEqual(arrivalDate))
        .filter(travel -> status == null || status.equals("") || travel.getStatus().equalsIgnoreCase(status))
        .collect(Collectors.toList());
  }
}
