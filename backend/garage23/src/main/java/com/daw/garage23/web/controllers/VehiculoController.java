package com.daw.garage23.web.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.daw.garage23.persistence.entities.Vehiculo;
import com.daw.garage23.services.VehiculoServices;
import com.daw.garage23.services.dto.Vehiculos.VehiculoRequestDTO;
import com.daw.garage23.services.dto.Vehiculos.VehiculoResponseDTO;

@RestController
@RequestMapping("/vehiculos")
public class VehiculoController {
	
	@Autowired
    private VehiculoServices vehiculoServices;
	
	
	//Lista todos los vehiculos
	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<VehiculoResponseDTO>> listarTodosVehiculos() {
        return ResponseEntity.ok(vehiculoServices.listarTodosVehiculos());
    }

    // Listar vehículos de un usuario
    @GetMapping("/usuario/{usuarioId}")
    @PreAuthorize("hasRole('ADMIN') or @usuarioServices.esElMismoUsuario(#usuarioId, authentication.name)")
    public ResponseEntity<List<VehiculoResponseDTO>> listarVehiculosPorUsuario(@PathVariable int usuarioId) {
        return ResponseEntity.ok(vehiculoServices.listarVehiculosPorUsuario(usuarioId));
    }

    // Buscar vehículo por matrícula
    @GetMapping("/buscar-matricula")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    public ResponseEntity<List<VehiculoResponseDTO>> buscarVehiculosPorMatri(@RequestParam String matricula) {
        List<VehiculoResponseDTO> vehiculos = vehiculoServices.buscarVehiculosPorMatricula(matricula);
        return ResponseEntity.ok(vehiculos);
    }

    // Buscar vehículo por marca
    @GetMapping("/buscar-marca")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<VehiculoResponseDTO>> buscarVehiculosPorMarca(@RequestParam String marca) {
        List<VehiculoResponseDTO> vehiculos = vehiculoServices.buscarVehiculosPorMarca(marca);
        return ResponseEntity.ok(vehiculos);
    }

    // Dar de alta vehículo
    @PostMapping("/alta")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    public ResponseEntity<VehiculoResponseDTO> darAltaVehiculo(@RequestBody VehiculoRequestDTO request) {
        return ResponseEntity.ok(vehiculoServices.darAltaVehiculo(request));
    }

    // Modificar vehículo
    @PutMapping("/{vehiculoId}")
    @PreAuthorize("hasRole('ADMIN') or @vehiculoServices.esDuenioDelVehiculo(#vehiculoId, authentication.name)")
    public ResponseEntity<VehiculoResponseDTO> modificarVehiculo(
            @PathVariable int vehiculoId, 
            @RequestBody VehiculoRequestDTO request) {
        return ResponseEntity.ok(vehiculoServices.modificarVehiculo(vehiculoId, request));
    }

    // Eliminar vehículo
    @DeleteMapping("/{vehiculoId}")
    @PreAuthorize("hasRole('ADMIN') or @vehiculoServices.esDuenioDelVehiculo(#vehiculoId, authentication.name)")
    public ResponseEntity<String> eliminarVehiculo(@PathVariable int vehiculoId) {

        vehiculoServices.eliminarVehiculo(vehiculoId);

        return ResponseEntity.ok("Vehículo eliminado correctamente");
    }

}
