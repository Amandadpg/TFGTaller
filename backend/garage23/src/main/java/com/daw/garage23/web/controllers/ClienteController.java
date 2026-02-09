package com.daw.garage23.web.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
import com.daw.garage23.services.exceptions.Cliente.ClienteException;
import com.daw.garage23.services.exceptions.Cliente.ClienteNotFoundException;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

	@Autowired
	private ClienteServices clienteServices;
	
	//Mostrar todos los clientes
	@GetMapping("/")
	public ResponseEntity<List<Cliente>> obtenerTodosClientes() {
	    List<Cliente> clientes = clienteServices.listarTodosClientes();
	    return ResponseEntity.ok(clientes);
	}
	
	//Mostrar cliente segun id
	@GetMapping("/{id}")
    public ResponseEntity<?> obtenerCliente(@PathVariable int id) {
        try {
            Cliente cliente = clienteServices.obtenerClientePorId(id);
            return ResponseEntity.ok(cliente);
        } catch (ClienteException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
	
	
	//Añadir clientes a traves de su registro
	@PostMapping("/registrar")
    public ResponseEntity<?> registrarCliente(@RequestBody ClienteRegistroDTO dto) {
        try {
            Cliente cliente = clienteServices.registrarCliente(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(cliente);
        } catch (ClienteException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
	
	// Modificar un cliente
	@PutMapping("/{id}")
	public ResponseEntity<?> modificarCliente(@PathVariable int id,@RequestBody Cliente clienteNuevo) {
	    try {
	        Cliente clienteModificado = clienteServices.modificarCliente(id, clienteNuevo);
	        return ResponseEntity.ok(clienteModificado);
	    } catch (ClienteNotFoundException e) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
	    } catch (ClienteException e) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
	    }
	}
	
    //Eliminar un cliente
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCliente(@PathVariable int id) {
        try {
            clienteServices.eliminarCliente(id);
            return ResponseEntity.ok("Cliente eliminado correctamente");
        } catch (ClienteNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
	
	
}
