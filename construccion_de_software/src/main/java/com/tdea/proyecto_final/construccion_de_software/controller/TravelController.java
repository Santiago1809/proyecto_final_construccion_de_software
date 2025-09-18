package com.tdea.proyecto_final.construccion_de_software.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tdea.proyecto_final.construccion_de_software.dto.TravelResponse;
import com.tdea.proyecto_final.construccion_de_software.entity.TravelEntity;
import com.tdea.proyecto_final.construccion_de_software.mapper.TravelMapper;
import com.tdea.proyecto_final.construccion_de_software.service.ManageTravelsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/travels")
@RequiredArgsConstructor
public class TravelController {
  private final ManageTravelsService manageTravelsUseCase;
  private final TravelMapper travelMapper;

  @PostMapping("/create")
  public ResponseEntity<TravelEntity> create(@RequestBody TravelEntity travel) {
    TravelEntity createdTravel = manageTravelsUseCase.createTravel(travel);
    return ResponseEntity.ok(createdTravel);
  }

  @GetMapping
  public ResponseEntity<List<TravelResponse>> list() {
    List<TravelEntity> travels = manageTravelsUseCase.listTravels();
    List<TravelResponse> response = travels.stream()
        .map(travelMapper::toResponse)
        .collect(Collectors.toList());
    return ResponseEntity.ok(response);
  }

  @GetMapping("/filter")
  public ResponseEntity<List<TravelResponse>> filter(
      @RequestParam(required = false) String destination,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate departureDate,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate arrivalDate,
      @RequestParam(required = false) String status) {
    
    List<TravelEntity> travels = manageTravelsUseCase.filterTravels(destination, departureDate, arrivalDate, status);
    List<TravelResponse> response = travels.stream()
        .map(travelMapper::toResponse)
        .collect(Collectors.toList());
    return ResponseEntity.ok(response);
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> getById(@PathVariable Long id) {
    TravelEntity travel = manageTravelsUseCase.getTravelById(id);
    if (travel != null) {
      TravelResponse response = travelMapper.toResponse(travel);
      return ResponseEntity.ok(response);
    } else {
      return ResponseEntity.status(404).body(
          Map.of("error", "Travel with id " + id + " not found"));
    }
  }

  @PutMapping("/update/{id}")
  public ResponseEntity<?> update(@PathVariable Long id, @RequestBody TravelEntity travelData) {
    TravelEntity updatedTravel = manageTravelsUseCase.updateTravel(id, travelData);
    if (updatedTravel != null) {
      TravelResponse response = travelMapper.toResponse(updatedTravel);
      return ResponseEntity.ok(response);
    } else {
      return ResponseEntity.status(404).body(
          Map.of("error", "Travel with id " + id + " not found"));
    }
  }

  @DeleteMapping("/delete/{id}")
  public ResponseEntity<?> delete(@PathVariable Long id) {
    TravelEntity travel = manageTravelsUseCase.getTravelById(id);
    if (travel != null) {
      manageTravelsUseCase.deleteTravel(id);
      return ResponseEntity.ok(Map.of("message", "Travel with id " + id + " deleted successfully"));
    } else {
      return ResponseEntity.status(404).body(
          Map.of("error", "Travel with id " + id + " not found"));
    }
  }

}
