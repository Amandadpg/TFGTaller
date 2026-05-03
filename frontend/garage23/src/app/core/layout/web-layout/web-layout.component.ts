import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-web-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="min-h-screen bg-black text-white font-sans flex flex-col">
      <app-navbar></app-navbar>
      
      <!-- Contenido de la Web (Landing, Perfil, etc) -->
      <main class="flex-1 w-full pt-20">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer simple y premium -->
      <footer class="bg-[#050505] border-t border-gray-900 py-12 mt-auto">
        <div class="max-w-7xl mx-auto px-6 text-center">
          <h2 class="text-xl font-black tracking-widest text-white uppercase mb-4">Garage23AMG</h2>
          <p class="text-gray-500 text-sm tracking-wide font-medium">Precisión & Rendimiento para tu vehículo.</p>
          <div class="mt-8 flex justify-center gap-6">
            <a href="#" class="text-gray-600 hover:text-primary transition-colors">Instagram</a>
            <a href="#" class="text-gray-600 hover:text-primary transition-colors">Facebook</a>
            <a href="#" class="text-gray-600 hover:text-primary transition-colors">Contacto</a>
          </div>
          <p class="mt-12 text-xs text-gray-700 tracking-widest uppercase">© 2026 Garage23AMG. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  `
})
export class WebLayoutComponent {}
