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
      <div class="h-20 flex items-center justify-center border-b border-gray-900">
        <h1 class="text-2xl font-black tracking-widest text-primary drop-shadow-[0_0_10px_#E820BB] flex items-center gap-2 uppercase">
          Garage23
        </h1>
      </div>
      
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
          <a routerLink="/admin-dashboard" routerLinkActive="bg-white/5 border-l-4 border-primary text-primary" [routerLinkActiveOptions]="{exact: true}"
             class="flex items-center px-4 py-3 text-gray-400 font-medium rounded-sm hover:bg-white/5 hover:text-primary transition-all duration-300 group tracking-wide text-sm">
            Dashboard
          </a>
          <a routerLink="/admin-usuarios" routerLinkActive="bg-white/5 border-l-4 border-primary text-primary" 
             class="flex items-center px-4 py-3 text-gray-400 font-medium rounded-sm hover:bg-white/5 hover:text-primary transition-all duration-300 group tracking-wide text-sm">
            Usuarios
          </a>
          <a routerLink="/admin-vehiculos" routerLinkActive="bg-white/5 border-l-4 border-primary text-primary" 
             class="flex items-center px-4 py-3 text-gray-400 font-medium rounded-sm hover:bg-white/5 hover:text-primary transition-all duration-300 group tracking-wide text-sm">
            Vehículos
          </a>
          <a routerLink="/admin-citas" routerLinkActive="bg-white/5 border-l-4 border-primary text-primary" 
             class="flex items-center px-4 py-3 text-gray-400 font-medium rounded-sm hover:bg-white/5 hover:text-primary transition-all duration-300 group tracking-wide text-sm">
            Citas
          </a>
          <a routerLink="/admin-servicios" routerLinkActive="bg-white/5 border-l-4 border-primary text-primary" 
             class="flex items-center px-4 py-3 text-gray-400 font-medium rounded-sm hover:bg-white/5 hover:text-primary transition-all duration-300 group tracking-wide text-sm">
            Servicios
          </a>
        </ng-container>
      </nav>
      
      <div class="p-4 border-t border-gray-900 flex justify-center pb-8">
        <button (click)="logout()" class="text-sm font-bold text-gray-500 hover:text-primary transition-colors flex items-center gap-2">
          Cerrar Sesión
        </button>
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

  logout() {
    this.authService.logout();
  }
}
