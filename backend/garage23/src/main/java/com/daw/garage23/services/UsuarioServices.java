package com.daw.garage23.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.daw.garage23.persistence.entities.Cita;
import com.daw.garage23.persistence.entities.Usuario;
import com.daw.garage23.persistence.entities.Vehiculo;
import com.daw.garage23.persistence.entities.enums.Estado;
import com.daw.garage23.persistence.entities.enums.Rol;
import com.daw.garage23.persistence.repositories.UsuarioRepository;
import com.daw.garage23.services.dto.Usuarios.UsuarioContrasenaRequestDTO;
import com.daw.garage23.services.dto.Usuarios.UsuarioRegistroRequestDTO;
import com.daw.garage23.services.dto.Usuarios.UsuarioResponseDTO;
import com.daw.garage23.services.dto.Usuarios.UsuarioUpdateRequestDTO;
import com.daw.garage23.services.exceptions.Usuario.UsuarioException;
import com.daw.garage23.services.exceptions.Usuario.UsuarioNotFoundException;
import com.daw.garage23.services.mapper.UsuarioMapper;

import jakarta.transaction.Transactional;

@Service
public class UsuarioServices implements UserDetailsService{
	
	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
	    Usuario usuario = usuarioRepository.findByEmail(email)
	            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));

	    return User.builder()
	            .username(usuario.getEmail())
	            .password(usuario.getContrasena()) 
	            .authorities(usuario.getRol().name())
	            .build();
	}

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private UsuarioMapper usuarioMapper;
    
    @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder;

    // Solo admin
    public List<UsuarioResponseDTO> listarTodosUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return usuarioMapper.toResponseDTOList(usuarios); 
    }
    
    public Usuario buscarEntidadPorId(int id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNotFoundException("El usuario con id " + id + " no se ha encontrado."));
    }

    // Solo admin
    public UsuarioResponseDTO obtenerUsuarioPorId(int id) {
        Usuario usuario = buscarEntidadPorId(id);
        return usuarioMapper.toResponseDTO(usuario); 
    }

    // Admin
    public List<UsuarioResponseDTO> buscarUsuariosPorNombre(String nombre) {
        List<Usuario> usuarios = usuarioRepository.findByNombreContainingIgnoreCase(nombre);
        if (usuarios.isEmpty()) {
            throw new UsuarioException("No se encontraron usuarios con nombre que contenga: " + nombre);
        }
        return usuarioMapper.toResponseDTOList(usuarios); 
    }

    // Cliente y admin
    public UsuarioResponseDTO registrar(UsuarioRegistroRequestDTO request) {
        
        if (request.getDni() != null) {
            request.setDni(request.getDni().toUpperCase().trim());
        }
        if (request.getEmail() != null) {
            request.setEmail(request.getEmail().toLowerCase().trim());
        }

        if (request.getContrasena() == null || !request.getContrasena().equals(request.getConfirmarContrasena())) {
            throw new UsuarioException("Las contraseñas no coinciden. Por favor, verifícalas.");
        }

        Usuario usuario = usuarioMapper.fromRegistroDTO(request); 

        usuario.setContrasena(passwordEncoder.encode(request.getContrasena()));

        if (request.getRol() != null && !request.getRol().isBlank()) {
            try {
                usuario.setRol(Rol.valueOf(request.getRol().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new UsuarioException("Rol no válido: " + request.getRol());
            }
        }

        Usuario guardado = usuarioRepository.save(usuario);
        return usuarioMapper.toResponseDTO(guardado);
    }

    // Cliente y admin
    public UsuarioResponseDTO login(String email, String contrasena) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNotFoundException("Usuario no encontrado"));

        if (!usuario.getContrasena().equals(contrasena)) {
            throw new UsuarioException("Contraseña incorrecta");
        }

        return usuarioMapper.toResponseDTO(usuario);
    }

    // Cliente y admin
    // Modificar usuario
    public UsuarioResponseDTO modificarUsuario(int id, UsuarioUpdateRequestDTO dto) {
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNotFoundException("Usuario no encontrado"));

        if (usuarioRepository.existsByEmailAndIdNot(dto.getEmail(), id)) {
            throw new UsuarioException("El email ya está en uso.");
        }
        
        if (dto.getDni() != null && usuarioRepository.existsByDniAndIdNot(dto.getDni(), id)) {
            throw new UsuarioException("El DNI ya está en uso.");
        }

        usuarioMapper.updateEntityFromDTO(dto, usuarioExistente); 

        if (dto.getRol() != null && !dto.getRol().isBlank()) {
            try {
                usuarioExistente.setRol(Rol.valueOf(dto.getRol().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new UsuarioException("Rol no válido: " + dto.getRol());
            }
        }

        Usuario actualizado = usuarioRepository.save(usuarioExistente);
        return usuarioMapper.toResponseDTO(actualizado); 
    }

    
    public void cambiarContrasena(int id, UsuarioContrasenaRequestDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNotFoundException("Usuario no encontrado"));

        if (!passwordEncoder.matches(dto.getContrasenaActual(), usuario.getContrasena())) {
            throw new UsuarioException("La contraseña actual no es correcta");
        }

        if (!dto.getContrasenaNueva().equals(dto.getConfirmarContrasenaNueva())) {
            throw new UsuarioException("La nueva contraseña y su confirmación no coinciden");
        }
        
        String contrasenaEncriptada = passwordEncoder.encode(dto.getContrasenaNueva());
        usuario.setContrasena(contrasenaEncriptada);
        
        usuarioRepository.save(usuario);
    }

    // Admin
    // Eliminar usuario
    @Transactional
    public void eliminarUsuario(int id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNotFoundException("Usuario no encontrado"));

        if (usuario.getVehiculos() != null) {
            for (Vehiculo v : usuario.getVehiculos()) {
                
                if (v.getCitas() != null) {
                    for (Cita cita : v.getCitas()) {
                        cita.setVehiculo(null); 
                        cita.setEstado(Estado.CANCELADA);
                    }
                    v.getCitas().clear();
                }
            }
        }

        usuarioRepository.delete(usuario);
    }

    public boolean esElMismoUsuario(int id, String emailAutenticado) {
        UsuarioResponseDTO usuario = obtenerUsuarioPorId(id);
        return usuario.getEmail().equals(emailAutenticado);
    }
    
    public int obtenerIdPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNotFoundException("Usuario no encontrado con email: " + email));
        return usuario.getId();
    }
}