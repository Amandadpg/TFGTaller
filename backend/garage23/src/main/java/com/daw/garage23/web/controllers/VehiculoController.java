package com.daw.garage23.web.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.daw.garage23.persistence.entities.Vehiculo;
import com.daw.garage23.services.VehiculoServices;
import com.daw.garage23.services.exceptions.Vehiculo.VehiculoException;

@RestController
@RequestMapping("/vehiculos")
public class VehiculoController {
	
	@Autowired
    private VehiculoServices vehiculoServices;

    // Listar vehículos de un cliente
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Vehiculo>> listarVehiculosPorCliente(@PathVariable int clienteId) {
        return ResponseEntity.ok(vehiculoServices.listarVehiculosPorCliente(clienteId));
    }

    // Dar de alta un vehículo para un cliente
    @PostMapping("/alta/{clienteId}")
    public ResponseEntity<Vehiculo> darALtaVehiculo(@PathVariable int clienteId, @RequestBody Vehiculo vehiculo) {
        return ResponseEntity.ok(vehiculoServices.darAltaVehiculo(clienteId, vehiculo));
    }
}
