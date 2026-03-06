package com.daw.garage23.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daw.garage23.persistence.entities.Cita;
import com.daw.garage23.persistence.entities.Servicio;
import com.daw.garage23.persistence.entities.Vehiculo;
import com.daw.garage23.persistence.entities.enums.Estado;
import com.daw.garage23.persistence.repositories.CitaRepository;
import com.daw.garage23.persistence.repositories.ServicioRepository;
import com.daw.garage23.persistence.repositories.VehiculoRepository;
import com.daw.garage23.services.dto.Citas.CitaRequestDTO;
import com.daw.garage23.services.dto.Citas.CitaResponseDTO;
import com.daw.garage23.services.exceptions.Cita.CitaException;
import com.daw.garage23.services.exceptions.Cita.CitaNotFoundException;
import com.daw.garage23.services.exceptions.Servicio.ServicioNotFoundException;
import com.daw.garage23.services.exceptions.Vehiculo.VehiculoException;
import com.daw.garage23.services.mapper.CitaMapper;

import jakarta.transaction.Transactional;

@Service
public class CitaServices {

	@Autowired
    private CitaRepository citaRepository;

    @Autowired
    private VehiculoRepository vehiculoRepository;

    @Autowired
    private ServicioRepository servicioRepository;
    
    //Admin
    public List<CitaResponseDTO> listarTodas() {
        return citaRepository.findAll().stream().map(CitaMapper::toDTO).toList();
    }
    
    //Admin y cliente
    public CitaResponseDTO reservar(CitaRequestDTO dto) {

        Vehiculo vehiculo = vehiculoRepository.findById(dto.getVehiculoId())
                .orElseThrow(() -> new VehiculoException("Vehículo no encontrado"));

        Servicio servicio = servicioRepository.findById(dto.getServicioId())
                .orElseThrow(() -> new ServicioNotFoundException("Servicio no encontrado"));

        Cita cita = new Cita();
        cita.setFecha(dto.getFecha());
        cita.setHora(dto.getHora());
        cita.setEstado(Estado.PENDIENTE);
        cita.setVehiculo(vehiculo);
        cita.setServicio(servicio);

        Cita guardada = citaRepository.save(cita);

        return CitaMapper.toDTO(guardada);
    }
    
    
	//Cliente
    @Transactional
    public CitaResponseDTO cambiarEstado(int idCita, Estado nuevoEstado) {
        Cita cita = citaRepository.findById(idCita)
                .orElseThrow(() -> new CitaNotFoundException("Cita no encontrada"));

        if (cita.getEstado() != Estado.PENDIENTE) {
            throw new CitaException("Solo se pueden modificar citas en estado PENDIENTE");
        }

        cita.setEstado(nuevoEstado);
        Cita citaGuardada = citaRepository.save(cita);
        return CitaMapper.toDTO(citaGuardada);
    }
	
}
