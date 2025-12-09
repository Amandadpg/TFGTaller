package com.daw.garage23.persistence.repositories;

import java.util.Optional;

import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import com.daw.garage23.persistence.entities.Cliente;

@Repository
public interface ClienteRepository extends ListCrudRepository<Cliente, Integer>{
	
	Optional<Cliente> findByEmail(String email);
    Optional<Cliente> findByDni(String dni);
	
}
