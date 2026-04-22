import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardStats } from '../../../core/services/dashboard/dashboard.service';
import { ToastService } from '../../../core/services/toast/toast.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold mb-8 flex items-center gap-3" style="color: #1a1a1a;">
        <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
        Panel de Control de Administrador
      </h1>

      <div *ngIf="isLoading" class="text-brand-muted text-center py-10">Cargando estadísticas...</div>

      <div *ngIf="!isLoading && stats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <!-- Tarjeta Usuarios -->
        <div class="bg-brand-anthracite border border-gray-800 rounded-2xl p-6 shadow-lg flex items-center gap-6">
          <div class="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </div>
          <div>
            <p class="text-sm font-semibold text-brand-muted uppercase tracking-wider">Usuarios Registrados</p>
            <p class="text-4xl font-black text-white mt-1">{{ stats.totalUsuarios }}</p>
          </div>
        </div>

        <!-- Tarjeta Vehículos -->
        <div class="bg-brand-anthracite border border-gray-800 rounded-2xl p-6 shadow-lg flex items-center gap-6">
          <div class="w-16 h-16 bg-gray-500/10 text-gray-400 rounded-2xl flex items-center justify-center">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
          </div>
          <div>
            <p class="text-sm font-semibold text-brand-muted uppercase tracking-wider">Vehículos</p>
            <p class="text-4xl font-black text-white mt-1">{{ stats.totalVehiculos }}</p>
          </div>
        </div>

        <!-- Tarjeta Citas Pendientes Hoy -->
        <div class="bg-brand-anthracite border border-gray-800 rounded-2xl p-6 shadow-lg flex items-center gap-6">
          <div class="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <p class="text-sm font-semibold text-brand-muted uppercase tracking-wider">Citas Pendientes Hoy</p>
            <p class="text-4xl font-black text-white mt-1">{{ stats.citasPendientesHoy }}</p>
          </div>
        </div>

        <!-- Tarjeta Ingresos Estimados -->
        <div class="bg-brand-anthracite border border-gray-800 rounded-2xl p-6 shadow-lg flex items-center gap-6">
          <div class="w-16 h-16 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <p class="text-sm font-semibold text-brand-muted uppercase tracking-wider">Total Ingresado</p>
            <p class="text-4xl font-black text-white mt-1">{{ stats.ingresosEstimados | currency:'EUR':'symbol' }}</p>
          </div>
        </div>
      </div>

      <!-- Agenda de próximos 3 días -->
      <h2 *ngIf="!isLoading && stats" class="text-2xl font-bold mb-6 flex items-center gap-3" style="color: #1a1a1a;">
        <svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        Agenda de Trabajo (Próximos 3 días)
      </h2>
      <div *ngIf="!isLoading && stats" class="bg-brand-anthracite rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
        <table class="w-full text-left text-sm text-brand-light">
          <thead class="text-xs uppercase bg-gray-800 text-brand-muted border-b border-gray-700">
            <tr>
              <th class="px-6 py-4 font-medium">Fecha / Hora</th>
              <th class="px-6 py-4 font-medium">Servicio</th>
              <th class="px-6 py-4 font-medium">Vehículo</th>
              <th class="px-6 py-4 font-medium">Cliente</th>
              <th class="px-6 py-4 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="stats.agenda.length === 0" class="border-b border-gray-800">
              <td colspan="5" class="px-6 py-8 text-center text-brand-muted">No hay citas programadas para los próximos días.</td>
            </tr>
            <tr *ngFor="let cita of stats.agenda" class="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
              <td class="px-6 py-4">
                 <span class="block text-white font-medium">{{ cita.fecha | date:'mediumDate' }}</span>
                 <span class="block text-brand-muted font-bold">{{ cita.hora }}</span>
              </td>
              <td class="px-6 py-4 font-medium text-white">{{ cita.nombreServicio }}</td>
              <td class="px-6 py-4 font-mono tracking-wider font-bold text-gray-300">{{ cita.matriculaVehiculo }}</td>
              <td class="px-6 py-4 text-brand-muted">{{ cita.nombreUsuario || 'Cliente Desconocido' }}</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 rounded text-xs font-bold" 
                  [ngClass]="{
                    'bg-yellow-500/20 text-yellow-500': cita.estado === 'PENDIENTE',
                    'bg-green-500/20 text-green-500': cita.estado === 'COMPLETADA',
                    'bg-red-500/20 text-red-500': cita.estado === 'CANCELADA'
                  }">
                  {{ cita.estado }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private toastService = inject(ToastService);

  stats: DashboardStats | null = null;
  isLoading = true;

  ngOnInit() {
    this.dashboardService.getStats().subscribe({
      next: (data: DashboardStats) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: () => {
        this.toastService.show('Error al cargar estadísticas', 'error');
        this.isLoading = false;
      }
    });
  }
}

