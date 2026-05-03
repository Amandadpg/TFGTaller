import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <aside class="w-64 bg-black text-white flex flex-col h-full shadow-2xl transition-all duration-300 border-r border-gray-900">
      <!-- LOGO / HEADER -->
      <div class="h-20 flex items-center justify-center border-b border-gray-900">
        <h1 class="text-2xl font-black tracking-widest text-primary drop-shadow-[0_0_10px_#E820BB] flex items-center gap-2 uppercase">
          GARAGE23AMG
        </h1>
      </div>
      
      <!-- NAVEGACIÓN -->
      <nav class="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
        <!-- ROLE CLIENTE -->
        <ng-container *ngIf="isCliente()">
          <a routerLink="/client-dashboard" routerLinkActive="bg-white/5 border-l-4 border-primary text-primary" [routerLinkActiveOptions]="{exact: true}"
             class="flex items-center px-4 py-3 text-gray-400 font-medium rounded-sm hover:bg-white/5 hover:text-primary transition-all duration-300 group tracking-wide text-sm">
            Dashboard
          </a>
          <a routerLink="/mi-perfil" routerLinkActive="bg-white/5 border-l-4 border-primary text-primary" 
             class="flex items-center px-4 py-3 text-gray-400 font-medium rounded-sm hover:bg-white/5 hover:text-primary transition-all duration-300 group tracking-wide text-sm">
            Mi Perfil
          </a>
          <a routerLink="/catalogo" routerLinkActive="bg-white/5 border-l-4 border-primary text-primary" 
             class="flex items-center px-4 py-3 text-gray-400 font-medium rounded-sm hover:bg-white/5 hover:text-primary transition-all duration-300 group tracking-wide text-sm">
            Catálogo
          </a>
          <a routerLink="/mis-vehiculos" routerLinkActive="bg-white/5 border-l-4 border-primary text-primary" 
             class="flex items-center px-4 py-3 text-gray-400 font-medium rounded-sm hover:bg-white/5 hover:text-primary transition-all duration-300 group tracking-wide text-sm">
            Mis Vehículos
          </a>
        </ng-container>

        <!-- ROLE ADMIN -->
        <ng-container *ngIf="isAdmin()">
          <a routerLink="/admin/dashboard" routerLinkActive="bg-white/5 border-l-4 border-primary text-primary" [routerLinkActiveOptions]="{exact: true}"
             class="flex items-center px-4 py-3 text-gray-400 font-medium rounded-sm hover:bg-white/5 hover:text-primary transition-all duration-300 group tracking-wide text-sm">
            Dashboard
          </a>
          <a routerLink="/admin/usuarios" routerLinkActive="bg-white/5 border-l-4 border-primary text-primary" 
             class="flex items-center px-4 py-3 text-gray-400 font-medium rounded-sm hover:bg-white/5 hover:text-primary transition-all duration-300 group tracking-wide text-sm">
            Usuarios
          </a>
          <a routerLink="/admin/vehiculos" routerLinkActive="bg-white/5 border-l-4 border-primary text-primary" 
             class="flex items-center px-4 py-3 text-gray-400 font-medium rounded-sm hover:bg-white/5 hover:text-primary transition-all duration-300 group tracking-wide text-sm">
            Vehículos
          </a>
          <a routerLink="/admin/citas" routerLinkActive="bg-white/5 border-l-4 border-primary text-primary" 
             class="flex items-center px-4 py-3 text-gray-400 font-medium rounded-sm hover:bg-white/5 hover:text-primary transition-all duration-300 group tracking-wide text-sm">
            Citas
          </a>
          <a routerLink="/admin/servicios" routerLinkActive="bg-white/5 border-l-4 border-primary text-primary" 
             class="flex items-center px-4 py-3 text-gray-400 font-medium rounded-sm hover:bg-white/5 hover:text-primary transition-all duration-300 group tracking-wide text-sm">
            Servicios
          </a>
        </ng-container>
      </nav>

      <!-- ADORNO INFERIOR DE MARCA (Para todos) -->
      <div class="mt-auto p-6 border-t border-gray-900 bg-black">
        <!-- Indicador de sistema -->
        <div class="flex items-center gap-2 mb-1.5 opacity-80 hover:opacity-100 transition-opacity cursor-default">
          <span class="relative flex h-2 w-2">
            <!-- El color primario se hereda de tu configuración, normalmente rosa -->
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span class="text-[10px] font-black uppercase tracking-widest text-primary">
            Sistema En Línea
          </span>
        </div>
        <!-- Frase de marca -->
        <p class="text-[9px] font-bold text-gray-600 uppercase tracking-widest">
          Precisión & Rendimiento
        </p>
      </div>
      
    </aside>
  `
})
export class SidebarComponent {
  private authService = inject(AuthService);

  isCliente(): boolean {
    return this.authService.currentUser()?.rol === 'CLIENTE';
  }

  isAdmin(): boolean {
    return this.authService.currentUser()?.rol === 'ADMIN';
  }
}