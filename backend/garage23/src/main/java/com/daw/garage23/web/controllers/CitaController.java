package com.daw.garage23.web.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.daw.garage23.persistence.entities.enums.Estado;
import com.daw.garage23.services.CitaServices;
import com.daw.garage23.services.dto.Citas.CitaRequestDTO;
import com.daw.garage23.services.dto.Citas.CitaResponseDTO;

@RestController
@RequestMapping("/citas")
public class CitaController {
	
	@Autowired
    private CitaServices citaServices;
	
	//Listar todas las citas
	@GetMapping
	public ResponseEntity<List<CitaResponseDTO>> listar() {
	    return ResponseEntity.ok(citaServices.listarTodas());
	}

	//Reservar una cita
	@PostMapping
	public ResponseEntity<CitaResponseDTO> reservar(@RequestBody CitaRequestDTO dto) {
	    return ResponseEntity.status(HttpStatus.CREATED).body(citaServices.reservar(dto));
	}
	
	//Cambiar solo el estado de la cita
	@PatchMapping("/{id}/estado")
	public ResponseEntity<CitaResponseDTO> cambiarEstado(@PathVariable int id, @RequestParam Estado estado) {
	    return ResponseEntity.ok(citaServices.cambiarEstado(id, estado));
	}

}
