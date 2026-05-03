import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitaService } from '../../../core/services/cita/cita.service';
import { UsuarioService } from '../../../core/services/usuario/usuario.service';
import { VehiculoService } from '../../../core/services/vehiculo/vehiculo.service';

@Component({
  selector: 'app-admin-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8">
      <div>
        <h1 class="text-3xl font-black text-white uppercase tracking-tighter">Resumen de Actividad</h1>
        <p class="text-gray-500 font-medium">Estado general de Garage23AMG</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        <div class="bg-[#111] p-6 rounded-2xl border border-gray-800 shadow-xl border-t-4 border-t-pink-500 flex flex-col items-center">
          <p class="text-gray-500 text-xs font-bold uppercase tracking-widest">Total Usuarios</p>
          <h2 class="text-4xl font-black text-white mt-2">{{ stats.usuarios }}</h2>
        </div>

        <div class="bg-[#111] p-6 rounded-2xl border border-gray-800 shadow-xl border-t-4 border-t-blue-500 flex flex-col items-center">
          <p class="text-gray-500 text-xs font-bold uppercase tracking-widest">Vehículos en DB</p>
          <h2 class="text-4xl font-black text-white mt-2">{{ stats.vehiculos }}</h2>
        </div>

        <div class="bg-[#111] p-6 rounded-2xl border border-gray-800 shadow-xl border-t-4 border-t-green-500 flex flex-col items-center">
          <p class="text-gray-500 text-xs font-bold uppercase tracking-widest">Citas Totales</p>
          <h2 class="text-4xl font-black text-white mt-2">{{ stats.citas }}</h2>
        </div>

        <div class="bg-[#111] p-6 rounded-2xl border border-gray-800 shadow-xl border-t-4 border-t-purple-500 flex flex-col items-center">
          <p class="text-gray-500 text-xs font-bold uppercase tracking-widest">Próximos 3 días</p>
          <h2 class="text-4xl font-black text-pink-500 mt-2">{{ totalCitasProximas }}</h2>
        </div>
      </div>

      <div class="bg-[#111] border border-gray-800 rounded-3xl shadow-2xl p-6">
        <h3 class="text-lg font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
          <span>📅</span> Calendario de Trabajo
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @for (dia of diasCalendario; track dia.fecha) {
            <div class="bg-[#050505] rounded-2xl border border-gray-800 p-4 flex flex-col min-h-[250px]">
              
              <div class="border-b border-gray-800 pb-3 mb-4 flex justify-between items-center">
                <span class="text-white font-black uppercase tracking-wider">{{ dia.titulo }}</span>
                <span class="text-pink-500 font-bold text-sm">{{ dia.fecha | date:'dd MMM' }}</span>
              </div>

              <div class="flex-1 space-y-3">
                @if (dia.citas.length > 0) {
                  @for (cita of dia.citas; track cita.id) {
                    <div class="bg-gray-900/60 p-4 rounded-xl border border-gray-800/80 hover:border-pink-500/50 hover:bg-gray-800 transition-all group">
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-pink-500 font-black text-lg bg-pink-500/10 px-2 rounded">{{ cita.hora }}</span>
                      </div>
                      <p class="text-white font-bold text-sm uppercase">{{ cita.servicio || 'Servicio Programado' }}</p>
                      <p class="text-xs text-gray-400 mt-2 font-mono">
                        🚗 Matrícula: <span class="text-gray-200">{{ cita.matriculaVehiculo }}</span>
                      </p>
                    </div>
                  }
                } @else {
                  <div class="h-full flex flex-col items-center justify-center py-8 opacity-40">
                    <span class="text-3xl mb-2">🏁</span>
                    <p class="text-xs text-gray-500 uppercase font-bold tracking-widest text-center">Pista despejada</p>
                  </div>
                }
              </div>

            </div>
          }
        </div>

      </div>
    </div>
  `
})
export class AdminStatsComponent implements OnInit {
  private citaService = inject(CitaService);
  private usuarioService = inject(UsuarioService);
  private vehiculoService = inject(VehiculoService);

  stats: any = { usuarios: 0, vehiculos: 0, citas: 0 };
  totalCitasProximas: number = 0;

  // Array estructurado para pintar las 3 columnas del calendario
  diasCalendario: { fecha: Date, titulo: string, citas: any[] }[] = [];

  ngOnInit() {
    this.cargarEstadisticas();
    this.cargarAgendaProxima();
  }

  cargarEstadisticas() {
    this.usuarioService.listarTodos().subscribe({
      next: (res: any) => { this.stats.usuarios = res ? res.length : 0; }
    });

    this.vehiculoService.listarTodosVehiculos().subscribe({
      next: (res: any) => { this.stats.vehiculos = res ? res.length : 0; }
    });

    this.citaService.obtenerTodas().subscribe({
      next: (res: any) => { this.stats.citas = res ? res.length : 0; }
    });
  }

  cargarAgendaProxima() {
    this.citaService.obtenerTodas().subscribe({
      next: (res: any) => {
        const citasRaw = res || [];
        this.totalCitasProximas = 0;
        this.diasCalendario = [];

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        // Generamos los 3 días (0=Hoy, 1=Mañana, 2=Pasado)
        for (let i = 0; i < 3; i++) {
          const fechaDia = new Date(hoy);
          fechaDia.setDate(hoy.getDate() + i);

          let titulo = '';
          if (i === 0) titulo = 'Hoy';
          else if (i === 1) titulo = 'Mañana';
          else titulo = 'Pasado';

          // Filtramos las citas que caen exactamente en este día
          const citasDelDia = citasRaw.filter((cita: any) => {
            if (!cita || !cita.fecha) return false;
            const fechaCita = new Date(cita.fecha);
            return fechaCita.getDate() === fechaDia.getDate() &&
              fechaCita.getMonth() === fechaDia.getMonth() &&
              fechaCita.getFullYear() === fechaDia.getFullYear();
          });

          this.totalCitasProximas += citasDelDia.length;

          // Guardamos el día con sus citas
          this.diasCalendario.push({
            fecha: fechaDia,
            titulo: titulo,
            citas: citasDelDia
          });
        }
      }
    });
  }
}