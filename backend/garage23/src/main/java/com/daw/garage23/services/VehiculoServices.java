package com.daw.garage23.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daw.garage23.persistence.entities.Cita;
import com.daw.garage23.persistence.entities.Usuario;
import com.daw.garage23.persistence.entities.Vehiculo;
import com.daw.garage23.persistence.entities.enums.Estado;
import com.daw.garage23.persistence.repositories.UsuarioRepository;
import com.daw.garage23.persistence.repositories.VehiculoRepository;
import com.daw.garage23.services.dto.Vehiculos.VehiculoRequestDTO;
import com.daw.garage23.services.dto.Vehiculos.VehiculoResponseDTO;
import com.daw.garage23.services.exceptions.Vehiculo.VehiculoException;
import com.daw.garage23.services.mapper.VehiculoMapper;

import jakarta.transaction.Transactional;

@Service
public class VehiculoServices {
	
	@Autowired
	private VehiculoRepository vehiculoRepository;

	@Autowired
    private UsuarioServices usuarioServices;

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private VehiculoMapper vehiculoMapper;
    
    //Admin
    public List<VehiculoResponseDTO> listarTodosVehiculos() {
        List<Vehiculo> vehiculos = vehiculoRepository.findAll();
        return vehiculoMapper.toResponseDTOList(vehiculos);
    }
    
 
    @Transactional
    public Vehiculo buscarEntidadPorId(int id) {
        Vehiculo v = vehiculoRepository.findById(id)
                .orElseThrow(() -> new VehiculoException("No encontrado"));
                
        if (v.getCitas() != null) {
            v.getCitas().size(); 
        }
        
        return v;
    }
    
    //Admin
    public List<VehiculoResponseDTO> listarVehiculosPorUsuario(int usuarioId) {
        Usuario usuario = usuarioServices.buscarEntidadPorId(usuarioId);
        return vehiculoMapper.toResponseDTOList(usuario.getVehiculos()); 
    }
    
    //Admin
    public List<VehiculoResponseDTO> buscarVehiculosPorMatricula(String matricula) {
        List<Vehiculo> vehiculos = vehiculoRepository.findByMatriculaContainingIgnoreCase(matricula);
        if (vehiculos.isEmpty()) {
            throw new VehiculoException("No se encontraron vehículos con matrícula: " + matricula);
        }
        return vehiculoMapper.toResponseDTOList(vehiculos); 
    }
    
    
    //Admin
    public List<VehiculoResponseDTO> buscarVehiculosPorMarca(String marca) {
        List<Vehiculo> vehiculos = vehiculoRepository.findByMarcaContainingIgnoreCase(marca);
        if (vehiculos.isEmpty()) {
            throw new VehiculoException("No se encontraron vehículos con marca: " + marca);
        }
        return vehiculoMapper.toResponseDTOList(vehiculos); 
    }

    //Admin y cliente
    public VehiculoResponseDTO darAltaVehiculo(VehiculoRequestDTO dto) {
        Usuario usuario = usuarioRepository.findByDni(dto.getDniCliente())
                .orElseThrow(() -> new VehiculoException("No se encontró usuario con el DNI: " + dto.getDniCliente()));

        if (vehiculoRepository.existsByMatricula(dto.getMatricula())) {
            throw new VehiculoException("El coche con esa matrícula ya está registrado en la base de datos.");
        }

        Vehiculo vehiculo = vehiculoMapper.toEntity(dto);
        vehiculo.setUsuario(usuario);

        return vehiculoMapper.toResponseDTO(vehiculoRepository.save(vehiculo));
    }

    @Transactional
    public VehiculoResponseDTO modificarVehiculo(int vehiculoId, VehiculoRequestDTO dto) {
        Vehiculo vehiculo = vehiculoRepository.findById(vehiculoId)
                .orElseThrow(() -> new VehiculoException("Vehículo no encontrado"));

        Usuario usuario = usuarioRepository.findByDni(dto.getDniCliente())
                .orElseThrow(() -> new VehiculoException("No se encontró usuario con DNI: " + dto.getDniCliente()));
        
        vehiculo.setUsuario(usuario);

        if (!vehiculo.getMatricula().equals(dto.getMatricula()) && 
             vehiculoRepository.existsByMatricula(dto.getMatricula())) {
            throw new VehiculoException("El coche con esa matrícula ya está registrado en la base de datos.");
        }

        vehiculo.setMatricula(dto.getMatricula());
        vehiculo.setMarca(dto.getMarca());
        vehiculo.setModelo(dto.getModelo());
        vehiculo.setTipo(dto.getTipo());

        return vehiculoMapper.toResponseDTO(vehiculoRepository.save(vehiculo)); 
    }
    


    @Transactional
    public void eliminarVehiculo(int vehiculoId) {
        Vehiculo vehiculo = vehiculoRepository.findById(vehiculoId)
                .orElseThrow(() -> new VehiculoException("El vehículo con id " + vehiculoId + " no se ha encontrado."));

        if (vehiculo.getCitas() != null && !vehiculo.getCitas().isEmpty()) {
            for (Cita cita : vehiculo.getCitas()) {
                cita.setEstado(Estado.CANCELADA);
                cita.setVehiculo(null);
            }
            vehiculo.getCitas().clear();
        }

        vehiculoRepository.delete(vehiculo);
    }
    

    public boolean esDuenioDelVehiculo(int vehiculoId, String emailAutenticado) {
        return vehiculoRepository.findById(vehiculoId)
                .map(v -> v.getUsuario().getEmail().equals(emailAutenticado))
                .orElse(false);
    }
}