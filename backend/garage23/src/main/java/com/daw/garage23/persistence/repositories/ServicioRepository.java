package com.daw.garage23.persistence.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.daw.garage23.persistence.entities.Servicio;

@Repository
public interface ServicioRepository extends JpaRepository<Servicio, Integer>{

    boolean existsByNombreServicio(String nombreServicio);

    boolean existsByNombreServicioAndIdNot(String nombreServicio, int id);
    
    List<Servicio> findByNombreServicioContainingIgnoreCase(String nombreServicio);
	
}
