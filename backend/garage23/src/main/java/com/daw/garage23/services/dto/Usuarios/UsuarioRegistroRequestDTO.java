package com.daw.garage23.services.dto.Usuarios;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UsuarioRegistroRequestDTO {

	private String nombre;
    private String email;
    private String contrasena;
	
}
