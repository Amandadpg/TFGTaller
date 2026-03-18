package com.daw.garage23.services.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.daw.garage23.persistence.entities.Vehiculo;
import com.daw.garage23.services.dto.Vehiculos.VehiculoRequestDTO;
import com.daw.garage23.services.dto.Vehiculos.VehiculoResponseDTO;

public class VehiculoMapper {

	    public static VehiculoResponseDTO toResponseDTO(Vehiculo vehiculo) {
	        VehiculoResponseDTO dto = new VehiculoResponseDTO();
	        dto.setId(vehiculo.getId());
	        dto.setMatricula(vehiculo.getMatricula() != null ? vehiculo.getMatricula() : "");
	        dto.setMarca(vehiculo.getMarca() != null ? vehiculo.getMarca() : "");
	        dto.setModelo(vehiculo.getModelo() != null ? vehiculo.getModelo() : "");
	        dto.setTipo(vehiculo.getTipo() != null ? vehiculo.getTipo().toString() : "");
	        
	        if (vehiculo.getUsuario() != null) {
	            dto.setUsuarioId(vehiculo.getUsuario().getId());
	            dto.setNombreDueno(vehiculo.getUsuario().getNombre() + " " + vehiculo.getUsuario().getApellidos());
	        }
	        return dto;
	    }

	    public static List<VehiculoResponseDTO> toResponseDTOList(List<Vehiculo> vehiculos) {
	        return vehiculos.stream().map(VehiculoMapper::toResponseDTO).collect(Collectors.toList());
	    }

	    // Nuevo: De DTO a Entidad (para crear)
	    public static Vehiculo toEntity(VehiculoRequestDTO dto) {
	        Vehiculo vehiculo = new Vehiculo();
	        vehiculo.setMatricula(dto.getMatricula());
	        vehiculo.setMarca(dto.getMarca());
	        vehiculo.setModelo(dto.getModelo());
	        vehiculo.setTipo(dto.getTipo());
	        return vehiculo;
	    }

	    // Nuevo: Actualizar entidad existente
	    public static void updateEntityFromDTO(VehiculoRequestDTO dto, Vehiculo entidad) {
	        entidad.setMatricula(dto.getMatricula());
	        entidad.setMarca(dto.getMarca());
	        entidad.setModelo(dto.getModelo());
	        entidad.setTipo(dto.getTipo());
	    }
	}