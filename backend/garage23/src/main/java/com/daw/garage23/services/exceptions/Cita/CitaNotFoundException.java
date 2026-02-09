package com.daw.garage23.services.exceptions.Cita;


public class CitaNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public CitaNotFoundException(String mensaje) {
	   super(mensaje);
	}
}
