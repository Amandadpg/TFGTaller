package com.daw.garage23.web.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.daw.garage23.persistence.entities.Vehiculo;
import com.daw.garage23.services.VehiculoServices;
import com.daw.garage23.services.dto.Vehiculos.VehiculoResponseDTO;

@RestController
@RequestMapping("/vehiculos")
public class VehiculoController {
	
	@Autowired
    private VehiculoServices vehiculoServices;
	
	
	//Lista todos los vehiculos
	@GetMapping
	public ResponseEntity<List<Vehiculo>> listarTodosVehiculos() {
	    return ResponseEntity.ok(vehiculoServices.listarTodosVehiculos());
	}

    // Listar vehículos de un Usuario
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Vehiculo>> listarVehiculosPorUsuario(@PathVariable int usuarioId) {
        return ResponseEntity.ok(vehiculoServices.listarVehiculosPorUsuario(usuarioId));
    }
    
    //Buscar vehiculo por matricula
    @GetMapping("/buscar-matricula")
    public ResponseEntity<List<VehiculoResponseDTO>> buscarVehiculosPorMatri(@RequestParam String matricula) {
        List<VehiculoResponseDTO> vehiculos = vehiculoServices.buscarVehiculosPorMatricula(matricula);
        return ResponseEntity.ok(vehiculos);
    }
    
    //Buscar vehiculo por marca
    @GetMapping("/buscar-marca")
    public ResponseEntity<List<VehiculoResponseDTO>> buscarVehiculosPorMarca(@RequestParam String marca) {
        List<VehiculoResponseDTO> vehiculos = vehiculoServices.buscarVehiculosPorMarca(marca);
        return ResponseEntity.ok(vehiculos);
    }

    // Dar de alta un vehículo para un Usuario
    @PostMapping("/alta/{usuarioId}")
    public ResponseEntity<Vehiculo> darALtaVehiculo(@PathVariable int usuarioId, @RequestBody Vehiculo vehiculo) {
        return ResponseEntity.ok(vehiculoServices.darAltaVehiculo(usuarioId, vehiculo));
    }
    
    @PutMapping("/{vehiculoId}")
    public ResponseEntity<Vehiculo> modificarVehiculo(
            @PathVariable int vehiculoId,
            @RequestBody Vehiculo vehiculoNuevo) {
        Vehiculo modificado = vehiculoServices.modificarVehiculo(vehiculoId, vehiculoNuevo);
        return ResponseEntity.ok(modificado);
    }

    // Eliminar vehículo por su id
    @DeleteMapping("/{vehiculoId}")
    public ResponseEntity<String> eliminarVehiculo(@PathVariable int vehiculoId) {
        vehiculoServices.eliminarVehiculo(vehiculoId);
        return ResponseEntity.ok("Vehículo eliminado correctamente");
    }

}
