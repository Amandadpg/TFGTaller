import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicioService } from '../../../../core/services/servicio/servicio.service';
import { Servicio } from '../../../../core/models/servicio.model';
import { ToastService } from '../../../../core/services/toast/toast.service';

@Component({
  selector: 'app-admin-servicios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-8">
      
      <!-- ========================================== -->
      <!-- CABECERA Y BUSCADOR REACTIVO               -->
      <!-- ========================================== -->
      <div class="mb-8 flex flex-col gap-6">
        
        <!-- Fila 1: Título y Botón Principal -->
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <span class="text-pink-500">🛠️</span> Gestión de Servicios
          </h1>
          <button (click)="mostrarFormularioNuevo()" class="bg-pink-600 hover:bg-pink-500 text-white font-bold py-2.5 px-6 rounded-lg shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all uppercase tracking-widest text-sm">
            + Nuevo Servicio
          </button>
        </div>

        <!-- Fila 2: Buscador -->
        <div class="flex gap-3 h-[50px]">
          <!-- Input principal (Busca automáticamente al escribir) -->
          <input 
            type="text" 
            [value]="textoBusqueda"
            (input)="actualizarBusqueda($event)"
            placeholder="Buscar servicio por nombre..." 
            class="flex-1 bg-[#111] border border-gray-800 rounded-lg px-5 text-white outline-none focus:border-pink-500 transition-all text-base placeholder:text-gray-500"
          >
          
          <!-- Botón RECARGAR / LIMPIAR -->
          <button (click)="limpiarBusqueda()" class="bg-[#1e2330] hover:bg-[#2a3142] text-gray-400 hover:text-white w-[50px] rounded-lg transition-all border border-gray-700/50 flex items-center justify-center shrink-0 shadow-lg" title="Limpiar búsqueda">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          </button>
        </div>

      </div>
      <!-- ========================================== -->

      <!-- FORMULARIO -->
      <div *ngIf="mostrarFormulario" class="bg-[#111] rounded-2xl border border-gray-800 border-t-4 border-t-pink-500 p-6 mb-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <h3 class="text-xl font-bold text-white mb-6 uppercase tracking-widest">
          {{ servicioEditando ? 'Editar Servicio' : 'Añadir Nuevo Servicio' }}
        </h3>
        
        <form [formGroup]="servicioForm" (ngSubmit)="guardarServicio()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="md:col-span-2">
            <label class="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Nombre del Servicio</label>
            <input formControlName="nombreServicio" class="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500 transition-all h-[50px]">
          </div>
          
          <div>
            <label class="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Precio (€)</label>
            <input formControlName="precio" type="number" step="0.01" class="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500 transition-all h-[50px]">
          </div>

          <div>
            <label class="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Duración (min)</label>
            <input formControlName="duracionMinutos" type="number" class="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500 transition-all h-[50px]">
          </div>

          <div class="col-span-full">
            <label class="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Descripción</label>
            <textarea formControlName="descripcion" rows="2" class="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500 resize-none transition-all"></textarea>
          </div>

          <div class="col-span-full flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button type="button" (click)="cancelarFormulario()" class="px-6 py-3 text-gray-400 font-bold uppercase text-xs tracking-widest bg-gray-800 hover:bg-gray-700 rounded-lg transition-all">Cancelar</button>
            <button type="submit" [disabled]="servicioForm.invalid" class="px-8 py-3 text-white font-bold uppercase text-xs tracking-widest bg-pink-600 hover:bg-pink-500 rounded-lg shadow-lg shadow-pink-500/20 disabled:opacity-30">Guardar Servicio</button>
          </div>
        </form>
      </div>

      <!-- LOADING -->
      <div *ngIf="servicioService.isLoading()" class="flex justify-center py-10">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-pink-500"></div>
      </div>

      <!-- TABLA DE SERVICIOS -->
      <div *ngIf="!servicioService.isLoading()" class="bg-[#111] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
        <table class="w-full text-left text-sm text-gray-300 border-collapse">
          <thead class="text-xs uppercase bg-gray-900/50 text-gray-400 border-b border-gray-800 tracking-widest">
            <tr>
              <th class="px-6 py-5 font-bold">Servicio</th>
              <th class="px-6 py-5 font-bold">Descripción</th>
              <th class="px-6 py-5 text-center font-bold">Duración</th>
              <th class="px-6 py-5 text-center font-bold">Precio</th>
              <th class="px-6 py-5 text-right pr-14 font-bold w-48">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800/40">
            @for (s of serviciosFiltrados; track s.id) {
              <tr class="hover:bg-gray-800/20 transition-colors group">
                <td class="px-6 py-4">
                  <div class="text-white font-bold uppercase tracking-tight">{{ s.nombreServicio }}</div>
                </td>
                <td class="px-6 py-4 italic text-gray-400">
                  <div class="line-clamp-1 max-w-sm" [title]="s.descripcion">{{ s.descripcion }}</div>
                </td>
                <td class="px-6 py-4 text-center">
                  <span class="bg-gray-800/50 text-gray-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border border-gray-700">
                    ⏱ {{ s.duracionMinutos }} min
                  </span>
                </td>
                <td class="px-6 py-4 text-center">
                  <div class="text-pink-500 font-black text-base">{{ s.precio }} €</div>
                </td>
                <td class="px-6 py-4 text-right pr-10">
                  <div class="flex justify-end items-center gap-2">
                    <!-- Icono de editar ahora con hover rosa -->
                    <button (click)="editarServicio(s)" class="p-2 text-gray-400 hover:text-pink-500 transition-colors" title="Editar">✏️</button>
                    <!-- Icono de eliminar en rojo de alerta -->
                    <button (click)="eliminarServicio(s.id!)" class="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Eliminar">🗑️</button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>

        <!-- MENSAJE SI LA TABLA ESTÁ VACÍA -->
        <div *ngIf="serviciosFiltrados.length === 0" class="text-center py-12">
          <p class="text-gray-500 uppercase tracking-widest font-black text-xs">No se han encontrado servicios</p>
        </div>
      </div>
    </div>
  `
})
export class AdminServiciosComponent implements OnInit {
  private fb = inject(FormBuilder);
  servicioService = inject(ServicioService);
  private toastService = inject(ToastService);

  mostrarFormulario = false;
  servicioEditando: Servicio | null = null;

  // Variables para el buscador
  serviciosFiltrados: Servicio[] = [];
  textoBusqueda: string = '';

  servicioForm = this.fb.group({
    nombreServicio: ['', Validators.required],
    descripcion: ['', Validators.required],
    precio: [0, [Validators.required, Validators.min(0)]],
    duracionMinutos: [0, [Validators.required, Validators.min(1)]]
  });

  ngOnInit() {
    this.cargarYFiltrar();
  }

  cargarYFiltrar() {
    this.servicioService.cargarServicios();
    setTimeout(() => {
      this.serviciosFiltrados = this.servicioService.servicios();
      this.ejecutarBusqueda();
    }, 500);
  }

  // --- LÓGICA DEL BUSCADOR ---
  actualizarBusqueda(event: any) {
    this.textoBusqueda = event.target.value;
    this.ejecutarBusqueda();
  }

  ejecutarBusqueda() {
    const query = this.textoBusqueda.toLowerCase();
    this.serviciosFiltrados = this.servicioService.servicios().filter(s =>
      s.nombreServicio.toLowerCase().includes(query)
    );
  }

  limpiarBusqueda() {
    this.textoBusqueda = '';
    this.serviciosFiltrados = this.servicioService.servicios();
  }
  // ---------------------------

  mostrarFormularioNuevo() {
    this.subir();
    this.servicioEditando = null;
    this.servicioForm.reset({ precio: 0, duracionMinutos: 30 });
    this.mostrarFormulario = true;
  }

  editarServicio(servicio: Servicio) {
    this.subir();
    this.servicioEditando = servicio;
    this.servicioForm.patchValue({
      nombreServicio: servicio.nombreServicio,
      descripcion: servicio.descripcion,
      precio: servicio.precio,
      duracionMinutos: servicio.duracionMinutos
    });
    this.mostrarFormulario = true;
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
    this.servicioEditando = null;
  }

  guardarServicio() {
    if (this.servicioForm.invalid) return;
    const data = this.servicioForm.value as Partial<Servicio>;

    if (this.servicioEditando) {
      this.servicioService.actualizarServicio(this.servicioEditando.id!, data).subscribe({
        next: () => {
          this.toastService.show('Servicio actualizado con éxito', 'success');
          this.servicioService.cargarServicios();
          this.cargarYFiltrar();
          this.cancelarFormulario();
        }
      });
    } else {
      this.servicioService.crearServicio(data).subscribe({
        next: () => {
          this.toastService.show('Servicio añadido al catálogo', 'success');
          this.servicioService.cargarServicios();
          this.cargarYFiltrar();
          this.cancelarFormulario();
        }
      });
    }
  }

  eliminarServicio(id: number) {
    if (confirm('¿Deseas eliminar este servicio?')) {
      this.servicioService.eliminarServicio(id).subscribe({
        next: () => {
          this.toastService.show('Servicio eliminado', 'success');
          this.servicioService.cargarServicios();
          this.cargarYFiltrar();
        },
        error: (err) => {
          if (err.status === 200) {
            this.toastService.show('Servicio eliminado', 'success');
            this.servicioService.cargarServicios();
            this.cargarYFiltrar();
          }
        }
      });
    }
  }

  private subir() {
    document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
  }
}