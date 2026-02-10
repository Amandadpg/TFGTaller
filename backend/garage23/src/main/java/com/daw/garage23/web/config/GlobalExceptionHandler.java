package com.daw.garage23.web.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;

import com.daw.garage23.services.exceptions.Cliente.ClienteException;
import com.daw.garage23.services.exceptions.Cliente.ClienteNotFoundException;
import com.daw.garage23.services.exceptions.Vehiculo.VehiculoException;

@RestController
public class GlobalExceptionHandler {
	
	// --- Cliente ---
    @ExceptionHandler(ClienteNotFoundException.class)
    public ResponseEntity<String> handleClienteNotFound(ClienteNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(ClienteException.class)
    public ResponseEntity<String> handleClienteBadRequest(ClienteException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    // --- Vehículo ---
    @ExceptionHandler(VehiculoException.class)
    public ResponseEntity<String> handleVehiculoBadRequest(VehiculoException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    // --- Excepciones no controladas ---
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleOtherExceptions(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body("Error inesperado: " + ex.getMessage());
    }

}
