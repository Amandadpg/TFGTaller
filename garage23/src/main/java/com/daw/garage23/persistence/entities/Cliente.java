package com.daw.garage23.persistence.entities;



import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cliente")
@Getter
@Setter
@NoArgsConstructor
public class Cliente {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(length = 40)
	private String nombre;
	
	@Column(length = 70)
	private String apellidos;
	
	@Column(length = 9, unique = true, nullable = true)
	private String dni;
	
	@Column(length = 9)
	private String telefono;
	
	@Column(length = 50)
	private String email;
	
	@Column(length = 80)
	private String direccion;
	
	@Column(length = 10, unique = true, nullable = true)
	private String contrasena;
	
	@OneToMany(mappedBy = "cliente")
	private List<Vehiculo> vehiculo;

}
