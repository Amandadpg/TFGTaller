package com.daw.garage23.services.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.daw.garage23.persistence.entities.Cita;
import com.daw.garage23.services.dto.Citas.CitaResponseDTO;

public class CitaMapper {

    public static CitaResponseDTO toDTO(Cita cita) {
        if (cita == null) return null;

        // Extraemos los datos con seguridad (si es null, ponemos "N/A" o vacío)
        String matricula = (cita.getVehiculo() != null) ? cita.getVehiculo().getMatricula() : "Sin vehículo";
        String nombreServicio = (cita.getServicio() != null) ? cita.getServicio().getNombreServicio() : "Sin servicio";
        String estadoStr = (cita.getEstado() != null) ? cita.getEstado().name() : "PENDIENTE";

        // Usamos el constructor de tu DTO
        return new CitaResponseDTO(
                cita.getId(),
                cita.getFecha(),
                cita.getHora(),
                estadoStr,
                matricula,
                nombreServicio
        );
    }

    public static List<CitaResponseDTO> toDTOList(List<Cita> citas) {
        if (citas == null) return List.of();
        return citas.stream()
                    .map(CitaMapper::toDTO)
                    .collect(Collectors.toList());
    }
}