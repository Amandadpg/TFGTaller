package com.daw.garage23.persistence.repositories;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.daw.garage23.persistence.entities.Cita;
import com.daw.garage23.persistence.entities.enums.Estado;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Integer>{

	boolean existsByFechaAndHora(LocalDate fecha, LocalTime hora);
	
	List<Cita> findByVehiculoUsuarioNombreContainingIgnoreCase(String nombre);

    @Query("SELECT SUM(s.precio) FROM Cita c JOIN c.servicio s WHERE c.estado = 'COMPLETADA'")
    Double calcularIngresosTotales();

    long countByEstadoAndFecha(Estado estado, LocalDate fecha);
    
    @Query("SELECT c FROM Cita c WHERE c.fecha BETWEEN :hoy AND :limite ORDER BY c.fecha ASC, c.hora ASC")
    List<Cita> findCitasProximosDias(@Param("hoy") LocalDate hoy, @Param("limite") LocalDate limite);
}
