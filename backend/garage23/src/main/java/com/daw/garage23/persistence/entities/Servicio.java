package com.daw.garage23.persistence.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "servicio")
@Getter
@Setter
@NoArgsConstructor
public class Servicio {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(length = 40)
	private String nombreServicio;
	
	@Column(length = 70)
	private String descripcion;
	
	@Column(columnDefinition = "DECIMAL(6,2)")
	private double precio;
	
	@Column(name = "duracion_minutos")
	private int duracionMinutos;
	
//	@OneToMany(mappedBy = "servicio")
//	private List<Cita> cita;
	

}
