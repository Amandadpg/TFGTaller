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

import com.daw.garage23.persistence.entities.Servicio;
import com.daw.garage23.services.ServicioServices;
import com.daw.garage23.services.dto.Servicios.ServicioResponseDTO;
import com.daw.garage23.services.exceptions.Servicio.ServicioException;

@RestController
@RequestMapping("/servicios")
public class ServicioController {

	@Autowired
    private ServicioServices servicioServices;
	
	//Listar todos los servicios
	@GetMapping
	public List<Servicio> listarServicios() {
	    return servicioServices.listarTodosServicios();
	}


    // Añadir un nuevo servicio
	@PostMapping("/crear")
    public Servicio crearServicio(@RequestBody Servicio servicio) {
        return servicioServices.añadirServicio(servicio);
    }	
	
	//Modificar un servicio
	@PutMapping("/{id}")
	public Servicio modificarServicio(@PathVariable int id, @RequestBody Servicio servicio) {
	    return servicioServices.modificarServicio(id, servicio);
	}


	@DeleteMapping("/{id}")
	public ResponseEntity<String> eliminarServicio(@PathVariable int id) {
	    servicioServices.eliminarServicio(id);
	    return ResponseEntity.ok("Servicio eliminado correctamente");
	}
	
	@GetMapping("/buscar")
	public ResponseEntity<List<ServicioResponseDTO>> buscarServiciosPorNombre(@RequestParam String nombre) {
	    List<ServicioResponseDTO> servicios = servicioServices.buscarServiciosPorNombre(nombre);
	    return ResponseEntity.ok(servicios);
	}
}
