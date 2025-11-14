package com.daw.garage23.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daw.garage23.persistence.repositories.ClienteRepository;

@Service
public class ClienteServices {
	
	@Autowired
	private ClienteRepository clienteRepository;
	
	

	
}
