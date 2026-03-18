package com.daw.garage23.services.dto.Citas;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CitaResponseDTO {

    private int id;
    private LocalDate fecha;
    private LocalTime hora;
    private String estado;
    private String matriculaVehiculo; 
    private String nombreServicio;

}
