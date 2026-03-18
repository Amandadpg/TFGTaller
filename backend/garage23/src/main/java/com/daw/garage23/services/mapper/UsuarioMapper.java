package com.daw.garage23.services.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.daw.garage23.persistence.entities.Usuario;
import com.daw.garage23.persistence.entities.enums.Rol;
import com.daw.garage23.services.dto.Usuarios.UsuarioRegistroRequestDTO;
import com.daw.garage23.services.dto.Usuarios.UsuarioResponseDTO;
import com.daw.garage23.services.dto.Usuarios.UsuarioUpdateRequestDTO;

public class UsuarioMapper {
	
	
	public static Usuario toEntity(UsuarioRegistroRequestDTO request) {

	    Usuario usuario = new Usuario();

	    usuario.setNombre(request.getNombre());
	    usuario.setApellidos(request.getApellidos());
	    usuario.setDni(request.getDni());
	    usuario.setEmail(request.getEmail());
	    usuario.setTelefono(request.getTelefono());
	    usuario.setDireccion(request.getDireccion());
	    usuario.setContrasena(request.getContrasena());

	    return usuario;
	}

    // Entity -> ResponseDTO
	public static UsuarioResponseDTO toResponseDTO(Usuario usuario) {
	    UsuarioResponseDTO dto = new UsuarioResponseDTO();

	    dto.setId(usuario.getId());
	    dto.setNombre(usuario.getNombre());
	    dto.setApellidos(usuario.getApellidos());
	    dto.setEmail(usuario.getEmail());
	    dto.setTelefono(usuario.getTelefono());
	    dto.setRol(usuario.getRol() != null ? usuario.getRol().name() : "CLIENTE");

	    return dto;
	}

    // Lista Entity -> Lista DTO
    public static List<UsuarioResponseDTO> toResponseDTOList(List<Usuario> usuarios) {
        return usuarios.stream()
                .map(UsuarioMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    // Registro DTO -> Entity
    public static Usuario fromRegistroDTO(UsuarioRegistroRequestDTO request) {
        Usuario usuario = new Usuario();

        usuario.setNombre(request.getNombre());
        usuario.setApellidos(request.getApellidos()); // Antes estaba como ""
        usuario.setEmail(request.getEmail());
        usuario.setDni(request.getDni());
        usuario.setTelefono(request.getTelefono());
        usuario.setDireccion(request.getDireccion());
        usuario.setContrasena(request.getContrasena());
        
        // Por defecto, al registrarse suelen ser CLIENTE
        usuario.setRol(Rol.CLIENTE); 

        return usuario;
    }
    
    public static void updateEntityFromDTO(UsuarioUpdateRequestDTO dto, Usuario entidad) {
        if (dto == null) return;

        entidad.setNombre(dto.getNombre());
        entidad.setApellidos(dto.getApellidos());
        entidad.setEmail(dto.getEmail());
        entidad.setDni(dto.getDni());
        entidad.setTelefono(dto.getTelefono());
        entidad.setDireccion(dto.getDireccion());
    }
}