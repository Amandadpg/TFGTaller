import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServicioService } from '../../../../core/services/servicio/servicio.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-8">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-black text-white mb-4 tracking-wide uppercase">Catálogo de Servicios</h2>
        <p class="text-brand-muted text-lg max-w-2xl mx-auto">Selecciona uno de nuestros servicios especializados para tu vehículo. Te garantizamos la máxima calidad y profesionalidad.</p>
      </div>

      <div *ngIf="servicioService.isLoading()" class="flex justify-center my-12">
        <span class="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin block"></span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <div *ngFor="let servicio of servicioService.servicios()" class="bg-brand-anthracite rounded-3xl p-8 border border-gray-800 shadow-xl flex flex-col items-start relative overflow-hidden group hover:-translate-y-2 transition-all duration-300">
          <div class="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          
          <div class="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-inner border border-gray-700">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          
          <h3 class="text-2xl font-bold text-white mb-3">{{ servicio.nombreServicio }}</h3>
          <p class="text-brand-muted mb-8 flex-1 leading-relaxed">{{ servicio.descripcion }}</p>
          
          <div class="w-full flex items-end justify-between mt-auto pt-6 border-t border-gray-800/50">
            <div>
              <span class="block text-sm text-brand-muted mb-1">Precio estimado</span>
              <span class="text-3xl font-black text-white">{{ servicio.precio }}€</span>
            </div>
            
            <button (click)="contratar(servicio.id)" class="bg-white/5 hover:bg-primary border border-gray-700 hover:border-primary text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2 group/btn">
              Contratar
              <svg class="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CatalogoComponent implements OnInit {
  servicioService = inject(ServicioService);
  private router = inject(Router);

  ngOnInit() {
    this.servicioService.cargarServicios();
  }

  contratar(servicioId: number) {
    this.router.navigate(['/reservar'], { queryParams: { servicioId } });
  }
}
