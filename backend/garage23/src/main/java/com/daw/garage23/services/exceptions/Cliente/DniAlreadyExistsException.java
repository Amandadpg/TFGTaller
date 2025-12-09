package com.daw.garage23.services.exceptions.Cliente;

public class DniAlreadyExistsException extends RuntimeException {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public DniAlreadyExistsException(String msg) {
        super(msg);
    }
}
