package com.daw.garage23.web.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/alta/{clienteId}")
    public ResponseEntity<?> darALtaVehiculo(@PathVariable int clienteId, @RequestBody Vehiculo vehiculo) {

        try {
            Vehiculo creado = vehiculoServices.darAltaVehiculo(clienteId, vehiculo);
            return ResponseEntity.ok(creado);

        } catch (VehiculoException e) {	
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
