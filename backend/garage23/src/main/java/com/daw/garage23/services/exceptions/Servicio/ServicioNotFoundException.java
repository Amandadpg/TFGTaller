package com.daw.garage23.services.exceptions.Servicio;


public class ServicioNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public ServicioNotFoundException(String mensaje) {
	   super(mensaje);
	}
}
