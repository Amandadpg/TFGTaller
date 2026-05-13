package com.daw.garage23.web.controllers;

import java.util.List;

import org.springframework.security.core.Authentication;
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

import com.daw.garage23.services.UsuarioServices;
import com.daw.garage23.services.VehiculoServices;
import com.daw.garage23.services.dto.Vehiculos.VehiculoRequestDTO;
import com.daw.garage23.services.dto.Vehiculos.VehiculoResponseDTO;

@RestController
@RequestMapping("/vehiculos")
public class VehiculoController {
	
	@Autowired
    private VehiculoServices vehiculoServices;
	
	@Autowired
    private UsuarioServices usuarioServices;
	
	@GetMapping("/mis-vehiculos")
    @PreAuthorize("hasAuthority('CLIENTE')")
    public ResponseEntity<List<VehiculoResponseDTO>> listarMisVehiculos(Authentication authentication) {
        String email = authentication.getName(); 
        
        int usuarioId = usuarioServices.obtenerIdPorEmail(email); 
        
        return ResponseEntity.ok(vehiculoServices.listarVehiculosPorUsuario(usuarioId));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<VehiculoResponseDTO>> listarTodosVehiculos() {
        return ResponseEntity.ok(vehiculoServices.listarTodosVehiculos());
    }

    @GetMapping("/buscar-matricula")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CLIENTE')") 
    public ResponseEntity<List<VehiculoResponseDTO>> buscarVehiculosPorMatri(@RequestParam String matricula) {
        List<VehiculoResponseDTO> vehiculos = vehiculoServices.buscarVehiculosPorMatricula(matricula);
        return ResponseEntity.ok(vehiculos);
    }

    // Buscar vehículo por marca
    @GetMapping("/buscar-marca")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<VehiculoResponseDTO>> buscarVehiculosPorMarca(@RequestParam String marca) {
        List<VehiculoResponseDTO> vehiculos = vehiculoServices.buscarVehiculosPorMarca(marca);
        return ResponseEntity.ok(vehiculos);
    }

    @PostMapping("/alta")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CLIENTE')")
    public ResponseEntity<VehiculoResponseDTO> darAltaVehiculo(@RequestBody VehiculoRequestDTO request, Authentication authentication) {
        
        if (request.getDniCliente() == null || request.getDniCliente().trim().isEmpty()) {
            
            String email = authentication.getName();
            
            int idUsuario = usuarioServices.obtenerIdPorEmail(email);
            String dniReal = usuarioServices.buscarEntidadPorId(idUsuario).getDni();
            
            request.setDniCliente(dniReal);
        }

        return ResponseEntity.ok(vehiculoServices.darAltaVehiculo(request));
    }

    @PutMapping("/{vehiculoId}")
    @PreAuthorize("hasAuthority('ADMIN') or @vehiculoServices.esDuenioDelVehiculo(#vehiculoId, authentication.name)") 
    public ResponseEntity<VehiculoResponseDTO> modificarVehiculo(
            @PathVariable int vehiculoId, 
            @RequestBody VehiculoRequestDTO request,
            Authentication authentication) { 
        
        if (request.getDniCliente() == null || request.getDniCliente().trim().isEmpty()) {
            String email = authentication.getName();
            
            int idUsuario = usuarioServices.obtenerIdPorEmail(email);
            String dniReal = usuarioServices.buscarEntidadPorId(idUsuario).getDni();
            
            request.setDniCliente(dniReal);
        }

        return ResponseEntity.ok(vehiculoServices.modificarVehiculo(vehiculoId, request));
    }

    @DeleteMapping("/{vehiculoId}")
    @PreAuthorize("hasAuthority('ADMIN') or @vehiculoServices.esDuenioDelVehiculo(#vehiculoId, authentication.name)") // <-- CAMBIADO
    public ResponseEntity<String> eliminarVehiculo(@PathVariable int vehiculoId) {

        vehiculoServices.eliminarVehiculo(vehiculoId);

        return ResponseEntity.ok("Vehículo eliminado correctamente");
    }

}