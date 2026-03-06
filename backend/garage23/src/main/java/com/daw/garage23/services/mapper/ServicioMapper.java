package com.daw.garage23.services.mapper;

import com.daw.garage23.persistence.entities.Servicio;
import com.daw.garage23.services.dto.Servicios.ServicioResponseDTO;

public class ServicioMapper {

    public static ServicioResponseDTO toDTO(Servicio servicio) {

        return new ServicioResponseDTO(
                servicio.getId(),
                servicio.getNombreServicio(),
                servicio.getDescripcion(),
                servicio.getPrecio(),
                servicio.getDuracionMinutos()
        );
    }
}
