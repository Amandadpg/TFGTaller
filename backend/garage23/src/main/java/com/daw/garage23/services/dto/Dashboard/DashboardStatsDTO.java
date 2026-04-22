package com.daw.garage23.services.dto.Dashboard;

import java.util.List;

import com.daw.garage23.services.dto.Citas.CitaResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalUsuarios;
    private long totalVehiculos;
    private long citasPendientesHoy;
    private double ingresosEstimados;
    private List<CitaResponseDTO> agenda;
}
