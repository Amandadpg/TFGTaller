package com.daw.garage23.web.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.daw.garage23.services.exceptions.Cita.CitaException;
import com.daw.garage23.services.exceptions.Cita.CitaNotFoundException;
import com.daw.garage23.services.exceptions.Servicio.ServicioException;
import com.daw.garage23.services.exceptions.Servicio.ServicioNotFoundException;
import com.daw.garage23.services.exceptions.Usuario.UsuarioException;
import com.daw.garage23.services.exceptions.Usuario.UsuarioNotFoundException;
import com.daw.garage23.services.exceptions.Vehiculo.VehiculoException;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	// --- Cliente ---
    @ExceptionHandler(UsuarioNotFoundException.class)
    public ResponseEntity<String> handleClienteNotFound(UsuarioNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(UsuarioException.class)
    public ResponseEntity<String> handleClienteBadRequest(UsuarioException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    // --- Vehículo ---
    @ExceptionHandler(VehiculoException.class)
    public ResponseEntity<String> handleVehiculoBadRequest(VehiculoException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
    
 // --- Servicio ---
    @ExceptionHandler(ServicioNotFoundException.class)
    public ResponseEntity<String> handleServicioNotFound(ServicioNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(ServicioException.class)
    public ResponseEntity<String> handleServicioBadRequest(ServicioException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
    
 // --- Cita ---
    @ExceptionHandler(CitaNotFoundException.class)
    public ResponseEntity<String> handleCitaNotFound(CitaNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(CitaException.class)
    public ResponseEntity<String> handleCitaBadRequest(CitaException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }


    // --- Excepciones no controladas ---
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleOtherExceptions(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body("Error inesperado: " + ex.getMessage());
    }

}
