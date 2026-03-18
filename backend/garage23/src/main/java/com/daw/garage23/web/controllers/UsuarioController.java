package com.daw.garage23.web.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    // Mostrar todos los Usuarios
	@GetMapping("/")
	public ResponseEntity<List<UsuarioResponseDTO>> obtenerTodosUsuarios() {
	    return ResponseEntity.ok(usuarioServices.listarTodosUsuarios());
	}

    // Mostrar Usuario por id
	@GetMapping("/{id}")
	public ResponseEntity<UsuarioResponseDTO> obtenerUsuario(@PathVariable int id) {
	    return ResponseEntity.ok(usuarioServices.obtenerUsuarioPorId(id));
	}
    
    // Mostrar usuario por nombre
    @GetMapping("/buscar")
    public ResponseEntity<List<UsuarioResponseDTO>> buscarUsuariosPorNombre(@RequestParam String nombre) {
    	List<UsuarioResponseDTO> usuarios = usuarioServices.buscarUsuariosPorNombre(nombre);
        return ResponseEntity.ok(usuarios);
    }

    // Registrar Usuario
    @PostMapping("/registro")
    public ResponseEntity<UsuarioResponseDTO> registrar(@RequestBody UsuarioRegistroRequestDTO request) {
        UsuarioResponseDTO usuario = usuarioServices.registrar(request);
        return ResponseEntity.ok(usuario);
    }

    // Modificar Usuario
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> modificarUsuario( @PathVariable int id, @RequestBody UsuarioUpdateRequestDTO request) {
        return ResponseEntity.ok(usuarioServices.modificarUsuario(id, request));
    }

    // --- ENDPOINT PARA CAMBIAR CONTRASEÑA ---
    @PatchMapping("/{id}/contrasena")
    public ResponseEntity<String> cambiarContrasena(@PathVariable int id, @RequestBody UsuarioContrasenaRequestDTO request) {
        usuarioServices.cambiarContrasena(id, request);
        return ResponseEntity.ok("Contraseña actualizada con éxito");
    }
    
    //Iniciar sesion
    @PostMapping("/login")
    public ResponseEntity<UsuarioResponseDTO> login(@RequestBody UsuarioLoginRequestDTO login) {
    	UsuarioResponseDTO usuario = usuarioServices.login(login.getEmail(),login.getContrasena());
        return ResponseEntity.ok(usuario);
    }
    

    // Eliminar Usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarUsuario(@PathVariable int id) {
    	usuarioServices.eliminarUsuario(id);
        return ResponseEntity.ok("Usuario eliminado correctamente");
    }
}
	

