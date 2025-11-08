package com.daw.garage23.persistence.entities;

import java.util.List;

import com.daw.garage23.persistence.entities.enums.Tipo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "vehiculo")
@Getter
@Setter
@NoArgsConstructor
public class Vehiculo {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(length = 8, nullable = true, unique = true)
	private String matricula;
	
	@Column(length = 30)
	private String marca;
	
	@Column(length = 50)
	private String modelo;
	
	@Enumerated(value = EnumType.STRING)
	private Tipo tipo;
	
	@ManyToOne
	@JoinColumn(name = "id_cliente", referencedColumnName = "id", insertable = false, updatable = false)
	private Cliente cliente;
	
	@OneToMany(mappedBy = "vehiculo")
	private List<Cita> cita;
}
