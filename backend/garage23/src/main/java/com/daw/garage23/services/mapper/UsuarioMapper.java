package com.daw.garage23.services.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.daw.garage23.persistence.entities.Usuario;
import com.daw.garage23.services.dto.Usuarios.UsuarioResponseDTO;

public class UsuarioMapper {

    // Convierte un Usuario en UsuarioResponseDTO
    public static UsuarioResponseDTO toResponseDTO(Usuario usuario) {
        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        
        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setApellidos(usuario.getApellidos() != null ? usuario.getApellidos() : "");
        dto.setEmail(usuario.getEmail());
        dto.setTelefono(usuario.getTelefono() != null ? usuario.getTelefono() : "");
        dto.setRol(usuario.getRol() != null ? usuario.getRol().toString() : "");
        
        return dto;
    }

    // Convierte una lista de Usuarios en lista de DTOs
    public static List<UsuarioResponseDTO> toResponseDTOList(List<Usuario> usuarios) {
        return usuarios.stream()
                       .map(UsuarioMapper::toResponseDTO)
                       .collect(Collectors.toList());
    }

    // Opcional: Crear un Usuario desde el DTO de registro
    public static Usuario fromRegistroDTO(String nombre, String email, String contrasena) {
        Usuario usuario = new Usuario();
        usuario.setNombre(nombre);
        usuario.setEmail(email);
        usuario.setContrasena(contrasena);
        usuario.setApellidos("");
        usuario.setTelefono("");
        usuario.setRol(null); // o Rol.CLIENTE si quieres
        return usuario;
    }
}
