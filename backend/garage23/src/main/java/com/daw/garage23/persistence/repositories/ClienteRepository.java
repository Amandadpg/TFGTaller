package com.daw.garage23.persistence.repositories;

import java.util.Optional;

import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;
import org.yaml.snakeyaml.events.Event.ID;

import com.daw.garage23.persistence.entities.Cliente;

@Repository
public interface ClienteRepository extends ListCrudRepository<Cliente, Integer>{
	
	Optional<Cliente> findByEmail(String email);
	
	boolean existsByEmailAndIdNot(String email, Integer id);

    boolean existsByDniAndIdNot(String dni, Integer id);

    boolean existsByEmail(String email);

    boolean existsByDni(String dni);
	
}
