package com.daw.garage23.services;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daw.garage23.persistence.entities.Cita;
import com.daw.garage23.persistence.entities.enums.Estado;
import com.daw.garage23.persistence.repositories.CitaRepository;
import com.daw.garage23.persistence.repositories.UsuarioRepository;
import com.daw.garage23.persistence.repositories.VehiculoRepository;
import com.daw.garage23.services.dto.Citas.CitaResponseDTO;
import com.daw.garage23.services.dto.Dashboard.DashboardStatsDTO;
import com.daw.garage23.services.mapper.CitaMapper;

@Service
public class DashboardServices {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private VehiculoRepository vehiculoRepository;

    @Autowired
    private CitaRepository citaRepository;
    
    @Autowired
    private CitaMapper citaMapper;

    public DashboardStatsDTO getStats() {
        long totalUsuarios = usuarioRepository.count();
        long totalVehiculos = vehiculoRepository.count();
        long citasPendientesHoy = citaRepository.countByEstadoAndFecha(Estado.PENDIENTE, LocalDate.now());
        
        Double ingresos = citaRepository.calcularIngresosTotales();
        double ingresosEstimados = (ingresos != null) ? ingresos : 0.0;

        // Agenda próximos 3 días (incluyendo hoy)
        LocalDate hoy = LocalDate.now();
        LocalDate limite = hoy.plusDays(3);
        List<Cita> citasAgendaEntity = citaRepository.findCitasProximosDias(hoy, limite);
        List<CitaResponseDTO> agenda = citaMapper.toDTOList(citasAgendaEntity); // <--- CAMBIADO

        return new DashboardStatsDTO(totalUsuarios, totalVehiculos, citasPendientesHoy, ingresosEstimados, agenda);
    }
}
