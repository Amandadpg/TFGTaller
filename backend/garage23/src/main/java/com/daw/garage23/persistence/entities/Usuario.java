package com.daw.garage23.persistence.entities;



import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.daw.garage23.persistence.entities.enums.Rol;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuario")
@Getter
@Setter
@NoArgsConstructor
public class Usuario {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(length = 40)
	private String nombre;
	
	@Column(length = 70)
	private String apellidos;
	
	@Column(length = 10, unique = true, nullable = false)
	private String dni;
	
	@Column(length = 9)
	private String telefono;
	
	@Column(length = 50, unique = true)
	private String email;
	
	@Column(length = 80)
	private String direccion;
	
	@Column(length = 120, nullable = true)
	private String contrasena;
	
	@Enumerated(value = EnumType.STRING)
	private Rol rol;
	
	@OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Vehiculo> vehiculos = new ArrayList<>();




}
