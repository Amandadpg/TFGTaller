package com.daw.garage23.services.dto.Servicios;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ServicioResponseDTO {

	private int id;
    private String nombreServicio;
    private String descripcion;
    private double precio;
    private int duracionMinutos;
}
