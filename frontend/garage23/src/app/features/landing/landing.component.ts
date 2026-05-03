import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ServicioService } from '../../core/services/servicio/servicio.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { ToastService } from '../../core/services/toast/toast.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="font-sans overflow-hidden bg-black text-white">
      
      <!-- HERO SECTION -->
      <section class="relative h-[calc(100vh-5rem)] flex items-center justify-center">
        <div class="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1615906655593-ad0386982a0f?auto=format&fit=crop&q=80" alt="Taller mecánico" class="w-full h-full object-cover opacity-50" />
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div class="absolute inset-0 bg-black/40"></div>
        </div>

        <div class="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center animate-fade-in">
          <h1 class="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-2xl mb-6 leading-[1.1]">
            PRECISIÓN Y RENDIMIENTO<br/>
            <span class="text-primary">PARA TU VEHÍCULO.</span>
          </h1>
          <p class="text-lg md:text-2xl text-gray-300 font-medium mb-10 max-w-3xl mx-auto drop-shadow-lg tracking-wide">
            En Garage23AMG contamos con tecnología de vanguardia y mecánicos expertos para garantizar que tu coche rinda al máximo en cada kilómetro.
          </p>
          <button (click)="scrollToServicios()" class="inline-flex items-center justify-center px-10 py-4 text-lg font-extrabold text-white bg-primary hover:bg-primary/90 shadow-[0_0_20px_#E820BB] hover:shadow-[0_0_40px_#E820BB] transition-all duration-300 active:scale-95 tracking-[0.15em] uppercase">
            Descubre Nuestros Servicios
          </button>
        </div>
      </section>

      <!-- SECCIÓN SERVICIOS -->
      <section id="servicios-section" class="py-24 bg-[#050505]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-sm font-black text-primary tracking-[0.3em] uppercase mb-2">Nuestro Catálogo</h2>
            <h3 class="text-4xl md:text-5xl font-black text-white tracking-tight">SERVICIOS PROFESIONALES</h3>
            <div class="w-24 h-1 bg-primary mx-auto mt-6"></div>
          </div>

          <div *ngIf="servicioService.isLoading()" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div *ngFor="let servicio of servicioService.servicios()" class="bg-[#111] rounded-none border border-gray-800 hover:border-primary transition-all duration-300 group overflow-hidden flex flex-col h-full shadow-2xl">
              <div class="h-48 bg-gray-900 relative overflow-hidden flex items-center justify-center border-b border-gray-800">
                <!-- Imagen placeholder o icono -->
                <svg class="w-20 h-20 text-gray-800 group-hover:scale-110 group-hover:text-primary/30 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <div class="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent"></div>
              </div>
              <div class="p-8 flex-1 flex flex-col">
                <div class="flex justify-between items-start mb-4">
                  <h4 class="text-xl font-black text-white uppercase tracking-wider">{{ servicio.nombreServicio }}</h4>
                  <span class="text-primary font-black text-lg bg-primary/10 px-3 py-1 border border-primary/20">{{ servicio.precio }}€</span>
                </div>
                <p class="text-gray-400 text-sm leading-relaxed mb-8 flex-1">{{ servicio.descripcion }}</p>
                <button (click)="solicitarServicio(servicio.id)" class="w-full py-4 border-2 border-gray-700 hover:border-primary text-gray-300 hover:text-white font-black uppercase tracking-[0.2em] transition-all duration-300 group-hover:bg-primary/5 text-xs">
                  Solicitar Cita
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SOBRE NOSOTROS -->
      <section class="py-24 bg-black relative border-t border-gray-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 class="text-sm font-black text-primary tracking-[0.3em] uppercase mb-2">Sobre Nosotros</h2>
            <h3 class="text-4xl font-black text-white tracking-tight mb-6">MÁS DE 15 AÑOS DE EXPERIENCIA EN ALTO RENDIMIENTO</h3>
            <p class="text-gray-400 text-lg mb-6 leading-relaxed">
              No somos un taller convencional. Somos unos apasionados del motor que entienden tu vehículo como lo haces tú. Nuestro compromiso es la transparencia, la rapidez y la excelencia en cada reparación o mantenimiento.
            </p>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center gap-3 text-gray-300"><svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Recambios originales de máxima calidad.</li>
              <li class="flex items-center gap-3 text-gray-300"><svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Presupuestos sin sorpresas ni letra pequeña.</li>
              <li class="flex items-center gap-3 text-gray-300"><svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Asesoramiento personalizado por mecánicos certificados.</li>
            </ul>
          </div>
          <div class="relative h-96 bg-gray-900 border border-gray-800 shadow-[0_0_30px_rgba(232,32,187,0.1)]">
            <img src="https://images.unsplash.com/photo-1599256621730-535171e28e50?auto=format&fit=crop&q=80" alt="Mecánico trabajando" class="w-full h-full object-cover opacity-80" />
            <div class="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent"></div>
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.8s ease-out forwards;
    }
  `]
})
export class LandingComponent implements OnInit {
  servicioService = inject(ServicioService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  ngOnInit() {
    this.servicioService.cargarServicios();
  }

  scrollToServicios() {
    document.getElementById('servicios-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  solicitarServicio(id: number | undefined) {
    if (!id) return;

    if (!this.authService.isAuthenticated()) {
      this.toastService.show('Por favor, inicia sesión o regístrate para reservar una cita.', 'info');
      this.router.navigate(['/login']); // Podríamos guardar el returnUrl en session storage si queremos
    } else {
      if (this.authService.currentUser()?.rol === 'ADMIN') {
        this.toastService.show('Los administradores gestionan las citas desde el Panel Admin.', 'info');
      } else {
        this.router.navigate(['/reservar'], { queryParams: { servicioId: id } });
      }
    }
  }
}
