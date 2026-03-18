package com.daw.garage23.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daw.garage23.persistence.entities.Servicio;
import com.daw.garage23.persistence.repositories.ServicioRepository;
import com.daw.garage23.services.dto.Servicios.ServicioRequestDTO;
import com.daw.garage23.services.dto.Servicios.ServicioResponseDTO;
import com.daw.garage23.services.exceptions.Servicio.ServicioException;
import com.daw.garage23.services.exceptions.Servicio.ServicioNotFoundException;
import com.daw.garage23.services.mapper.ServicioMapper;

@Service
public class ServicioServices {
	
	@Autowired
	private ServicioRepository servicioRepository;
	
	public Servicio buscarEntidadPorId(int id) {
        return servicioRepository.findById(id)
                .orElseThrow(() -> new ServicioNotFoundException("Servicio no encontrado con id: " + id));
    }
	
	// Admin y usuario
	public List<ServicioResponseDTO> buscarServiciosPorNombre(String nombre) {

	    // 1. Buscamos en el repositorio (esto devuelve una lista de Entidades)
	    List<Servicio> servicios = servicioRepository.findByNombreServicioContainingIgnoreCase(nombre);

	    // 2. Si la lista está vacía, lanzamos nuestra excepción personalizada
	    if (servicios.isEmpty()) {
	        throw new ServicioException("No se encontraron servicios con nombre que contenga: " + nombre);
	    }

	    // 3. Usamos el Mapper para convertir la lista de Entidades a lista de DTOs
	    return ServicioMapper.toResponseDTOList(servicios);
	}

    public List<ServicioResponseDTO> listarTodosServicios() {
        return ServicioMapper.toResponseDTOList(servicioRepository.findAll());
    }

    public ServicioResponseDTO añadirServicio(ServicioRequestDTO dto) {
        validarServicio(dto, null);

        if (servicioRepository.existsByNombreServicio(dto.getNombreServicio())) {
            throw new ServicioException("Ya existe un servicio con ese nombre.");
        }
    

        Servicio guardado = servicioRepository.save(ServicioMapper.toEntity(dto));
        return ServicioMapper.toResponseDTO(guardado);
    }

    public ServicioResponseDTO modificarServicio(int id, ServicioRequestDTO dto) {
        Servicio servicioExistente = buscarEntidadPorId(id);
        
        validarServicio(dto, id);

        if (servicioRepository.existsByNombreServicioAndIdNot(dto.getNombreServicio(), id)) {
            throw new ServicioException("Ya existe otro servicio con ese nombre.");
        }

        ServicioMapper.updateEntityFromDTO(dto, servicioExistente);
        return ServicioMapper.toResponseDTO(servicioRepository.save(servicioExistente));
    }

    public void eliminarServicio(int id) {
        Servicio servicio = buscarEntidadPorId(id);
        servicioRepository.delete(servicio);
    }

    // Método privado para centralizar validaciones
    private void validarServicio(ServicioRequestDTO dto, Integer id) {
        if (dto.getNombreServicio() == null || dto.getNombreServicio().isBlank()) {
            throw new ServicioException("El nombre del servicio es obligatorio.");
        }
        if (dto.getPrecio() <= 0) {
            throw new ServicioException("El precio debe ser mayor que 0.");
        }
        if (dto.getDuracionMinutos() == null || dto.getDuracionMinutos() <= 0) {
            throw new ServicioException("La duración debe ser mayor que 0.");
        }
    }
    
}