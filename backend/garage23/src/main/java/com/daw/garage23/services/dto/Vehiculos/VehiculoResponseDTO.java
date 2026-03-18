package com.daw.garage23.services.dto.Vehiculos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VehiculoResponseDTO {

    private int id;
    private String matricula;
    private String marca;
    private String modelo;
    private String tipo;
    private int usuarioId;
    private String nombreDueno;
    
}
