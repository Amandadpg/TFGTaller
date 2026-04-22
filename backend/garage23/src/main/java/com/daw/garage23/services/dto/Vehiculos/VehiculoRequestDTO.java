package com.daw.garage23.services.dto.Vehiculos;

import com.daw.garage23.persistence.entities.enums.Tipo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class VehiculoRequestDTO {

	private String matricula;
    private String marca;
    private String modelo;
    private Tipo tipo;
    private String dniCliente;
}
