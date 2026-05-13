package com.daw.garage23.services;

import java.time.LocalDateTime;
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
    
    @Autowired
    private CitaMapper citaMapper;
    
    public List<CitaResponseDTO> listarTodas() {
        return citaMapper.toDTOList(citaRepository.findAll());
    }
    
    public CitaResponseDTO buscarPorId(int id) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new CitaNotFoundException("No se encontró la cita con ID: " + id));
        return citaMapper.toResponseDTO(cita);
    }
    
    public List<String> obtenerHorasOcupadas(java.time.LocalDate fecha) {
        List<Cita> citasDelDia = citaRepository.findByFecha(fecha);
        
        return citasDelDia.stream()
                .filter(c -> c.getEstado() != Estado.CANCELADA)
                .map(c -> c.getHora().toString().substring(0, 5))
                .collect(Collectors.toList());
    }

    public List<CitaResponseDTO> listarCitasPorUsuario(int usuarioId) {
        List<Cita> citas = citaRepository.findByVehiculoUsuarioId(usuarioId);
        return citaMapper.toDTOList(citas);
    }
    
    public List<CitaResponseDTO> buscarCitasPorNombreUsuario(String nombre) {
        List<Cita> citas = citaRepository.findByVehiculoUsuarioNombreContainingIgnoreCase(nombre);
        if (citas.isEmpty()) {
            throw new CitaNotFoundException("No hay citas para el usuario: " + nombre);
        }
        return citas.stream()
                    .map(c -> citaMapper.toResponseDTO(c))
                    .collect(Collectors.toList());
    }

    @Transactional
    public CitaResponseDTO reservar(CitaRequestDTO dto) {
        Vehiculo vehiculo = vehiculoServices.buscarEntidadPorId(dto.getVehiculoId());
        Servicio servicio = servicioServices.buscarEntidadPorId(dto.getServicioId());

        Cita cita = new Cita();
        cita.setFecha(dto.getFecha());
        cita.setHora(dto.getHora());
        cita.setEstado(Estado.PENDIENTE);
        cita.setVehiculo(vehiculo);
        cita.setServicio(servicio);

        return citaMapper.toResponseDTO(citaRepository.save(cita));
    }

    @Transactional
    public CitaResponseDTO cambiarEstado(int idCita, Estado nuevoEstado) {
        Cita cita = citaRepository.findById(idCita)
                .orElseThrow(() -> new CitaNotFoundException("Cita no encontrada"));

        if (cita.getEstado() == Estado.COMPLETADA || cita.getEstado() == Estado.CANCELADA) {
            throw new CitaException("No se puede cambiar el estado de una cita que ya está finalizada o cancelada.");
        }

        cita.setEstado(nuevoEstado);
        
        return citaMapper.toResponseDTO(citaRepository.save(cita));
    }
    
    @Transactional
    public CitaResponseDTO modificarCitaAdmin(int id, CitaRequestDTO dto) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new CitaNotFoundException("La cita no existe."));

        if (dto.getVehiculoId() > 0) {
            Vehiculo vehiculo = vehiculoServices.buscarEntidadPorId(dto.getVehiculoId());
            cita.setVehiculo(vehiculo);
        }
        if (dto.getServicioId() > 0) {
            Servicio servicio = servicioServices.buscarEntidadPorId(dto.getServicioId());
            cita.setServicio(servicio);
        }

        if (dto.getFecha() != null) cita.setFecha(dto.getFecha());
        if (dto.getHora() != null) cita.setHora(dto.getHora());
        
        if (dto.getEstado() != null && !dto.getEstado().isEmpty()) {
            cita.setEstado(Estado.valueOf(dto.getEstado().toUpperCase()));
        }

        return citaMapper.toResponseDTO(citaRepository.save(cita));
    }
    
    @Transactional 
    public CitaResponseDTO modificarCitaCliente(int id, CitaRequestDTO dto) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new CitaNotFoundException("Cita no encontrada con ID: " + id));

        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime fechaCita = LocalDateTime.of(cita.getFecha(), cita.getHora());

        if (ahora.isAfter(fechaCita.minusHours(24))) {
            throw new CitaException("No puedes modificar; faltan menos de 24h para la cita.");
        }

        if (cita.getEstado() != Estado.PENDIENTE) {
            throw new CitaException("Solo se pueden modificar citas en estado PENDIENTE.");
        }

        cita.setFecha(dto.getFecha());
        cita.setHora(dto.getHora());
        
        return citaMapper.toResponseDTO(citaRepository.save(cita));
    }
    
    @Transactional
    public void eliminarCita(int idCita) {
        if (!citaRepository.existsById(idCita)) {
            throw new CitaNotFoundException("No se puede eliminar: La cita con ID " + idCita + " no existe.");
        }

        citaRepository.deleteById(idCita);
    }
    
    public boolean esDuenioDeLaCita(int idCita, String emailUsuarioLogueado) {
        Cita cita = citaRepository.findById(idCita).orElse(null);
        if (cita == null) return false;
        
        return cita.getVehiculo().getUsuario().getEmail().equals(emailUsuarioLogueado);
    }
}