import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { VehiculoService } from '../../../core/services/vehiculo/vehiculo.service';
import { CitaService } from '../../../core/services/cita/cita.service';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './client-dashboard.component.html'
})
export class ClientDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private vehiculoService = inject(VehiculoService);
  private citaService = inject(CitaService);

  nombreUsuario: string = '';
  misVehiculos: any[] = [];
  misCitas: any[] = [];

  ngOnInit() {
    const user = this.authService.currentUser();
    this.nombreUsuario = user?.nombre ?? 'Cliente';

    // 1. Cargamos primero los vehículos (Ruta segura /mis-vehiculos)
    this.vehiculoService.obtenerMisVehiculos().subscribe({
      next: (vehiculos: any[]) => {
        this.misVehiculos = vehiculos;
        console.log('Mis Vehículos cargados:', this.misVehiculos);

        // 2. Cargamos las citas usando la NUEVA ruta segura (/mis-citas)
        this.citaService.obtenerMisCitas().subscribe({
          next: (citas: any[]) => {
            console.log('Citas recibidas del backend:', citas);

            // A) FILTRAMOS: Quitamos las 'CANCELADA' y 'COMPLETADA' (o 'FINALIZADA')
            const citasActivas = citas.filter(cita => {
              const estado = cita.estado ? String(cita.estado).toUpperCase() : '';
              return estado !== 'CANCELADA' && estado !== 'COMPLETADA' && estado !== 'FINALIZADA';
            });

            // B) CRUZAMOS LOS DATOS (usando matriculaVehiculo)
            let citasProcesadas = citasActivas.map(cita => {
              const matCita = cita.matriculaVehiculo ? String(cita.matriculaVehiculo).trim().toUpperCase() : 'SIN_MATRICULA';

              const cocheEncontrado = this.misVehiculos.find(v => {
                const matVehiculo = v.matricula ? String(v.matricula).trim().toUpperCase() : 'VACIO';
                return matVehiculo === matCita;
              });

              return {
                ...cita,
                vehiculoInfo: cocheEncontrado // Guardamos marca, modelo, etc.
              };
            });

            // C) ORDENAMOS: Por fecha y hora (las más próximas primero)
            citasProcesadas.sort((a, b) => {
              const fechaA = new Date(`${a.fecha}T${a.hora || '00:00'}`).getTime();
              const fechaB = new Date(`${b.fecha}T${b.hora || '00:00'}`).getTime();

              return fechaA - fechaB;
            });

            // Guardamos el resultado final
            this.misCitas = citasProcesadas;
            console.log('Citas finales (Filtradas, Ordenadas y con Coche):', this.misCitas);
          },
          error: (err) => console.error('Error al cargar mis citas:', err)
        });
      },
      error: (err) => console.error('Error al cargar mis vehículos:', err)
    });
  }

  cerrarSesion() {
    this.authService.logout();
  }

  abrirWhatsApp() {
    window.open('https://wa.me/34610820108', '_blank');
  }
}