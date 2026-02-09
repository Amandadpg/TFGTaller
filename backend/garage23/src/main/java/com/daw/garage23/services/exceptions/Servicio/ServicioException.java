package com.daw.garage23.services.exceptions.Servicio;

public class ServicioException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public ServicioException(String mensaje) {
        super(mensaje);
    }
}
