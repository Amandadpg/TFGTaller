package com.daw.garage23.services.mapper;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component; // Añadido
import com.daw.garage23.persistence.entities.Cita;
import com.daw.garage23.services.dto.Citas.CitaResponseDTO;

@Component // Añadido
public class CitaMapper {

    // Quitamos static y cambiamos nombre a toResponseDTO
    public CitaResponseDTO toResponseDTO(Cita cita) {
        if (cita == null) return null;

        String matricula = (cita.getVehiculo() != null) ? cita.getVehiculo().getMatricula() : "Sin vehículo";
        String nombreServicio = (cita.getServicio() != null) ? cita.getServicio().getNombreServicio() : "Sin servicio";
        String estadoStr = (cita.getEstado() != null) ? cita.getEstado().name() : "PENDIENTE";
        
        String nombreUsuario = "Cliente desconocido";
        if (cita.getVehiculo() != null && cita.getVehiculo().getUsuario() != null) {
            nombreUsuario = cita.getVehiculo().getUsuario().getNombre() + " " + cita.getVehiculo().getUsuario().getApellidos();
        }

        return new CitaResponseDTO(
                cita.getId(),
                cita.getFecha(),
                cita.getHora(),
                estadoStr,
                matricula,
                nombreServicio,
                nombreUsuario
        );
    }

    public List<CitaResponseDTO> toDTOList(List<Cita> citas) {
        if (citas == null) return List.of();
        return citas.stream()
                    .map(this::toResponseDTO) // Usamos this
                    .collect(Collectors.toList());
    }
}