package com.daw.garage23.persistence.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.daw.garage23.persistence.entities.Vehiculo;

@Repository
public interface VehiculoRepository extends JpaRepository<Vehiculo, Integer>{

	Optional<Vehiculo> findById(int id);

    boolean existsByMatricula(String matricula);
    
    boolean existsByMatriculaAndIdNot(String matricula, int id);

    Optional<Vehiculo> findByUsuarioId(int usuarioId);
	
}
