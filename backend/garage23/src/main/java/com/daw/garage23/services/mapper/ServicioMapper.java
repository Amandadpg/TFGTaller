package com.daw.garage23.services.mapper;

import java.util.List;

import com.daw.garage23.persistence.entities.Servicio;
import com.daw.garage23.services.dto.Servicios.ServicioRequestDTO;
import com.daw.garage23.services.dto.Servicios.ServicioResponseDTO;

public class ServicioMapper {

    public static ServicioResponseDTO toResponseDTO(Servicio servicio) {
        ServicioResponseDTO dto = new ServicioResponseDTO(); 
        dto.setId(servicio.getId());
        dto.setNombreServicio(servicio.getNombreServicio());
        dto.setDescripcion(servicio.getDescripcion());
        dto.setPrecio(servicio.getPrecio());
        dto.setDuracionMinutos(servicio.getDuracionMinutos() != null ? servicio.getDuracionMinutos() : 0);
        return dto;
    }

    public static List<ServicioResponseDTO> toResponseDTOList(List<Servicio> servicios) {
        return servicios.stream().map(ServicioMapper::toResponseDTO).toList();
    }

    public static Servicio toEntity(ServicioRequestDTO dto) {
        Servicio servicio = new Servicio();
        updateEntityFromDTO(dto, servicio);
        return servicio;
    }

    public static void updateEntityFromDTO(ServicioRequestDTO dto, Servicio entidad) {
        entidad.setNombreServicio(dto.getNombreServicio());
        entidad.setDescripcion(dto.getDescripcion());
        entidad.setPrecio(dto.getPrecio());
        entidad.setDuracionMinutos(dto.getDuracionMinutos());
    }
}

