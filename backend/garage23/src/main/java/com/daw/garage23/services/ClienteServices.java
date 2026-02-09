package com.daw.garage23.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daw.garage23.persistence.entities.Cliente;
import com.daw.garage23.persistence.repositories.ClienteRepository;
import com.daw.garage23.services.dto.ClienteRegistroDTO;
import com.daw.garage23.services.exceptions.Cliente.ClienteException;
import com.daw.garage23.services.exceptions.Cliente.ClienteNotFoundException;

@Service
public class ClienteServices {
	
	@Autowired
	private ClienteRepository clienteRepository;
	
	//Solo admin
	public List<Cliente> listarTodosClientes() {
	    return clienteRepository.findAll();
	}
	
	//Solo admin
	public Cliente obtenerClientePorId(int id){
        return clienteRepository.findById(id)
                .orElseThrow(() -> new ClienteException("El cliente con id " + id + " no se ha encontrado."));
    }
	
	//Cliente y admin
	public Cliente registrarCliente(ClienteRegistroDTO dto) {

        // Validar email y DNI duplicados
        if (clienteRepository.existsByEmail(dto.getEmail())) {
            throw new ClienteException("Este email ya ha sido registrado por otra cuenta.");
        }
        if (clienteRepository.existsByDni(dto.getDni())) {
            throw new ClienteException("Este DNI ya ha sido registrado po otra cuenta.");
        }

        // Validar contraseñas
        if (!dto.getContrasena().equals(dto.getConfirmarContrasena())) {
            throw new ClienteException("Las contraseña no coinciden.");
        }

        if (!esContrasenaValida(dto.getContrasena())) {
            throw new ClienteException("La contraseña debe tener al menos 8 caracteres, incluyendo una letra y un número");
        }

        // Crear cliente
        Cliente cliente = new Cliente();
        cliente.setNombre(dto.getNombre());
        cliente.setApellidos(dto.getApellidos());
        cliente.setDni(dto.getDni());
        cliente.setEmail(dto.getEmail());
        cliente.setTelefono(dto.getTelefono());
        cliente.setDireccion(dto.getDireccion());
        cliente.setContrasena(dto.getContrasena()); // luego cifrar con Spring Security

        return clienteRepository.save(cliente);
    }

	
	//Cliente y admin
	//Modificar un cliente
	public Cliente modificarCliente(int id, Cliente clienteNuevo) {

        //Comprobar que el cliente existe
        Cliente clienteExistente = clienteRepository.findById(id)
                .orElseThrow(() ->
                        new ClienteNotFoundException("El cliente con id " + id + " no se ha encontrado."));

        //Validaciones
        if (clienteNuevo.getNombre() == null || clienteNuevo.getNombre().isBlank()) {
            throw new ClienteException("Debe introducir su nombre");
        }

        if (clienteNuevo.getEmail() == null || clienteNuevo.getEmail().isBlank()) {
            throw new ClienteException("Debe instroducir su email");
        }

        if (clienteRepository.existsByEmailAndIdNot(clienteNuevo.getEmail(), id)) {
            throw new ClienteException("El email ya está en uso por otro cliente");
        }

        if (clienteRepository.existsByDniAndIdNot(clienteNuevo.getDni(), id)) {
            throw new ClienteException("El DNI ya está en uso por otro cliente");
        }

        //Actualizar datos
        clienteExistente.setNombre(clienteNuevo.getNombre());
        clienteExistente.setApellidos(clienteNuevo.getApellidos());
        clienteExistente.setDni(clienteNuevo.getDni());
        clienteExistente.setEmail(clienteNuevo.getEmail());
        clienteExistente.setTelefono(clienteNuevo.getTelefono());
        clienteExistente.setDireccion(clienteNuevo.getDireccion());

        //Guardar cambios
        return clienteRepository.save(clienteExistente);
    }

	
	//Admin
	//Eliminar un cliente
	public void eliminarCliente(int id) {

        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() ->
                        new ClienteNotFoundException("El cliente con id" + id + "no se ha encontrado."));

        clienteRepository.delete(cliente);
    }
	
	
	//Otros metodos
    private boolean esContrasenaValida(String contrasena) {
        if (contrasena.length() < 8) return false;
        boolean tieneLetra = false;
        boolean tieneNumero = false;

        for (char c : contrasena.toCharArray()) {
            if (Character.isLetter(c)) tieneLetra = true;
            else if (Character.isDigit(c)) tieneNumero = true;
        }

        return tieneLetra && tieneNumero;
    }
	
	
	


	
	
	
	
	
}
