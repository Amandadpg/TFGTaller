import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicioService } from '../../../../core/services/servicio/servicio.service';
import { Servicio } from '../../../../core/models/servicio.model';
import { ToastService } from '../../../../core/services/toast/toast.service';

@Component({
  selector: 'app-admin-servicios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-8">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-bold flex items-center gap-3" style="color: #1a1a1a;">
          <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          Gestión de Servicios
        </h2>
        <button (click)="mostrarFormularioNuevo()" class="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-6 rounded-lg shadow-lg shadow-primary/20 transition-all">
          + Nuevo Servicio
        </button>
      </div>

      <!-- Formulario -->
      <div *ngIf="mostrarFormulario" class="bg-brand-anthracite rounded-2xl shadow-xl border border-gray-800 p-6 mb-8">
        <h3 class="text-xl font-bold text-white mb-4">{{ servicioEditando ? 'Editar Servicio' : 'Nuevo Servicio' }}</h3>
        <form [formGroup]="servicioForm" (ngSubmit)="guardarServicio()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div class="col-span-full md:col-span-2">
            <label class="block text-brand-muted text-sm mb-1">Nombre del Servicio</label>
            <input formControlName="nombreServicio" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-primary">
          </div>
          <div class="col-span-full">
            <label class="block text-brand-muted text-sm mb-1">Descripción</label>
            <textarea formControlName="descripcion" rows="3" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-primary resize-none"></textarea>
          </div>
          <div>
            <label class="block text-brand-muted text-sm mb-1">Precio (€)</label>
            <input formControlName="precio" type="number" step="0.01" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-primary">
          </div>
          <div>
            <label class="block text-brand-muted text-sm mb-1">Duración (minutos)</label>
            <input formControlName="duracionMinutos" type="number" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-primary">
          </div>
          <div class="col-span-full flex justify-end gap-3 mt-4">
            <button type="button" (click)="cancelarFormulario()" class="px-6 py-2 text-brand-light bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">Cancelar</button>
            <button type="submit" [disabled]="servicioForm.invalid" class="px-6 py-2 text-white bg-primary hover:bg-primary-hover rounded-lg shadow-lg shadow-primary/20 disabled:opacity-50">Guardar</button>
          </div>
        </form>
      </div>

      <!-- Grid de Servicios -->
      <div *ngIf="servicioService.isLoading()" class="text-center py-12 text-brand-muted">Cargando servicios...</div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div *ngFor="let s of servicioService.servicios()" class="bg-brand-anthracite rounded-2xl p-6 border border-gray-800 shadow-xl group">
          <div class="flex justify-between items-start mb-4">
            <div class="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-primary">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path></svg>
            </div>
            <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button (click)="editarServicio(s)" class="text-brand-muted hover:text-white"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
              <button (click)="eliminarServicio(s.id)" class="text-brand-muted hover:text-red-500"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
            </div>
          </div>
          <h4 class="text-xl font-bold text-white mb-2">{{ s.nombreServicio }}</h4>
          <p class="text-brand-muted text-sm mb-6">{{ s.descripcion }}</p>
          <div class="flex justify-between items-center pt-4 border-t border-gray-800">
            <div>
              <span class="block text-xs text-gray-500">Duración</span>
              <span class="text-white font-medium">{{ s.duracionMinutos }} min</span>
            </div>
            <div class="text-right">
              <span class="block text-xs text-gray-500">Precio</span>
              <span class="text-xl font-black text-primary">{{ s.precio }}€</span>
            </div>
          </div>
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

  servicioForm = this.fb.group({
    nombreServicio: ['', Validators.required],
    descripcion: ['', Validators.required],
    precio: [0, [Validators.required, Validators.min(0)]],
    duracionMinutos: [0, [Validators.required, Validators.min(1)]]
  });

  ngOnInit() {
    this.servicioService.cargarServicios();
  }

  mostrarFormularioNuevo() {
    this.servicioEditando = null;
    this.servicioForm.reset({ precio: 0, duracionMinutos: 30 });
    this.mostrarFormulario = true;
  }

  editarServicio(servicio: Servicio) {
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
          this.toastService.show('Servicio actualizado correctamente', 'success');
          this.servicioService.cargarServicios();
          this.cancelarFormulario();
        },
        error: () => this.toastService.show('Error al actualizar servicio', 'error')
      });
    } else {
      this.servicioService.crearServicio(data).subscribe({
        next: () => {
          this.toastService.show('Servicio creado correctamente', 'success');
          this.servicioService.cargarServicios();
          this.cancelarFormulario();
        },
        error: () => this.toastService.show('Error al crear servicio', 'error')
      });
    }
  }

  eliminarServicio(id: number) {
    if (confirm('¿Seguro que deseas eliminar este servicio? También se eliminarán las citas asociadas si las hay.')) {
      this.servicioService.eliminarServicio(id).subscribe({
        next: () => {
          this.toastService.show('Servicio eliminado', 'success');
          this.servicioService.cargarServicios();
        },
        error: () => this.toastService.show('Error al eliminar servicio', 'error')
      });
    }
  }
}
