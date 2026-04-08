import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  template: `
    <div class="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[400px]">
      <div class="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-6">
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      </div>
      <h1 class="text-3xl font-bold text-slate-800">Panel de Control de Admin - Total Citas: 7</h1>
      <p class="text-slate-500 mt-4 text-center max-w-md text-lg">
        Gestión general de citas, servicios, clientes y configuraciones del taller mecánico.
      </p>
    </div>
  `
})
export class AdminDashboardComponent {}
