package com.daw.garage23.services.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UsuarioRegistroDTO {

	private String nombre;
    private String apellidos;
    private String dni;
    private String email;
    private String telefono;
    private String direccion;
    private String contrasena;
    private String confirmarContrasena;
	
}
