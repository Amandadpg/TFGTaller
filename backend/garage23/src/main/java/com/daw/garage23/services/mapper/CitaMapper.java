package com.daw.garage23.services.mapper;

import java.util.List;

import com.daw.garage23.persistence.entities.Cita;
import com.daw.garage23.services.dto.Citas.CitaResponseDTO;

public class CitaMapper {

    public static CitaResponseDTO toDTO(Cita cita) {
        return new CitaResponseDTO(
                cita.getId(),
                cita.getFecha(),
                cita.getHora(),
                cita.getEstado().name(),
                cita.getVehiculo().getMatricula(),
                cita.getServicio().getNombreServicio()
        );
    }

    public static List<CitaResponseDTO> toDTOList(List<Cita> citas) {
        return citas.stream().map(CitaMapper::toDTO).toList();
    }
}
