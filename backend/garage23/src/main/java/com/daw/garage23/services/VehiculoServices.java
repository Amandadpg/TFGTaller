package com.daw.garage23.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daw.garage23.persistence.entities.Usuario;
import com.daw.garage23.persistence.entities.Vehiculo;
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
    
    //Admin
    public List<VehiculoResponseDTO> listarTodosVehiculos() {
        List<Vehiculo> vehiculos = vehiculoRepository.findAll();
        return VehiculoMapper.toResponseDTOList(vehiculos);
    }
    
 
    public Vehiculo buscarEntidadPorId(int id) {
        return vehiculoRepository.findById(id)
                .orElseThrow(() -> new VehiculoException("Vehículo no encontrado con id: " + id));
    }
    
    //Admin
    public List<VehiculoResponseDTO> listarVehiculosPorUsuario(int usuarioId) {
        // 1. Llamamos al servicio de usuarios usando el ID que entra por parámetro
        // 2. No ponemos orElseThrow aquí porque ya está dentro de buscarEntidadPorId
        Usuario usuario = usuarioServices.buscarEntidadPorId(usuarioId);

        // 3. Retornamos la lista mapeada a DTO
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
    public VehiculoResponseDTO darAltaVehiculo(VehiculoRequestDTO dto) {
        // Validamos si el usuario existe
    	Usuario usuario = usuarioServices.buscarEntidadPorId(dto.getUsuarioId());

        if (vehiculoRepository.existsByMatricula(dto.getMatricula())) {
            throw new VehiculoException("Esta matrícula ya está registrada.");
        }

        // Convertimos DTO a Entidad
        Vehiculo vehiculo = VehiculoMapper.toEntity(dto);
        vehiculo.setUsuario(usuario);

        Vehiculo guardado = vehiculoRepository.save(vehiculo);
        return VehiculoMapper.toResponseDTO(guardado);
    }

    @Transactional
    public VehiculoResponseDTO modificarVehiculo(int vehiculoId, VehiculoRequestDTO dto) {
        // 1. Buscamos el vehículo que queremos editar
        Vehiculo vehiculo = vehiculoRepository.findById(vehiculoId)
                .orElseThrow(() -> new VehiculoException("Vehículo no encontrado"));

        // 2. SEGURIDAD: Comprobar si el vehículo pertenece al usuario que envía la petición
        // (Esto evita que el Usuario A edite el coche del Usuario B)
        if (vehiculo.getUsuario().getId() != dto.getUsuarioId()) {
            throw new VehiculoException("Error: No tienes permiso para modificar este vehículo.");
        }

        // 3. Si la matrícula cambia, comprobar que la nueva no esté ya registrada en otro coche
        if (!vehiculo.getMatricula().equals(dto.getMatricula()) && 
             vehiculoRepository.existsByMatricula(dto.getMatricula())) {
            throw new VehiculoException("La nueva matrícula ya existe en el sistema.");
        }

        // 4. Actualizamos los datos
        vehiculo.setMatricula(dto.getMatricula());
        vehiculo.setMarca(dto.getMarca());
        vehiculo.setModelo(dto.getModelo());
        vehiculo.setTipo(dto.getTipo());

        return VehiculoMapper.toResponseDTO(vehiculoRepository.save(vehiculo));
    }
    


    // Eliminar vehículo (sin usuarioId como parámetro)
    public void eliminarVehiculo(int vehiculoId) {
        Vehiculo vehiculo = vehiculoRepository.findById(vehiculoId)
                .orElseThrow(() -> new VehiculoException("El vehículo con id " + vehiculoId + " no se ha encontrado."));

        vehiculoRepository.delete(vehiculo);
    }


    

}

