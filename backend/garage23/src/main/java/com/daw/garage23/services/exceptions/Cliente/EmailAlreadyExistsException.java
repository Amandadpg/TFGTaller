package com.daw.garage23.services.exceptions.Cliente;

public class EmailAlreadyExistsException extends RuntimeException {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public EmailAlreadyExistsException(String msg) {
        super(msg);
    }
}
