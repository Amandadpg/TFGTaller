package com.daw.garage23.web.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.daw.garage23.services.ClienteServices;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

	@Autowired
	private ClienteServices clienteServices;
	
	
	
}
