package com.daw.garage23.services.mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component; // Añadido

import com.daw.garage23.persistence.entities.Vehiculo;
import com.daw.garage23.services.dto.Citas.CitaResponseDTO;
import com.daw.garage23.services.dto.Vehiculos.VehiculoRequestDTO;
import com.daw.garage23.services.dto.Vehiculos.VehiculoResponseDTO;

@Component // Añadido
public class VehiculoMapper {
	
	@Autowired
	private CitaMapper citaMapper;

    public VehiculoResponseDTO toResponseDTO(Vehiculo vehiculo) {
        if (vehiculo == null) return null;
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
        
        if (vehiculo.getCitas() != null) {
            List<CitaResponseDTO> listaCitas = vehiculo.getCitas().stream()
                .map(cita -> citaMapper.toResponseDTO(cita))
                .collect(Collectors.toList());
            
            dto.setCitas(listaCitas); // Si aquí sigue el rojo, es que el DTO no tiene setCitas(List<...>)
        } else {
            dto.setCitas(new ArrayList<>()); // Evitamos nulos
        }
        return dto;
    }

    public List<VehiculoResponseDTO> toResponseDTOList(List<Vehiculo> vehiculos) {
        return vehiculos.stream().map(this::toResponseDTO).collect(Collectors.toList());
    }
    
    public Vehiculo toEntity(VehiculoRequestDTO dto) {
        if (dto == null) return null;
        Vehiculo vehiculo = new Vehiculo();
        vehiculo.setMatricula(dto.getMatricula());
        vehiculo.setMarca(dto.getMarca());
        vehiculo.setModelo(dto.getModelo());
        vehiculo.setTipo(dto.getTipo());
        return vehiculo;
    }

    /**
     * Actualiza una entidad existente con los datos nuevos del DTO
     */
    public void updateEntityFromDTO(VehiculoRequestDTO dto, Vehiculo entidad) {
        if (dto == null || entidad == null) return;
        entidad.setMatricula(dto.getMatricula());
        entidad.setMarca(dto.getMarca());
        entidad.setModelo(dto.getModelo());
        entidad.setTipo(dto.getTipo());
    }}