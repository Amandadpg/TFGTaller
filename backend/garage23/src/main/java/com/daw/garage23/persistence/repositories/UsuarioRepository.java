package com.daw.garage23.persistence.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import com.daw.garage23.persistence.entities.Usuario;

@Repository
public interface UsuarioRepository extends ListCrudRepository<Usuario, Integer>{
	
	Optional<Usuario> findByEmail(String email);
	
	boolean existsByEmailAndIdNot(String email, Integer id);

    boolean existsByDniAndIdNot(String dni, Integer id);

    boolean existsByEmail(String email);

    boolean existsByDni(String dni);
    
    List<Usuario> findByNombreContainingIgnoreCase(String nombre);
	
}
