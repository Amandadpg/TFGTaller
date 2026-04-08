import { Component } from '@angular/core';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  template: `
    <div class="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[400px]">
      <div class="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      </div>
      <h1 class="text-3xl font-bold text-slate-800">Dashboard de Cliente - Bienvenido Juan</h1>
      <p class="text-slate-500 mt-4 text-center max-w-md text-lg">
        Aquí podrás revisar el estado de tus citas, el historial de tu vehículo y solicitar nuevos servicios.
      </p>
    </div>
  `
})
export class ClientDashboardComponent {}
