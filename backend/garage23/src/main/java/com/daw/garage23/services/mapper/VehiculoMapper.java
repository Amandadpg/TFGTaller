package com.daw.garage23.services.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.daw.garage23.persistence.entities.Vehiculo;
import com.daw.garage23.services.dto.Vehiculos.VehiculoResponseDTO;

public class VehiculoMapper {

    // Convierte un Vehiculo en VehiculoResponseDTO
    public static VehiculoResponseDTO toResponseDTO(Vehiculo vehiculo) {
        VehiculoResponseDTO dto = new VehiculoResponseDTO();
        
        dto.setId(vehiculo.getId());
        dto.setMatricula(vehiculo.getMatricula() != null ? vehiculo.getMatricula() : "");
        dto.setMarca(vehiculo.getMarca() != null ? vehiculo.getMarca() : "");
        dto.setModelo(vehiculo.getModelo() != null ? vehiculo.getModelo() : "");
        dto.setTipo(vehiculo.getTipo() != null ? vehiculo.getTipo().toString() : "");
        
        // Opcional: si quieres devolver el nombre del usuario dueño
        if (vehiculo.getUsuario() != null) {
            dto.setUsuarioId(vehiculo.getUsuario().getId());
            dto.setNombreUsuario(vehiculo.getUsuario().getNombre());
        }
        
        return dto;
    }

    // Convierte una lista de Vehiculos en lista de DTOs
    public static List<VehiculoResponseDTO> toResponseDTOList(List<Vehiculo> vehiculos) {
        return vehiculos.stream()
                        .map(VehiculoMapper::toResponseDTO)
                        .collect(Collectors.toList());
    }
}