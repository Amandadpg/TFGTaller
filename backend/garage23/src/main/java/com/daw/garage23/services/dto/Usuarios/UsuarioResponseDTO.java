package com.daw.garage23.services.dto.Usuarios;

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
    private String telefono;
    private String rol;
}
