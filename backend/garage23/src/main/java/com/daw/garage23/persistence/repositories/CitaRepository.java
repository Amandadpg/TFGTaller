package com.daw.garage23.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.daw.garage23.persistence.entities.Cita;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Integer>{

	
}
