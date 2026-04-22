package com.daw.garage23.services.dto.Usuarios;

import java.util.List;

import com.daw.garage23.services.dto.Citas.CitaResponseDTO;
import com.daw.garage23.services.dto.Vehiculos.VehiculoResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioResponseDTO {

	private int id;
    private String nombre;
    private String apellidos;
    private String email;
    private String dni;
    private String telefono;
    private String direccion;
    private String rol;
    
    private List<VehiculoResponseDTO> vehiculos;
    private List<CitaResponseDTO> citas;
}
