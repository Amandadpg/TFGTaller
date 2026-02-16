package com.daw.garage23.services.exceptions.Usuario;

public class UsuarioException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public UsuarioException(String mensaje) {
        super(mensaje);
    }
}
