package com.daw.garage23.services.dto.Usuarios;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UsuarioContrasenaRequestDTO {

	private String contrasenaActual;
	private String contrasenaNueva;
	private String confirmarContrasenaNueva;
}
