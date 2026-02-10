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

import com.daw.garage23.persistence.entities.Cliente;
import com.daw.garage23.services.ClienteServices;
import com.daw.garage23.services.dto.ClienteRegistroDTO;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

	@Autowired
    private ClienteServices clienteServices;

    // Mostrar todos los clientes
    @GetMapping("/")
    public ResponseEntity<List<Cliente>> obtenerTodosClientes() {
        return ResponseEntity.ok(clienteServices.listarTodosClientes());
    }

    // Mostrar cliente por id
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> obtenerCliente(@PathVariable int id) {
        return ResponseEntity.ok(clienteServices.obtenerClientePorId(id));
    }

    // Registrar cliente
    @PostMapping("/registrar")
    public ResponseEntity<Cliente> registrarCliente(@RequestBody ClienteRegistroDTO dto) {
        return ResponseEntity.status(201).body(clienteServices.registrarCliente(dto));
    }

    // Modificar cliente
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> modificarCliente(@PathVariable int id, @RequestBody Cliente clienteNuevo) {
        return ResponseEntity.ok(clienteServices.modificarCliente(id, clienteNuevo));
    }

    // Eliminar cliente
    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarCliente(@PathVariable int id) {
        clienteServices.eliminarCliente(id);
        return ResponseEntity.ok("Cliente eliminado correctamente");
    }
}
	

