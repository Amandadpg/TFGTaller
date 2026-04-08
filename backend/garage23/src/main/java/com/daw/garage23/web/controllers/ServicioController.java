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

import com.daw.garage23.services.ServicioServices;
import com.daw.garage23.services.dto.Servicios.ServicioRequestDTO;
import com.daw.garage23.services.dto.Servicios.ServicioResponseDTO;

@RestController
@RequestMapping("/servicios")
public class ServicioController {

	@Autowired
    private ServicioServices servicioServices;
	
	// Admin y usuario
    // Listar todos los servicios
    @GetMapping("/")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    public ResponseEntity<List<ServicioResponseDTO>> listarServicios() {
        return ResponseEntity.ok(servicioServices.listarTodosServicios());
    }

    // Admin
    // Añadir servicio
    @PostMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ServicioResponseDTO> crearServicio(@RequestBody ServicioRequestDTO request) {
        return ResponseEntity.ok(servicioServices.añadirServicio(request));
    }

    // Admin
    // Modificar servicio
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ServicioResponseDTO> actualizarServicio(
            @PathVariable int id, 
            @RequestBody ServicioRequestDTO request) {
        return ResponseEntity.ok(servicioServices.modificarServicio(id, request));
    }

    // Admin
    // Eliminar servicio
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> eliminarServicio(@PathVariable int id) {
        servicioServices.eliminarServicio(id);
        return ResponseEntity.ok("Servicio eliminado correctamente");
    }

    // Admin y usuario
    // Buscar servicio por nombre
    @GetMapping("/buscar")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    public ResponseEntity<List<ServicioResponseDTO>> buscarPorNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(servicioServices.buscarServiciosPorNombre(nombre));
    }
}
