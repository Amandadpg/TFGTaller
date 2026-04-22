package com.daw.garage23.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.daw.garage23.persistence.entities.Cita;
import com.daw.garage23.persistence.entities.Usuario;
import com.daw.garage23.persistence.entities.Vehiculo;
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
	    // 1. Buscamos en TU base de datos
	    Usuario usuario = usuarioRepository.findByEmail(email)
	            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));

	    // 2. IMPORTANTE: Devolvemos el User de Spring Security con la clave ENCRIPTADA de la BD
	    return org.springframework.security.core.userdetails.User.builder()
	            .username(usuario.getEmail())
	            .password(usuario.getContrasena()) // Aquí va el $2a$10...
	            .roles(usuario.getRol().name())    // "ADMIN" o "CLIENTE"
	            .build();
	}

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private UsuarioMapper usuarioMapper;

    // Solo admin
    public List<UsuarioResponseDTO> listarTodosUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return usuarioMapper.toResponseDTOList(usuarios); // <--- CAMBIADO
    }
    
    public Usuario buscarEntidadPorId(int id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNotFoundException("El usuario con id " + id + " no se ha encontrado."));
    }

    // Solo admin
    public UsuarioResponseDTO obtenerUsuarioPorId(int id) {
        Usuario usuario = buscarEntidadPorId(id);
        return usuarioMapper.toResponseDTO(usuario); // <--- CAMBIADO
    }

    // Admin
    public List<UsuarioResponseDTO> buscarUsuariosPorNombre(String nombre) {
        List<Usuario> usuarios = usuarioRepository.findByNombreContainingIgnoreCase(nombre);
        if (usuarios.isEmpty()) {
            throw new UsuarioException("No se encontraron usuarios con nombre que contenga: " + nombre);
        }
        return usuarioMapper.toResponseDTOList(usuarios); // <--- Corregido método y minúscula
    }

    // Cliente y admin
    public UsuarioResponseDTO registrar(UsuarioRegistroRequestDTO request) {
        if (request.getContrasena() == null || !request.getContrasena().equals(request.getConfirmarContrasena())) {
            throw new UsuarioException("Las contraseñas no coinciden. Por favor, verifícalas.");
        }
        
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new UsuarioException("Ya existe un usuario con ese email");
        }
        
        if (usuarioRepository.existsByDni(request.getDni())) {
            throw new UsuarioException("Ya existe un usuario registrado con el DNI: " + request.getDni());
        }

        // Primero creamos la entidad con el mapper
        Usuario usuario = usuarioMapper.fromRegistroDTO(request); // <--- Minúscula

        // Ahora aplicamos el Rol si viene en el request
        if (request.getRol() != null && !request.getRol().isBlank()) {
            try {
                usuario.setRol(Rol.valueOf(request.getRol().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new UsuarioException("Rol no válido: " + request.getRol());
            }
        }

        Usuario guardado = usuarioRepository.save(usuario);
        return usuarioMapper.toResponseDTO(guardado); // <--- Minúscula
    }

    // Cliente y admin
    public UsuarioResponseDTO login(String email, String contrasena) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNotFoundException("Usuario no encontrado"));

        if (!usuario.getContrasena().equals(contrasena)) {
            throw new UsuarioException("Contraseña incorrecta");
        }

        return usuarioMapper.toResponseDTO(usuario); // <--- Minúscula
    }

    // Cliente y admin
    // Modificar usuario
    public UsuarioResponseDTO modificarUsuario(int id, UsuarioUpdateRequestDTO dto) {
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNotFoundException("Usuario no encontrado"));

        if (usuarioRepository.existsByEmailAndIdNot(dto.getEmail(), id)) {
            throw new UsuarioException("El email ya está en uso");
        }
        
        if (dto.getDni() != null && usuarioRepository.existsByDniAndIdNot(dto.getDni(), id)) {
            throw new UsuarioException("El DNI ya está en uso");
        }

        // Usamos la variable inyectada para actualizar
        usuarioMapper.updateEntityFromDTO(dto, usuarioExistente); // <--- Minúscula

        if (dto.getRol() != null && !dto.getRol().isBlank()) {
            try {
                usuarioExistente.setRol(Rol.valueOf(dto.getRol().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new UsuarioException("Rol no válido: " + dto.getRol());
            }
        }

        Usuario actualizado = usuarioRepository.save(usuarioExistente);
        return usuarioMapper.toResponseDTO(actualizado); // <--- Minúscula
    }

    
    public void cambiarContrasena(int id, UsuarioContrasenaRequestDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNotFoundException("Usuario no encontrado"));

        // 1. Verificar contraseña actual (cuando pongas Spring Security, aquí usarás passwordEncoder.matches)
        if (!usuario.getContrasena().equals(dto.getContrasenaActual())) {
            throw new UsuarioException("La contraseña actual no es correcta");
        }

        // 2. Verificar que la nueva y la confirmación coinciden
        if (!dto.getContrasenaNueva().equals(dto.getConfirmarContrasenaNueva())) {
            throw new UsuarioException("La nueva contraseña y su confirmación no coinciden");
        }

        // 3. Opcional: Validar fortaleza de contraseña aquí
        
        // 4. Actualizar
        usuario.setContrasena(dto.getContrasenaNueva());
        usuarioRepository.save(usuario);
    }



    // Admin
    // Eliminar usuario
    @Transactional
    public void eliminarUsuario(int id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNotFoundException("Usuario no encontrado"));

        // 1. Recorremos sus vehículos (Relación USUARIO -> VEHICULO de tu dibujo)
        if (usuario.getVehiculos() != null) {
            for (Vehiculo v : usuario.getVehiculos()) {
                
                // 2. Recorremos las citas de cada vehículo (Relación VEHICULO -> CITA)
                if (v.getCitas() != null) {
                    for (Cita cita : v.getCitas()) {
                        cita.setVehiculo(null); // La soltamos para poder borrar
                        cita.setEstado(com.daw.garage23.persistence.entities.enums.Estado.CANCELADA);
                    }
                    v.getCitas().clear();
                }
            }
        }

        // 3. Al borrar el usuario, se borrarán sus vehículos por CascadeType.ALL
        usuarioRepository.delete(usuario);
    }

 // Añade esto a UsuarioServices para que la seguridad funcione
    public boolean esElMismoUsuario(int id, String emailAutenticado) {
        UsuarioResponseDTO usuario = obtenerUsuarioPorId(id);
        return usuario.getEmail().equals(emailAutenticado);
    }
	

}
