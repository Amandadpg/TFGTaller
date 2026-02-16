package com.daw.garage23.web.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.daw.garage23.persistence.entities.Usuario;
import com.daw.garage23.services.UsuarioServices;
import com.daw.garage23.services.dto.UsuarioRegistroDTO;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

	@Autowired
    private UsuarioServices usuarioServices;

    // Mostrar todos los Usuarios
    @GetMapping("/")
    public ResponseEntity<List<Usuario>> obtenerTodosUsuarios() {
        return ResponseEntity.ok(usuarioServices.listarTodosUsuarios());
    }

    // Mostrar Usuario por id
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerUsuario(@PathVariable int id) {
        return ResponseEntity.ok(usuarioServices.obtenerUsuarioPorId(id));
    }

    // Registrar Usuario
    @PostMapping("/registrar")
    public ResponseEntity<Usuario> registrarUsuario(@RequestBody UsuarioRegistroDTO dto) {
        return ResponseEntity.status(201).body(usuarioServices.registrarUsuario(dto));
    }

    // Modificar Usuario
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> modificarUsuario(@PathVariable int id, @RequestBody Usuario usuarioNuevo) {
        return ResponseEntity.ok(usuarioServices.modificarUsuario(id, usuarioNuevo));
    }

    // Eliminar Usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarUsuario(@PathVariable int id) {
    	usuarioServices.eliminarUsuario(id);
        return ResponseEntity.ok("Usuario eliminado correctamente");
    }
}
	

