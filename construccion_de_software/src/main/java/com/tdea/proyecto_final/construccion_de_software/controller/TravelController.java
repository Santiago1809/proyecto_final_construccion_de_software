package com.tdea.proyecto_final.construccion_de_software.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tdea.proyecto_final.construccion_de_software.service.ManageTravelsService;
import com.tdea.proyecto_final.construccion_de_software.entity.TravelEntity;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/travels")
@RequiredArgsConstructor
public class TravelController {
  private final ManageTravelsService manageTravelsUseCase;

  @PostMapping("/create")
  public ResponseEntity<TravelEntity> create(@RequestBody TravelEntity travel) {
    TravelEntity createdTravel = manageTravelsUseCase.createTravel(travel);
    return ResponseEntity.ok(createdTravel);
  }

  @GetMapping
  public ResponseEntity<List<TravelEntity>> list() {
    List<TravelEntity> travels = manageTravelsUseCase.listTravels();
    return ResponseEntity.ok(travels);
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> getById(@PathVariable Long id) {
    TravelEntity travel = manageTravelsUseCase.getTravelById(id);
    if (travel != null) {
      return ResponseEntity.ok(travel);
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
