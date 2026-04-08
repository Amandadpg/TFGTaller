package com.daw.garage23.web.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
	@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CitaResponseDTO>> obtenerTodas() {
        return ResponseEntity.ok(citaServices.listarTodas());
    }
	
	@GetMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN') or @citaServices.esDuenioDeLaCita(#id, authentication.name)")
	public ResponseEntity<CitaResponseDTO> buscarPorId(@PathVariable int id) {
	    CitaResponseDTO respuesta = citaServices.buscarPorId(id);
	    return ResponseEntity.ok(respuesta);
	}
	
	@GetMapping("/buscar")
	@PreAuthorize("hasAnyRole('ADMIN')")
	public ResponseEntity<List<CitaResponseDTO>> buscarPorNombre(@RequestParam String nombre) {
	    List<CitaResponseDTO> lista = citaServices.buscarCitasPorNombreUsuario(nombre);
	    return ResponseEntity.ok(lista);
	}

    @PostMapping("/reservar")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    public ResponseEntity<CitaResponseDTO> reservar(@RequestBody CitaRequestDTO request) {
        return ResponseEntity.ok(citaServices.reservar(request));
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    public ResponseEntity<CitaResponseDTO> cambiarEstado(
            @PathVariable int id, 
            @RequestParam Estado nuevoEstado) {
        return ResponseEntity.ok(citaServices.cambiarEstado(id, nuevoEstado));
    }
    
    
    @PutMapping("/{id}/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CitaResponseDTO> modificarAdmin(
            @PathVariable int id, 
            @RequestBody CitaRequestDTO dto) {
        return ResponseEntity.ok(citaServices.modificarCitaAdmin(id, dto));
    }

    // El CLIENTE puede modificar su cita (ej: cambiar hora/día) 
    // pero el Service comprobará las 24h
    @PutMapping("/{id}/cliente")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<CitaResponseDTO> modificarCitaCliente(
            @PathVariable int id, 
            @RequestBody CitaRequestDTO dto) {
        return ResponseEntity.ok(citaServices.modificarCitaCliente(id, dto));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @citaServices.esDuenioDeLaCita(#id, authentication.name)")
    public ResponseEntity<String> eliminarCita(@PathVariable int id) {
        citaServices.eliminarCita(id);
        return ResponseEntity.ok("Cita eliminada correctamente del sistema.");
    }

}
