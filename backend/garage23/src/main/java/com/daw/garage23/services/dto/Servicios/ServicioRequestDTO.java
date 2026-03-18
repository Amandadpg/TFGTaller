package com.daw.garage23.services.dto.Servicios;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class ServicioRequestDTO {

	private String nombreServicio;
    private String descripcion;
    private double precio;
    private Integer duracionMinutos;
}
