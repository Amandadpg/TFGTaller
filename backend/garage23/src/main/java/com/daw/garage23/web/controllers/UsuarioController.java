package com.daw.garage23.web.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.daw.garage23.services.UsuarioServices;
import com.daw.garage23.services.dto.Usuarios.UsuarioContrasenaRequestDTO;
import com.daw.garage23.services.dto.Usuarios.UsuarioLoginRequestDTO;
import com.daw.garage23.services.dto.Usuarios.UsuarioRegistroRequestDTO;
import com.daw.garage23.services.dto.Usuarios.UsuarioResponseDTO;
import com.daw.garage23.services.dto.Usuarios.UsuarioUpdateRequestDTO;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioServices usuarioServices;

    // 1. Mostrar todos los Usuarios: Solo el jefe (ADMIN)
    @GetMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsuarioResponseDTO>> obtenerTodosUsuarios() {
        return ResponseEntity.ok(usuarioServices.listarTodosUsuarios());
    }

    // 2. Mostrar Usuario por ID: El ADMIN o el propio DUEÑO de la cuenta
    // CORRECCIÓN: He cambiado @citaServices por @usuarioServices, que es lo lógico aquí.
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @usuarioServices.esElMismoUsuario(#id, authentication.name)")
    public ResponseEntity<UsuarioResponseDTO> obtenerUsuario(@PathVariable int id) {
        return ResponseEntity.ok(usuarioServices.obtenerUsuarioPorId(id));
    }
    
    // 3. Buscar por nombre: Solo ADMIN
    @GetMapping("/buscar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsuarioResponseDTO>> buscarUsuariosPorNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(usuarioServices.buscarUsuariosPorNombre(nombre));
    }

    // 4. Registrar: El registro suele ser PÚBLICO (para que nuevos clientes entren)
    // Pero si quieres que solo lo haga alguien logueado, déjalo así:
    @PostMapping("/registro")
    @PreAuthorize("permitAll()") // Normalmente permitAll para que la gente se pueda apuntar al taller
    public ResponseEntity<UsuarioResponseDTO> registrar(@RequestBody UsuarioRegistroRequestDTO request) {
        return ResponseEntity.ok(usuarioServices.registrar(request));
    }

    // 5. Modificar Usuario: ¡AQUÍ FALTABA SEGURIDAD!
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @usuarioServices.esElMismoUsuario(#id, authentication.name)")
    public ResponseEntity<UsuarioResponseDTO> modificarUsuario(@PathVariable int id, @RequestBody UsuarioUpdateRequestDTO request) {
        return ResponseEntity.ok(usuarioServices.modificarUsuario(id, request));
    }

    // 6. Cambiar Contraseña: Solo el ADMIN o el DUEÑO
    @PatchMapping("/{id}/contrasena")
    @PreAuthorize("hasRole('ADMIN') or @usuarioServices.esElMismoUsuario(#id, authentication.name)")
    public ResponseEntity<String> cambiarContrasena(@PathVariable int id, @RequestBody UsuarioContrasenaRequestDTO request) {
        usuarioServices.cambiarContrasena(id, request);
        return ResponseEntity.ok("Contraseña actualizada con éxito");
    }
    
    // 7. Login: Debe ser público para poder entrar
    @PostMapping("/login")
    @PreAuthorize("permitAll()")
    public ResponseEntity<UsuarioResponseDTO> login(@RequestBody UsuarioLoginRequestDTO login) {
        return ResponseEntity.ok(usuarioServices.login(login.getEmail(), login.getContrasena()));
    }

    // 8. Eliminar: Solo el ADMIN
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> eliminarUsuario(@PathVariable int id) {
        usuarioServices.eliminarUsuario(id);
        return ResponseEntity.ok("Usuario eliminado correctamente");
    }
}
	

