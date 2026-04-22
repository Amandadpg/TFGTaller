package com.daw.garage23.services.mapper;

import java.util.ArrayList; // Añadido por seguridad
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.daw.garage23.persistence.entities.Usuario;
import com.daw.garage23.services.dto.Usuarios.UsuarioRegistroRequestDTO;
import com.daw.garage23.services.dto.Usuarios.UsuarioResponseDTO;
import com.daw.garage23.services.dto.Usuarios.UsuarioUpdateRequestDTO;

@Component
public class UsuarioMapper {
	
    @Autowired
    private VehiculoMapper vehiculoMapper; 

    @Autowired
    private CitaMapper citaMapper;
	
    public UsuarioResponseDTO toResponseDTO(Usuario usuario) {
        if (usuario == null) return null;

        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setApellidos(usuario.getApellidos());
        dto.setDni(usuario.getDni());
        dto.setTelefono(usuario.getTelefono());
        dto.setEmail(usuario.getEmail());
        dto.setDireccion(usuario.getDireccion());
        
        if (usuario.getRol() != null) {
            dto.setRol(usuario.getRol().name());
        }

     // Dentro de UsuarioMapper.java
        if (usuario.getVehiculos() != null) {
            dto.setVehiculos(usuario.getVehiculos().stream()
                .map(v -> vehiculoMapper.toResponseDTO(v)) // Ahora existe y no es estático
                .collect(Collectors.toList()));
        }


        return dto;
    }
    
    public Usuario fromRegistroDTO(UsuarioRegistroRequestDTO request) {
        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setApellidos(request.getApellidos());
        usuario.setEmail(request.getEmail());
        usuario.setDni(request.getDni());
        usuario.setTelefono(request.getTelefono());
        usuario.setDireccion(request.getDireccion());
        usuario.setContrasena(request.getContrasena());
        return usuario;
    }
    
    // ESTE MÉTODO TAMBIÉN TE FALTABA
    public void updateEntityFromDTO(UsuarioUpdateRequestDTO dto, Usuario entidad) {
        if (dto == null) return;
        entidad.setNombre(dto.getNombre());
        entidad.setApellidos(dto.getApellidos());
        entidad.setEmail(dto.getEmail());
        entidad.setDni(dto.getDni());
        entidad.setTelefono(dto.getTelefono());
        entidad.setDireccion(dto.getDireccion());
    }

    public List<UsuarioResponseDTO> toResponseDTOList(List<Usuario> usuarios) {
        if (usuarios == null) return new ArrayList<>();
        return usuarios.stream()
                .map(u -> this.toResponseDTO(u))
                .collect(Collectors.toList());
    }

}