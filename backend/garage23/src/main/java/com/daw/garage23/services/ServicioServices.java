package com.daw.garage23.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daw.garage23.persistence.repositories.ServicioRepository;

@Service
public class ServicioServices {
	
	@Autowired
	private ServicioRepository servicioRepository;
	

}
