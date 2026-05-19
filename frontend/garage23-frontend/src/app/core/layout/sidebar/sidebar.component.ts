import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <aside class="w-64 bg-black text-white flex flex-col h-full shadow-2xl transition-transform duration-300 border-r border-gray-900 absolute md:relative z-50 top-0 left-0"
           [ngClass]="isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'">
      
      <div class="h-16 md:h-20 flex items-center justify-center border-b border-gray-900 shrink-0 relative">
        <h1 class="text-xl md:text-2xl font-black tracking-widest text-primary drop-shadow-[0_0_10px_#E820BB] flex items-center gap-2 uppercase">
          GARAGE23AMG
        </h1>
        <button (click)="closeMenu.emit()" class="md:hidden absolute right-4 text-gray-400 hover:text-white">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      
      <nav class="flex-1 px-4 py-6 md:py-8 space-y-2 overflow-y-auto custom-scrollbar">
        <ng-container *ngIf="isCliente()">
          <a routerLink="/client-dashboard" routerLinkActive="bg-white/5 border-l-4 border-primary text-primary" [routerLinkActiveOptions]="{exact: true}" (click)="closeMenu.emit()"
             class="flex items-center px-4 py-3 text-gray-400 font-medium rounded-sm hover:bg-white/5 hover:text-primary transition-all duration-300 group tracking-wide text-sm">
            Dashboard
          </a>
          <a routerLink="/mi-perfil" routerLinkActive="bg-white/5 border-l-4 border-primary text-primary" (click)="closeMenu.emit()"
             class="flex items-center px-4 py-3 text-gray-400 font-medium rounded-sm hover:bg-white/5 hover:text-primary transition-all duration-300 group tracking-wide text-sm">
            Mi Perfil
          </a>
          <a routerLink="/catalogo" routerLinkActive="bg-white/5 border-l-4 border-primary text-primary" (click)="closeMenu.emit()"
             class="flex items-center px-4 py-3 text-gray-400 font-medium rounded-sm hover:bg-white/5 hover:text-primary transition-all duration-300 group tracking-wide text-sm">
            Catálogo
          </a>
          <a routerLink="/mis-vehiculos" routerLinkActive="bg-white/5 border-l-4 border-primary text-primary" (click)="closeMenu.emit()"
             class="flex items-center px-4 py-3 text-gray-400 font-medium rounded-sm hover:bg-white/5 hover:text-primary transition-all duration-300 group tracking-wide text-sm">
            Mis Vehículos
          </a>
        </ng-container>

        <ng-container *ngIf="isAdmin()">
          <a routerLink="/admin/dashboard" routerLinkActive="bg-white/5 border-l-4 border-primary text-primary" [routerLinkActiveOptions]="{exact: true}" (click)="closeMenu.emit()"
             class="flex items-center px-4 py-3 text-gray-400 font-medium rounded-sm hover:bg-white/5 hover:text-primary transition-all duration-300 group tracking-wide text-sm">
            Dashboard
          </a>
          <a routerLink="/admin/usuarios" routerLinkActive="bg-white/5 border-l-4 border-primary text-primary" (click)="closeMenu.emit()"
             class="flex items-center px-4 py-3 text-gray-400 font-medium rounded-sm hover:bg-white/5 hover:text-primary transition-all duration-300 group tracking-wide text-sm">
            Usuarios
          </a>
          <a routerLink="/admin/vehiculos" routerLinkActive="bg-white/5 border-l-4 border-primary text-primary" (click)="closeMenu.emit()"
             class="flex items-center px-4 py-3 text-gray-400 font-medium rounded-sm hover:bg-white/5 hover:text-primary transition-all duration-300 group tracking-wide text-sm">
            Vehículos
          </a>
          <a routerLink="/admin/citas" routerLinkActive="bg-white/5 border-l-4 border-primary text-primary" (click)="closeMenu.emit()"
             class="flex items-center px-4 py-3 text-gray-400 font-medium rounded-sm hover:bg-white/5 hover:text-primary transition-all duration-300 group tracking-wide text-sm">
            Citas
          </a>
          <a routerLink="/admin/servicios" routerLinkActive="bg-white/5 border-l-4 border-primary text-primary" (click)="closeMenu.emit()"
             class="flex items-center px-4 py-3 text-gray-400 font-medium rounded-sm hover:bg-white/5 hover:text-primary transition-all duration-300 group tracking-wide text-sm">
            Servicios
          </a>
        </ng-container>
      </nav>

      <div class="mt-auto p-4 md:p-6 border-t border-gray-900 bg-black shrink-0">
        <div class="flex items-center gap-2 mb-1.5 opacity-80 hover:opacity-100 transition-opacity cursor-default">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span class="text-[10px] font-black uppercase tracking-widest text-primary">
            Sistema En Línea
          </span>
        </div>
        <p class="text-[9px] font-bold text-gray-600 uppercase tracking-widest">
          Precisión & Rendimiento
        </p>
      </div>
      
    </aside>
  `
})
export class SidebarComponent {
  @Input() isOpen = false; // Recibe la orden de abrirse
  @Output() closeMenu = new EventEmitter<void>(); // Avisa para cerrarse (ej: al hacer clic en un enlace)

  private authService = inject(AuthService);

  isCliente(): boolean {
    return this.authService.currentUser()?.rol === 'CLIENTE';
  }

  isAdmin(): boolean {
    return this.authService.currentUser()?.rol === 'ADMIN';
  }
}