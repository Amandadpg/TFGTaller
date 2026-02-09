package com.daw.garage23.services.exceptions.Vehiculo;


public class VehiculoNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public VehiculoNotFoundException(String mensaje) {
	   super(mensaje);
	}
}
