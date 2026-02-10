package com.daw.garage23.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daw.garage23.persistence.entities.Cliente;
import com.daw.garage23.persistence.entities.Vehiculo;
import com.daw.garage23.persistence.repositories.ClienteRepository;
import com.daw.garage23.persistence.repositories.VehiculoRepository;
import com.daw.garage23.services.exceptions.Vehiculo.VehiculoException;

@Service
public class VehiculoServices {
	
	@Autowired
	private VehiculoRepository vehiculoRepository;

    @Autowired
    private ClienteRepository clienteRepository;
    
    public List<Vehiculo> listarVehiculosPorCliente(int clienteId) {

        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new VehiculoException("Cliente no encontrado con id: " + clienteId));

        return cliente.getVehiculo();
    }


    public Vehiculo darAltaVehiculo(int clienteId, Vehiculo vehiculo) {

        // Comprobar cliente existe
    	//Este solo lo usaria el admin ya que el cliente ya habra iniciado sesion con su cuenta
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new VehiculoException("El cliente no se ha encontrado."));

        // Matrícula única
        if (vehiculoRepository.existsByMatricula(vehiculo.getMatricula())) {
            throw new VehiculoException("Esta matrícula ya está registrada por otra cuenta.");
        }

        // Validaciones básicas
        if (vehiculo.getMatricula() == null || vehiculo.getMatricula().isBlank()) {
            throw new VehiculoException("Es necesario que inserte su matricula.");
        }
        
        if (vehiculo.getMarca() == null || vehiculo.getMarca().isBlank()) {
            throw new VehiculoException("Es necesario que inserte la marca de su vehiculo.");
        }
        
        if (vehiculo.getModelo() == null || vehiculo.getModelo().isBlank()) {
            throw new VehiculoException("Es necesario que inserte el modelo de su vehiculo.");
        }

        if (vehiculo.getTipo() == null) {
            throw new VehiculoException("Por favor, especifique que tipo de vehiculo tiene.");
        }
        

        vehiculo.setCliente(cliente);
        cliente.getVehiculo().add(vehiculo);
        return vehiculoRepository.save(vehiculo);
    }
    
    

}

