package com.daw.garage23.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daw.garage23.persistence.entities.Usuario;
import com.daw.garage23.persistence.entities.Vehiculo;
import com.daw.garage23.persistence.repositories.UsuarioRepository;
import com.daw.garage23.persistence.repositories.VehiculoRepository;
import com.daw.garage23.services.exceptions.Vehiculo.VehiculoException;

@Service
public class VehiculoServices {
	
	@Autowired
	private VehiculoRepository vehiculoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    //Admin
    public List<Vehiculo> listarTodosVehiculos() {
        return vehiculoRepository.findAll();
    }
    
    //Admin
    public List<Vehiculo> listarVehiculosPorUsuario(int usuarioId) {

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new VehiculoException("Usuario no encontrado con id: " + usuarioId));

        return usuario.getVehiculo();
    }

    //Admin y cliente
    public Vehiculo darAltaVehiculo(int usuarioId, Vehiculo vehiculo) {

        // Comprobar Usuario existe
    	//Este solo lo usaria el admin ya que el Usuario ya habra iniciado sesion con su cuenta
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new VehiculoException("El usuario no se ha encontrado."));

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
        

        vehiculo.setUsuario(usuario);
        usuario.getVehiculo().add(vehiculo);
        return vehiculoRepository.save(vehiculo);
    }
    
    //Admin y cliente
 // Modificar vehículo (sin usuarioId como parámetro)
    public Vehiculo modificarVehiculo(int vehiculoId, Vehiculo vehiculoNuevo) {
        // Buscar vehículo
        Vehiculo vehiculoExistente = vehiculoRepository.findById(vehiculoId)
            .orElseThrow(() -> new VehiculoException("Vehículo no encontrado"));

        // Validaciones de campos
        if (vehiculoNuevo.getMatricula() == null || vehiculoNuevo.getMatricula().isBlank()) {
            throw new VehiculoException("Debe introducir la matrícula del vehículo.");
        }

        if (vehiculoRepository.existsByMatriculaAndIdNot(vehiculoNuevo.getMatricula(), vehiculoId)) {
            throw new VehiculoException("La matrícula ya está registrada por otro vehículo.");
        }

        // Actualizar datos
        vehiculoExistente.setMatricula(vehiculoNuevo.getMatricula());
        vehiculoExistente.setMarca(vehiculoNuevo.getMarca());
        vehiculoExistente.setModelo(vehiculoNuevo.getModelo());
        vehiculoExistente.setTipo(vehiculoNuevo.getTipo());

        // Guardar cambios
        return vehiculoRepository.save(vehiculoExistente);
    }

    // Eliminar vehículo (sin usuarioId como parámetro)
    public void eliminarVehiculo(int vehiculoId) {
        // Buscar vehículo
        Vehiculo vehiculo = vehiculoRepository.findById(vehiculoId)
                .orElseThrow(() -> new VehiculoException("El vehículo con id " + vehiculoId + " no se ha encontrado."));

        // Aquí podrías agregar validación de rol o propietario si quieres
        // por ejemplo, con Spring Security después

        // Eliminar
        vehiculoRepository.delete(vehiculo);
    }


    

}

