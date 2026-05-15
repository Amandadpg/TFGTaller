import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ToastService } from '../../services/toast/toast.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav [ngClass]="scrolled ? 'bg-black' : 'bg-black/50 backdrop-blur-md'" 
         class="fixed w-full z-50 top-0 transition-all duration-300 border-b border-gray-900/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          
          <div class="flex-shrink-0 cursor-pointer z-10 flex items-center" routerLink="/">
            <img src="assets/logo.png" alt="Garage23 AMG" class="h-16 w-auto object-contain hover:scale-105 transition-transform" />
          </div>
          
          <div class="hidden md:flex items-baseline space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <a routerLink="/" class="text-gray-300 hover:text-white hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-black uppercase tracking-widest cursor-pointer">
              Inicio
            </a>
            <a (click)="scrollToServicios()" class="text-gray-300 hover:text-white hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-black uppercase tracking-widest cursor-pointer">
              Servicios
            </a>
            <ng-container *ngIf="isCliente()">
              <a routerLink="/reservar" class="text-gray-300 hover:text-white hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-black uppercase tracking-widest cursor-pointer">
                Reservar Cita
              </a>
            </ng-container>
          </div>
          
          <div class="hidden md:flex items-center gap-4 z-10">
            <ng-container *ngIf="!isAuthenticated()">
              <a routerLink="/login" class="text-white hover:text-primary transition-colors font-bold text-sm tracking-widest uppercase">
                Entrar
              </a>
              <a routerLink="/registro" class="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-none shadow-[0_0_15px_rgba(232,32,187,0.3)] hover:shadow-[0_0_25px_rgba(232,32,187,0.5)] transition-all font-black text-sm tracking-widest uppercase cursor-pointer">
                Registrarse
              </a>
            </ng-container>

            <ng-container *ngIf="isAuthenticated()">
              <a *ngIf="isAdmin()" routerLink="/admin/dashboard" class="text-primary font-bold text-sm tracking-widest uppercase hover:text-white transition-colors">
                Panel Admin
              </a>
              <ng-container *ngIf="isCliente()">
                <a routerLink="/client-dashboard" class="flex items-center gap-2 text-white hover:text-primary transition-colors font-bold text-sm tracking-widest uppercase group">
                  <svg class="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  Mi Panel
                </a>
              </ng-container>
              <div class="h-6 w-px bg-gray-800 mx-2"></div>
              <button (click)="logout()" class="text-gray-400 hover:text-red-500 transition-colors font-bold text-sm tracking-widest uppercase flex items-center gap-1 group">
                Salir
                <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
              </button>
            </ng-container>
          </div>

          <div class="flex items-center gap-4 md:hidden z-10">
            
            <ng-container *ngIf="!isAuthenticated()">
              <a routerLink="/login" class="text-gray-200 hover:text-primary transition-colors" title="Iniciar Sesión">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </a>
              <a routerLink="/registro" class="text-white hover:text-primary transition-colors relative" title="Registrarse">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span class="absolute -top-1 -right-2 text-primary font-bold text-lg leading-none">+</span>
              </a>
            </ng-container>

            <ng-container *ngIf="isAuthenticated()">
              <a *ngIf="isCliente() || isAdmin()" routerLink="/login" class="text-primary p-1" title="Mi Panel">
                <svg class="w-7 h-7 drop-shadow-[0_0_5px_#E820BB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </a>
            </ng-container>

            <div class="h-6 w-px bg-gray-600 mx-1"></div>

            <button (click)="mobileMenuOpen = !mobileMenuOpen" type="button" class="text-white hover:text-primary focus:outline-none transition-colors">
              <span class="sr-only">Abrir menú</span>
              <svg *ngIf="!mobileMenuOpen" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg *ngIf="mobileMenuOpen" class="h-8 w-8 text-primary drop-shadow-[0_0_5px_#E820BB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="mobileMenuOpen" class="md:hidden bg-black/95 backdrop-blur-xl border-b border-gray-900 absolute w-full shadow-2xl">
        <div class="px-4 pt-4 pb-6 space-y-3">
          <a routerLink="/" class="text-gray-300 hover:text-white block px-3 py-3 rounded-md text-sm font-black uppercase tracking-widest border-b border-gray-800">Inicio</a>
          <a (click)="scrollToServicios()" class="text-gray-300 hover:text-white block px-3 py-3 rounded-md text-sm font-black uppercase tracking-widest cursor-pointer border-b border-gray-800">Servicios</a>
          
          <ng-container *ngIf="!isAuthenticated()">
            <a routerLink="/login" class="text-gray-300 hover:text-white block px-3 py-3 rounded-md text-sm font-black uppercase tracking-widest border-b border-gray-800 mt-4">Entrar</a>
            <a routerLink="/registro" class="text-primary hover:text-pink-400 block px-3 py-3 rounded-md text-sm font-black uppercase tracking-widest border-b border-gray-800">Registrarse</a>
          </ng-container>

          <ng-container *ngIf="isAuthenticated()">
            <a *ngIf="isCliente()" routerLink="/client-dashboard" class="text-gray-300 hover:text-white block px-3 py-3 rounded-md text-sm font-black uppercase tracking-widest border-b border-gray-800 mt-4">Mi Panel</a>
            <a *ngIf="isCliente()" routerLink="/reservar" class="text-gray-300 hover:text-white block px-3 py-3 rounded-md text-sm font-black uppercase tracking-widest border-b border-gray-800">Reservar Cita</a>
            <a *ngIf="isAdmin()" routerLink="/admin/dashboard" class="text-primary hover:text-pink-400 block px-3 py-3 rounded-md text-sm font-black uppercase tracking-widest border-b border-gray-800 mt-4">Panel Admin</a>
            <button (click)="logout()" class="text-red-500 hover:text-red-400 w-full text-left px-3 py-3 rounded-md text-sm font-black uppercase tracking-widest mt-2">Salir</button>
          </ng-container>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  scrolled = false;
  mobileMenuOpen = false;

  constructor() {
    window.addEventListener('scroll', () => {
      this.scrolled = window.scrollY > 20;
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.mobileMenuOpen = false;
    });
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isCliente(): boolean {
    return this.authService.currentUser()?.rol === 'CLIENTE';
  }

  isAdmin(): boolean {
    return this.authService.currentUser()?.rol === 'ADMIN';
  }

  logout() {
    this.authService.logout();
    this.toastService.show('Sesión cerrada', 'info');
  }

  scrollToServicios() {
    if (this.router.url !== '/') {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => this.doScroll(), 100);
      });
    } else {
      this.doScroll();
    }
    this.mobileMenuOpen = false;
  }

  private doScroll() {
    const el = document.getElementById('servicios-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}