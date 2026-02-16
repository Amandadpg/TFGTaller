package com.daw.garage23.services.exceptions.Usuario;


public class UsuarioNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public UsuarioNotFoundException(String mensaje) {
	   super(mensaje);
	}
}
