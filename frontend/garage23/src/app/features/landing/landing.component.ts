import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="relative min-h-screen bg-black flex items-center justify-center font-sans overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1615906655593-ad0386982a0f?auto=format&fit=crop&q=80" 
          alt="Taller mecánico" 
          class="w-full h-full object-cover opacity-60"
        />
        <!-- Gradients for emphasis -->
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        <div class="absolute inset-0 bg-black/30"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center animate-fade-in">
        <h1 class="text-4xl md:text-6xl lg:text-[5rem] font-black text-white tracking-tighter drop-shadow-2xl mb-8 leading-[1.1]">
          TUS EXPERTOS EN EL<br/>
          <span class="text-white">CUIDADO DE TU VEHÍCULO.</span><br/>
          GESTIÓN TOTAL DE TU CITA.
        </h1>
        
        <p class="text-lg md:text-2xl text-gray-300 font-medium mb-12 max-w-2xl drop-shadow-lg tracking-wide">
          Tecnología de vanguardia y mecánicos de confianza para que tu coche siempre rinda al máximo.
        </p>

        <a routerLink="/login" 
           class="inline-flex items-center justify-center px-12 py-5 border border-transparent text-xl font-extrabold rounded-none text-white bg-primary hover:bg-primary/90 shadow-[0_0_20px_#E820BB] hover:shadow-[0_0_40px_#E820BB] transition-all duration-300 active:scale-95 tracking-[0.15em] hover:scale-105">
          PEDIR MI CITA AHORA / ACCEDER
        </a>
      </div>
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
export class LandingComponent {}
