import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-web-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-[#050505] text-white font-sans flex flex-col overflow-x-hidden">
      
      <nav class="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-md border-b border-white/5 z-50">
        <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">

          <div class="flex items-center gap-3 relative z-10">
            <img src="/logo-garage23amg.png" alt="Logo Garage23AMG" class="h-10 w-auto">
            <h1 class="hidden lg:flex text-2xl font-black tracking-tighter uppercase items-center">
              <span class="text-white">GARAGE</span><span class="text-pink-600">23</span><span class="text-white">AMG</span>
            </h1>
          </div>

          <div class="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2 w-max">
            <a routerLink="/client-dashboard" routerLinkActive="text-pink-600" [routerLinkActiveOptions]="{exact: true}"
              class="text-xs font-bold tracking-widest uppercase text-zinc-400 hover:text-pink-500 transition-colors">
              Inicio
            </a>
            <a routerLink="/servicios" routerLinkActive="text-pink-600"
              class="text-xs font-bold tracking-widest uppercase text-zinc-400 hover:text-pink-500 transition-colors">
              Servicios
            </a>
            <a routerLink="/mis-vehiculos" routerLinkActive="text-pink-600"
              class="text-xs font-bold tracking-widest uppercase text-zinc-400 hover:text-pink-500 transition-colors">
              Mi Garaje
            </a>
            <a routerLink="/sobre-nosotros" routerLinkActive="text-pink-600"
              class="text-xs font-bold tracking-widest uppercase text-zinc-400 hover:text-pink-500 transition-colors">
              Sobre Nosotros
            </a>
            <a routerLink="/noticias" routerLinkActive="text-pink-600"
              class="text-xs font-bold tracking-widest uppercase text-zinc-400 hover:text-pink-500 transition-colors">
              Noticias
            </a>
          </div>

          <div class="flex items-center relative z-10">
            <a routerLink="/mi-perfil"
              class="flex items-center gap-3 bg-zinc-900/50 hover:bg-zinc-800 border border-white/5 hover:border-pink-600/50 px-5 py-2 rounded-full transition-all group cursor-pointer shadow-lg">
              <span class="text-xs font-bold uppercase tracking-widest text-white group-hover:text-pink-500 transition-colors">
                Perfil
              </span>
              <div class="bg-pink-600/20 p-1.5 rounded-full text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
            </a>
          </div>

        </div>
      </nav>
      
      <main class="flex-1 w-full">
        <router-outlet></router-outlet>
      </main>

      <footer class="bg-[#050505] border-t border-white/10 pt-20 pb-10 mt-auto">
        <div class="max-w-7xl mx-auto px-6">
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-center pb-16">
            
            <div class="flex flex-col items-center">
              <div class="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-pink-600 mb-6">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">DÓNDE ESTAMOS</h3>
              <p class="text-zinc-400 text-sm leading-relaxed">
                P.I. San Nicolás<br>
                C/8 N.º 20<br>
                Alcalá de Guadaíra
              </p>
            </div>

            <div class="flex flex-col items-center">
              <div class="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-pink-600 mb-6">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">HORARIO DE TALLER</h3>
              <p class="text-zinc-400 text-sm leading-relaxed">
                <span class="text-white font-bold">Lunes a Jueves:</span> 07:00 a 15:00<br>
                <span class="text-white font-bold">Viernes:</span> 07:00 a 14:00
              </p>
            </div>

            <div class="flex flex-col items-center">
              <div class="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-pink-600 mb-6">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.463-5.347-3.914-6.81-6.81l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">ATENCIÓN AL CLIENTE</h3>
              <p class="text-zinc-400 text-sm mb-2">Escribe o llama:</p>
              <a class="text-white font-black text-2xl tracking-widest">
                610 820 108
              </a>
            </div>

          </div>

          <div class="border-t border-white/5 pt-10 flex flex-col items-center">
            <h2 class="text-xs font-black tracking-widest uppercase mb-2">
              <span class="text-zinc-500">GARAGE</span><span class="text-pink-800">23</span><span class="text-zinc-500">AMG</span>
            </h2>
            <p class="text-[#555] text-[10px] tracking-[0.2em] uppercase">
              © 2026 GARAGE23AMG. TODOS LOS DERECHOS RESERVADOS.
            </p>
          </div>

        </div>
      </footer>

    </div>
  `
})
export class WebLayoutComponent { }