package com.daw.garage23.persistence.repositories;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.daw.garage23.persistence.entities.Cita;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Integer>{

	boolean existsByFechaAndHora(LocalDate fecha, LocalTime hora);
	
	List<Cita> findByVehiculoUsuarioNombreContainingIgnoreCase(String nombre);
}
