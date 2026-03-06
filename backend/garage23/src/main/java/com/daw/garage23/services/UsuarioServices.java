package com.daw.garage23.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daw.garage23.persistence.entities.Usuario;
import com.daw.garage23.persistence.repositories.UsuarioRepository;
import com.daw.garage23.services.dto.Usuarios.UsuarioRegistroRequestDTO;
import com.daw.garage23.services.dto.Usuarios.UsuarioResponseDTO;
import com.daw.garage23.services.exceptions.Usuario.UsuarioException;
import com.daw.garage23.services.exceptions.Usuario.UsuarioNotFoundException;
import com.daw.garage23.services.mapper.UsuarioMapper;

@Service
public class UsuarioServices {
	
	@Autowired
	private UsuarioRepository usuarioRepository;
	
	//Solo admin
	public List<UsuarioResponseDTO> listarTodosUsuarios() {
	    List<Usuario> usuarios = usuarioRepository.findAll();
	    return UsuarioMapper.toResponseDTOList(usuarios);
	}
	
	//Solo admin
	public Usuario obtenerUsuarioPorId(int id){
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioException("El usuario con id " + id + " no se ha encontrado."));
    }
	
	
	//Admin
	public List<UsuarioResponseDTO> buscarUsuariosPorNombre(String nombre) {
	    List<Usuario> usuarios = usuarioRepository.findByNombreContainingIgnoreCase(nombre);
	    
	    if (usuarios.isEmpty()) {
	        throw new UsuarioException("No se encontraron usuarios con nombre que contenga: " + nombre);
	    }

	    return usuarios.stream()
	               .map(UsuarioMapper::toResponseDTO)
	               .toList();
	}

	
	//Cliente y admin
	public UsuarioResponseDTO registrar(UsuarioRegistroRequestDTO request) throws UsuarioException {

	    if (usuarioRepository.existsByEmail(request.getEmail())) {
	        throw new UsuarioException("Ya existe un usuario con ese email");
	    }

	    Usuario usuario = UsuarioMapper.fromRegistroDTO(
	        request.getNombre(),
	        request.getEmail(),
	        request.getContrasena()
	    );

	    Usuario guardado = usuarioRepository.save(usuario);

	    return UsuarioMapper.toResponseDTO(guardado);
	}
	
	//Cliente y admin
	public UsuarioResponseDTO login(String email, String contrasena) {

	    Usuario usuario = usuarioRepository.findByEmail(email)
	            .orElseThrow(() -> new UsuarioNotFoundException("Usuario no encontrado"));

	    if (!usuario.getContrasena().equals(contrasena)) {
	        throw new UsuarioException("Contraseña incorrecta");
	    }

	    return UsuarioMapper.toResponseDTO(usuario);
	}

	
	//Cliente y admin
	//Modificar un usuario
	public Usuario modificarUsuario(int id, Usuario usuarioNuevo) {

        //Comprobar que el usuario existe
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() ->
                        new UsuarioNotFoundException("El usuario con id " + id + " no se ha encontrado."));

        //Validaciones
        if (usuarioNuevo.getNombre() == null || usuarioNuevo.getNombre().isBlank()) {
            throw new UsuarioException("Debe introducir su nombre");
        }

        if (usuarioNuevo.getEmail() == null || usuarioNuevo.getEmail().isBlank()) {
            throw new UsuarioException("Debe instroducir su email");
        }

        if (usuarioRepository.existsByEmailAndIdNot(usuarioNuevo.getEmail(), id)) {
            throw new UsuarioException("El email ya está en uso por otro usuario");
        }

        if (usuarioRepository.existsByDniAndIdNot(usuarioNuevo.getDni(), id)) {
            throw new UsuarioException("El DNI ya está en uso por otro usuario");
        }

        //Actualizar datos
        usuarioExistente.setNombre(usuarioNuevo.getNombre());
        usuarioExistente.setApellidos(usuarioNuevo.getApellidos());
        usuarioExistente.setDni(usuarioNuevo.getDni());
        usuarioExistente.setEmail(usuarioNuevo.getEmail());
        usuarioExistente.setTelefono(usuarioNuevo.getTelefono());
        usuarioExistente.setDireccion(usuarioNuevo.getDireccion());

        //Guardar cambios
        return usuarioRepository.save(usuarioExistente);
    }

	
	//Admin
	//Eliminar un usuario
	public void eliminarUsuario(int id) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() ->
                        new UsuarioNotFoundException("El usuario con id " + id + " no se ha encontrado."));

        usuarioRepository.delete(usuario);
    }
	
	
	//Otros metodos
//    private boolean esContrasenaValida(String contrasena) {
//        if (contrasena.length() < 8) return false;
//        boolean tieneLetra = false;
//        boolean tieneNumero = false;
//
//        for (char c : contrasena.toCharArray()) {
//            if (Character.isLetter(c)) tieneLetra = true;
//            else if (Character.isDigit(c)) tieneNumero = true;
//        }
//
//        return tieneLetra && tieneNumero;
//    }
	
	
	


	
	
	
	
	
}
