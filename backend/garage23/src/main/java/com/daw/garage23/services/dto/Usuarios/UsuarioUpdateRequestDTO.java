package com.daw.garage23.services.dto.Usuarios;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UsuarioUpdateRequestDTO {

	private String nombre;
	private String apellidos;
	private String email;
    private String dni;
    private String telefono;
    private String direccion;
}
