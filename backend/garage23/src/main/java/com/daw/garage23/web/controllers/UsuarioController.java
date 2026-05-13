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

    @GetMapping("/")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UsuarioResponseDTO>> obtenerTodosUsuarios() {
        return ResponseEntity.ok(usuarioServices.listarTodosUsuarios());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or @usuarioServices.esElMismoUsuario(#id, authentication.name)")
    public ResponseEntity<UsuarioResponseDTO> obtenerUsuario(@PathVariable int id) {
        return ResponseEntity.ok(usuarioServices.obtenerUsuarioPorId(id));
    }
    
    @GetMapping("/buscar")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UsuarioResponseDTO>> buscarUsuariosPorNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(usuarioServices.buscarUsuariosPorNombre(nombre));
    }

    @PostMapping("/registro")
    @PreAuthorize("permitAll()")
    public ResponseEntity<UsuarioResponseDTO> registrar(@RequestBody UsuarioRegistroRequestDTO request) {
        return ResponseEntity.ok(usuarioServices.registrar(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or @usuarioServices.esElMismoUsuario(#id, authentication.name)")
    public ResponseEntity<UsuarioResponseDTO> modificarUsuario(@PathVariable int id, @RequestBody UsuarioUpdateRequestDTO request) {
        return ResponseEntity.ok(usuarioServices.modificarUsuario(id, request));
    }

    @PatchMapping("/{id}/contrasena") 
    @PreAuthorize("hasAuthority('ADMIN') or @usuarioServices.esElMismoUsuario(#id, authentication.name)")
    public ResponseEntity<String> cambiarContrasena(@PathVariable int id, @RequestBody UsuarioContrasenaRequestDTO request) {
        usuarioServices.cambiarContrasena(id, request);
        return ResponseEntity.ok("Contraseña actualizada con éxito");
    }
    
    @PostMapping("/login")
    @PreAuthorize("permitAll()")
    public ResponseEntity<UsuarioResponseDTO> login(@RequestBody UsuarioLoginRequestDTO login) {
        return ResponseEntity.ok(usuarioServices.login(login.getEmail(), login.getContrasena()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> eliminarUsuario(@PathVariable int id) {
        usuarioServices.eliminarUsuario(id);
        return ResponseEntity.ok("Usuario eliminado correctamente");
    }
}
	

