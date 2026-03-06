package com.daw.garage23.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daw.garage23.persistence.entities.Servicio;
import com.daw.garage23.persistence.repositories.ServicioRepository;
import com.daw.garage23.services.dto.Servicios.ServicioResponseDTO;
import com.daw.garage23.services.exceptions.Servicio.ServicioException;
import com.daw.garage23.services.exceptions.Servicio.ServicioNotFoundException;

@Service
public class ServicioServices {
	
	@Autowired
	private ServicioRepository servicioRepository;
	
	//Admin y usuario
	public List<Servicio> listarTodosServicios() {
	    return servicioRepository.findAll();
	}
	
	//Admin
	public Servicio añadirServicio(Servicio servicio) {
	    // Validaciones básicas
	    if (servicio.getNombreServicio() == null || servicio.getNombreServicio().isBlank()) {
	        throw new ServicioException("Debe introducir el nombre del servicio.");
	    }

	    if (servicio.getDescripcion() == null || servicio.getDescripcion().isBlank()) {
	        throw new ServicioException("Debe introducir la descripción del servicio.");
	    }

	    if (servicio.getPrecio() <= 0) {
	        throw new ServicioException("El precio debe ser mayor que 0.");
	    }

	    if (servicio.getDuracionMinutos() <= 0) {
	        throw new ServicioException("La duración debe ser mayor que 0 minutos.");
	    }

	    // Validar duplicados
	    if (servicioRepository.existsByNombreServicio(servicio.getNombreServicio())) {
	        throw new ServicioException("Ya existe un servicio con ese nombre.");
	    }

	    // Guardar
	    return servicioRepository.save(servicio);
	}
	
	//Admin
	public Servicio modificarServicio(int id, Servicio servicioNuevo) {

	    // Buscar el servicio o lanzar excepción
	    Servicio servicioExistente = servicioRepository.findById(id)
	        .orElseThrow(() -> new ServicioNotFoundException("Servicio no encontrado con id: " + id));

	    // --- Validaciones ---
	    if (servicioNuevo.getNombreServicio() == null || servicioNuevo.getNombreServicio().isBlank()) {
	        throw new ServicioException("El nombre del servicio es obligatorio.");
	    }

	    if (servicioNuevo.getPrecio() <= 0) {
	        throw new ServicioException("El precio debe ser mayor que 0.");
	    }

	    if (servicioNuevo.getDuracionMinutos() <= 0) {
	        throw new ServicioException("La duración debe ser mayor que 0.");
	    }

	    // Evitar duplicados por nombre (opcional)
	    if (servicioRepository.existsByNombreServicioAndIdNot(servicioNuevo.getNombreServicio(), id)) {
	        throw new ServicioException("Ya existe otro servicio con ese nombre.");
	    }

	    // --- Actualización de campos ---
	    servicioExistente.setNombreServicio(servicioNuevo.getNombreServicio());
	    servicioExistente.setDescripcion(servicioNuevo.getDescripcion());
	    servicioExistente.setPrecio(servicioNuevo.getPrecio());
	    servicioExistente.setDuracionMinutos(servicioNuevo.getDuracionMinutos());

	    // Guardar cambios
	    return servicioRepository.save(servicioExistente);
	}
	
	//Admin
	public void eliminarServicio(int id) {
	    Servicio servicio = servicioRepository.findById(id)
	        .orElseThrow(() -> new ServicioException("No existe ningún servicio con id: " + id));

	    servicioRepository.delete(servicio);
	}
	
	public List<ServicioResponseDTO> buscarServiciosPorNombre(String nombre) {

	    List<Servicio> servicios = servicioRepository.findByNombreServicioContainingIgnoreCase(nombre);

	    if (servicios.isEmpty()) {
	    	throw new ServicioException("No se encontraron servicios con nombre que contenga: " + nombre);
	    }

	    return servicios.stream()
	            .map(s -> new ServicioResponseDTO(
	                    s.getId(),
	                    s.getNombreServicio(),
	                    s.getDescripcion(),
	                    s.getPrecio()
	            ))
	            .toList();
	}



	

}
