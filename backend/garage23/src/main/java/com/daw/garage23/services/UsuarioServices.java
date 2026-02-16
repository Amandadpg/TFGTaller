package com.daw.garage23.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daw.garage23.persistence.entities.Usuario;
import com.daw.garage23.persistence.entities.enums.Rol;
import com.daw.garage23.persistence.repositories.UsuarioRepository;
import com.daw.garage23.services.dto.UsuarioRegistroDTO;
import com.daw.garage23.services.exceptions.Usuario.UsuarioException;
import com.daw.garage23.services.exceptions.Usuario.UsuarioNotFoundException;

@Service
public class UsuarioServices {
	
	@Autowired
	private UsuarioRepository usuarioRepository;
	
	//Solo admin
	public List<Usuario> listarTodosUsuarios() {
	    return usuarioRepository.findAll();
	}
	
	//Solo admin
	public Usuario obtenerUsuarioPorId(int id){
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioException("El usuario con id " + id + " no se ha encontrado."));
    }

	
	//Cliente y admin
	public Usuario registrarUsuario(UsuarioRegistroDTO dto) {

        // Validar email y DNI duplicados
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new UsuarioException("Este email ya ha sido registrado por otra cuenta.");
        }
        if (usuarioRepository.existsByDni(dto.getDni())) {
            throw new UsuarioException("Este DNI ya ha sido registrado po otra cuenta.");
        }

        // Validar contraseñas
        if (!dto.getContrasena().equals(dto.getConfirmarContrasena())) {
            throw new UsuarioException("Las contraseña no coinciden.");
        }

        if (!esContrasenaValida(dto.getContrasena())) {
            throw new UsuarioException("La contraseña debe tener al menos 8 caracteres, incluyendo una letra y un número");
        }

        // Crear cliente
        Usuario usuario = new Usuario();
        usuario.setNombre(dto.getNombre());
        usuario.setApellidos(dto.getApellidos());
        usuario.setDni(dto.getDni());
        usuario.setEmail(dto.getEmail());
        usuario.setTelefono(dto.getTelefono());
        usuario.setDireccion(dto.getDireccion());
        usuario.setContrasena(dto.getContrasena()); // luego cifrar con Spring Security
        usuario.setRol(Rol.CLIENTE);

        return usuarioRepository.save(usuario);
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
    private boolean esContrasenaValida(String contrasena) {
        if (contrasena.length() < 8) return false;
        boolean tieneLetra = false;
        boolean tieneNumero = false;

        for (char c : contrasena.toCharArray()) {
            if (Character.isLetter(c)) tieneLetra = true;
            else if (Character.isDigit(c)) tieneNumero = true;
        }

        return tieneLetra && tieneNumero;
    }
	
	
	


	
	
	
	
	
}
