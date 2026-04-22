package com.daw.garage23.persistence.entities;

import java.time.LocalDate;
import java.time.LocalTime;

import com.daw.garage23.persistence.entities.enums.Estado;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cita")
@Getter
@Setter
@NoArgsConstructor
public class Cita {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(name = "fecha")
	private LocalDate fecha;
	
	@Column(name = "hora")
	private LocalTime hora;
	
	@Enumerated(value = EnumType.STRING)
	private Estado estado;
	
	@ManyToOne
	@JoinColumn(name = "id_vehiculo", nullable = true)
	@JsonBackReference
	private Vehiculo vehiculo;
	
	@ManyToOne
	@JoinColumn(name = "id_servicio", nullable = false)
	private Servicio servicio;
	
	
}
