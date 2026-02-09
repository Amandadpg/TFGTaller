package com.daw.garage23.services.exceptions.Cliente;


public class ClienteNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public ClienteNotFoundException(String mensaje) {
	   super(mensaje);
	}
}
