package com.daw.garage23.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daw.garage23.persistence.entities.Cita;
import com.daw.garage23.persistence.entities.Servicio;
import com.daw.garage23.persistence.entities.Vehiculo;
import com.daw.garage23.persistence.entities.enums.Estado;
import com.daw.garage23.persistence.repositories.CitaRepository;
import com.daw.garage23.services.dto.Citas.CitaRequestDTO;
import com.daw.garage23.services.dto.Citas.CitaResponseDTO;
import com.daw.garage23.services.exceptions.Cita.CitaException;
import com.daw.garage23.services.exceptions.Cita.CitaNotFoundException;
import com.daw.garage23.services.mapper.CitaMapper;

import jakarta.transaction.Transactional;

@Service
public class CitaServices {

	@Autowired
    private CitaRepository citaRepository;

	@Autowired
    private VehiculoServices vehiculoServices;

    @Autowired
    private ServicioServices servicioServices;

    public List<CitaResponseDTO> listarTodas() {
        return CitaMapper.toDTOList(citaRepository.findAll());
    }
    
    public CitaResponseDTO buscarPorId(int id) {
        // 1. Buscamos la entidad en la base de datos
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new CitaNotFoundException("No se encontró la cita con ID: " + id));

        // 2. La convertimos a DTO usando tu Mapper para devolver los datos bonitos
        return CitaMapper.toDTO(cita);
    }
    
    public List<CitaResponseDTO> buscarCitasPorNombreUsuario(String nombre) {
        // 1. Buscamos en el repositorio
        List<Cita> citas = citaRepository.findByVehiculoUsuarioNombreContainingIgnoreCase(nombre);
        
        // 2. Si no hay ninguna, podemos devolver una lista vacía o lanzar una excepción
        if (citas.isEmpty()) {
            throw new CitaNotFoundException("No hay citas para el usuario: " + nombre);
        }

        // 3. Mapeamos la lista de entidades a lista de DTOs
        return citas.stream()
                    .map(CitaMapper::toDTO)
                    .collect(Collectors.toList());
    }

    public CitaResponseDTO reservar(CitaRequestDTO dto) {
        // CAMBIO: Usamos los servicios para buscar las entidades
        Vehiculo vehiculo = vehiculoServices.buscarEntidadPorId(dto.getVehiculoId());
        Servicio servicio = servicioServices.buscarEntidadPorId(dto.getServicioId());

        Cita cita = new Cita();
        cita.setFecha(dto.getFecha());
        cita.setHora(dto.getHora());
        cita.setEstado(Estado.PENDIENTE);
        cita.setVehiculo(vehiculo);
        cita.setServicio(servicio);

        return CitaMapper.toDTO(citaRepository.save(cita));
    }

    @Transactional
    public CitaResponseDTO cambiarEstado(int idCita, Estado nuevoEstado) {
        Cita cita = citaRepository.findById(idCita)
                .orElseThrow(() -> new CitaNotFoundException("Cita no encontrada"));

        // REGLA DE NEGOCIO: Si la cita ya está terminada o cancelada, no se puede tocar más
        if (cita.getEstado() == Estado.COMPLETADA || cita.getEstado() == Estado.CANCELADA) {
            throw new CitaException("No se puede cambiar el estado de una cita que ya está finalizada o cancelada.");
        }

        // Actualizamos el estado
        cita.setEstado(nuevoEstado);
        
        Cita guardada = citaRepository.save(cita);
        return CitaMapper.toDTO(guardada);
    }
    
    @Transactional
    public CitaResponseDTO modificarCita(int idCita, CitaRequestDTO dto) {
        // 1. Buscamos la cita actual
        Cita cita = citaRepository.findById(idCita)
                .orElseThrow(() -> new CitaNotFoundException("La cita no existe."));

        // 2. REGLA DE NEGOCIO: No dejar modificar citas que ya terminaron o se cancelaron
        if (cita.getEstado() != Estado.PENDIENTE) {
            throw new CitaException("No se puede modificar una cita que ya está " + cita.getEstado());
        }

        // 3. Validar y obtener el nuevo Vehículo (usando su servicio)
        Vehiculo vehiculo = vehiculoServices.buscarEntidadPorId(dto.getVehiculoId());
        
        // 4. Validar y obtener el nuevo Servicio (usando su servicio)
        Servicio servicio = servicioServices.buscarEntidadPorId(dto.getServicioId());

        // 5. Actualizar los datos de la entidad
        cita.setFecha(dto.getFecha());
        cita.setVehiculo(vehiculo);
        cita.setServicio(servicio);
        // El estado lo dejamos como estaba (PENDIENTE) o podrías resetearlo si quieres

        // 6. Guardar y devolver el DTO de respuesta
        Cita guardada = citaRepository.save(cita);
        return CitaMapper.toDTO(guardada);
    }
    
    @Transactional
    public void eliminarCita(int idCita) {
        // 1. Verificamos si existe
        if (!citaRepository.existsById(idCita)) {
            throw new CitaNotFoundException("No se puede eliminar: La cita con ID " + idCita + " no existe.");
        }

        // 2. Borramos
        citaRepository.deleteById(idCita);
    }
}