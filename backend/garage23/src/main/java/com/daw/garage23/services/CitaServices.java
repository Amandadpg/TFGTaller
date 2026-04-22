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
        return citaMapper.toDTOList(citaRepository.findAll()); // <--- CAMBIADO
    }
    
    public CitaResponseDTO buscarPorId(int id) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new CitaNotFoundException("No se encontró la cita con ID: " + id));
        return citaMapper.toResponseDTO(cita); // <--- CAMBIADO
    }
    
    public List<CitaResponseDTO> buscarCitasPorNombreUsuario(String nombre) {
        List<Cita> citas = citaRepository.findByVehiculoUsuarioNombreContainingIgnoreCase(nombre);
        if (citas.isEmpty()) {
            throw new CitaNotFoundException("No hay citas para el usuario: " + nombre);
        }
        return citas.stream()
                    .map(c -> citaMapper.toResponseDTO(c)) // <--- CAMBIADO
                    .collect(Collectors.toList());
    }

    public CitaResponseDTO reservar(CitaRequestDTO dto) {
        Vehiculo vehiculo = vehiculoServices.buscarEntidadPorId(dto.getVehiculoId());
        Servicio servicio = servicioServices.buscarEntidadPorId(dto.getServicioId());

        Cita cita = new Cita();
        cita.setFecha(dto.getFecha());
        cita.setHora(dto.getHora());
        cita.setEstado(Estado.PENDIENTE);
        cita.setVehiculo(vehiculo);
        cita.setServicio(servicio);

        return citaMapper.toResponseDTO(citaRepository.save(cita)); // <--- CAMBIADO
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
        
        return citaMapper.toResponseDTO(citaRepository.save(cita));
    }
    
    @Transactional
    public CitaResponseDTO modificarCitaAdmin(int id, CitaRequestDTO dto) {
        // 1. Buscamos la cita (sin filtros de tiempo, el admin es el jefe)
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new CitaNotFoundException("La cita no existe."));

        // 2. Validamos el nuevo Vehículo y Servicio si se envían en el DTO
        if (dto.getVehiculoId() > 0) {
            Vehiculo vehiculo = vehiculoServices.buscarEntidadPorId(dto.getVehiculoId());
            cita.setVehiculo(vehiculo);
        }
        if (dto.getServicioId() > 0) {
            Servicio servicio = servicioServices.buscarEntidadPorId(dto.getServicioId());
            cita.setServicio(servicio);
        }

        // 3. Aplicamos cambios básicos
        if (dto.getFecha() != null) cita.setFecha(dto.getFecha());
        if (dto.getHora() != null) cita.setHora(dto.getHora());
        
        // Opcional: Si el DTO trae un estado, también lo actualizamos
        // cita.setEstado(dto.getEstado()); 

        // 4. Guardar y mapear (usando tu estilo estático)
        return citaMapper.toResponseDTO(citaRepository.save(cita));
    }
    
    @Transactional // Es buena práctica añadirlo cuando modificas BD
    public CitaResponseDTO modificarCitaCliente(int id, CitaRequestDTO dto) {
        // 1. Buscar la cita (He cambiado Long por int porque tu repositorio usa int)
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new CitaNotFoundException("Cita no encontrada con ID: " + id));

        // 2. Lógica de las 24 horas
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime fechaCita = LocalDateTime.of(cita.getFecha(), cita.getHora());

        if (ahora.isAfter(fechaCita.minusHours(24))) {
            throw new CitaException("No puedes modificar; faltan menos de 24h para la cita.");
        }

        // 3. Lógica del estado
        if (cita.getEstado() != Estado.PENDIENTE) {
            throw new CitaException("Solo se pueden modificar citas en estado PENDIENTE.");
        }

        // 4. Actualizar datos (Fecha y Hora)
        cita.setFecha(dto.getFecha());
        cita.setHora(dto.getHora());
        
        return citaMapper.toResponseDTO(citaRepository.save(cita));
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
    
    public boolean esDuenioDeLaCita(int idCita, String emailUsuarioLogueado) {
        Cita cita = citaRepository.findById(idCita).orElse(null);
        if (cita == null) return false;
        
        // Comprobamos si el email del dueño del vehículo de la cita 
        // coincide con el email del token JWT
        return cita.getVehiculo().getUsuario().getEmail().equals(emailUsuarioLogueado);
    }
}