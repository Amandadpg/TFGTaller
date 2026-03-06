package com.daw.garage23.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daw.garage23.persistence.entities.Usuario;
import com.daw.garage23.persistence.entities.Vehiculo;
import com.daw.garage23.persistence.repositories.UsuarioRepository;
import com.daw.garage23.persistence.repositories.VehiculoRepository;
import com.daw.garage23.services.dto.Vehiculos.VehiculoResponseDTO;
import com.daw.garage23.services.exceptions.Vehiculo.VehiculoException;
import com.daw.garage23.services.mapper.VehiculoMapper;

@Service
public class VehiculoServices {
	
	@Autowired
	private VehiculoRepository vehiculoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    //Admin
    public List<VehiculoResponseDTO> listarTodosVehiculos() {
        List<Vehiculo> vehiculos = vehiculoRepository.findAll();
        return VehiculoMapper.toResponseDTOList(vehiculos);
    }
    
    //Admin
    public List<VehiculoResponseDTO> listarVehiculosPorUsuario(int usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new VehiculoException("Usuario no encontrado con id: " + usuarioId));

        return VehiculoMapper.toResponseDTOList(usuario.getVehiculo());
    }
    
    //Admin
    public List<VehiculoResponseDTO> buscarVehiculosPorMatricula(String matricula) {
        List<Vehiculo> vehiculos = vehiculoRepository.findByMatriculaContainingIgnoreCase(matricula);

        if (vehiculos.isEmpty()) {
            throw new VehiculoException("No se encontraron vehículos con matrícula que contenga: " + matricula);
        }

        return VehiculoMapper.toResponseDTOList(vehiculos);
    }
    
    
    //Admin
    public List<VehiculoResponseDTO> buscarVehiculosPorMarca(String marca) {
        List<Vehiculo> vehiculos = vehiculoRepository.findByMarcaContainingIgnoreCase(marca);

        if (vehiculos.isEmpty()) {
            throw new VehiculoException("No se encontraron vehículos con marca que contenga: " + marca);
        }

        return VehiculoMapper.toResponseDTOList(vehiculos);
    }

    //Admin y cliente
    public VehiculoResponseDTO darAltaVehiculo(int usuarioId, Vehiculo vehiculo) {

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new VehiculoException("El usuario no se ha encontrado."));

        if (vehiculoRepository.existsByMatricula(vehiculo.getMatricula())) {
            throw new VehiculoException("Esta matrícula ya está registrada por otra cuenta.");
        }

        if (vehiculo.getMatricula() == null || vehiculo.getMatricula().isBlank()) {
            throw new VehiculoException("Es necesario que inserte su matrícula.");
        }

        if (vehiculo.getMarca() == null || vehiculo.getMarca().isBlank()) {
            throw new VehiculoException("Es necesario que inserte la marca de su vehículo.");
        }

        if (vehiculo.getModelo() == null || vehiculo.getModelo().isBlank()) {
            throw new VehiculoException("Es necesario que inserte el modelo de su vehículo.");
        }

        if (vehiculo.getTipo() == null) {
            throw new VehiculoException("Por favor, especifique el tipo de vehículo.");
        }

        vehiculo.setUsuario(usuario);
        usuario.getVehiculo().add(vehiculo);

        Vehiculo guardado = vehiculoRepository.save(vehiculo);
        return VehiculoMapper.toResponseDTO(guardado);
    }
    
    //Admin y cliente
 // Modificar vehículo (sin usuarioId como parámetro)
    public VehiculoResponseDTO modificarVehiculo(int vehiculoId, Vehiculo vehiculoNuevo) {

        Vehiculo vehiculoExistente = vehiculoRepository.findById(vehiculoId)
                .orElseThrow(() -> new VehiculoException("Vehículo no encontrado"));

        if (vehiculoNuevo.getMatricula() == null || vehiculoNuevo.getMatricula().isBlank()) {
            throw new VehiculoException("Debe introducir la matrícula del vehículo.");
        }

        if (vehiculoRepository.existsByMatriculaAndIdNot(vehiculoNuevo.getMatricula(), vehiculoId)) {
            throw new VehiculoException("La matrícula ya está registrada por otro vehículo.");
        }

        vehiculoExistente.setMatricula(vehiculoNuevo.getMatricula());
        vehiculoExistente.setMarca(vehiculoNuevo.getMarca());
        vehiculoExistente.setModelo(vehiculoNuevo.getModelo());
        vehiculoExistente.setTipo(vehiculoNuevo.getTipo());

        Vehiculo guardado = vehiculoRepository.save(vehiculoExistente);
        return VehiculoMapper.toResponseDTO(guardado);
    }

    // Eliminar vehículo (sin usuarioId como parámetro)
    public void eliminarVehiculo(int vehiculoId) {
        Vehiculo vehiculo = vehiculoRepository.findById(vehiculoId)
                .orElseThrow(() -> new VehiculoException("El vehículo con id " + vehiculoId + " no se ha encontrado."));

        vehiculoRepository.delete(vehiculo);
    }


    

}

