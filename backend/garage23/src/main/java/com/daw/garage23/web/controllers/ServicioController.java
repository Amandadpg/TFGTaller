package com.daw.garage23.web.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.daw.garage23.persistence.entities.Servicio;
import com.daw.garage23.services.exceptions.Servicio.ServicioException;

@RestController
@RequestMapping("/servicios")
public class ServicioController {

//	public Servicio añadirServicio(Servicio servicio) {
//	    // Validaciones básicas
//	    if (servicio.getNombreServicio() == null || servicio.getNombreServicio().isBlank()) {
//	        throw new ServicioException("Debe introducir el nombre del servicio.");
//	    }
//
//	    if (servicio.getDescripcion() == null || servicio.getDescripcion().isBlank()) {
//	        throw new ServicioException("Debe introducir la descripción del servicio.");
//	    }
//
//	    if (servicio.getPrecio() <= 0) {
//	        throw new ServicioException("El precio debe ser mayor que 0.");
//	    }
//
//	    if (servicio.getDuracionMinutos() <= 0) {
//	        throw new ServicioException("La duración debe ser mayor que 0 minutos.");
//	    }
//
//	    // Validar duplicados
//	    if (servicioRepository.existsByNombreServicio(servicio.getNombreServicio())) {
//	        throw new ServicioException("Ya existe un servicio con ese nombre.");
//	    }
//
//	    // Guardar
//	    return servicioRepository.save(servicio);
//	}

}
