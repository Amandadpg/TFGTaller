package com.daw.garage23.persistence.repositories;

import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import com.daw.garage23.persistence.entities.Administrador;

@Repository
public interface AdminRepository extends ListCrudRepository<Administrador, Integer>{

	
}


