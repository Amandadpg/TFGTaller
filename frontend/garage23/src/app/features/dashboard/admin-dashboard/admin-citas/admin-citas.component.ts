import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CitaService } from '../../../../core/services/cita/cita.service';
import { Cita } from '../../../../core/models/cita.model';
import { ToastService } from '../../../../core/services/toast/toast.service';

@Component({
  selector: 'app-admin-citas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-8">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          Gestión Global de Citas
        </h2>
      </div>

      <!-- Buscador -->
      <div class="mb-6 flex gap-4">
        <input type="text" #buscador placeholder="Buscar citas por nombre de usuario..." class="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 outline-none shadow-sm font-medium">
        <button (click)="buscarPorNombre(buscador.value)" class="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors border border-gray-700">Buscar</button>
        <button (click)="cargarCitas()" class="bg-gray-800 hover:bg-gray-700 text-brand-muted hover:text-white font-bold py-3 px-4 rounded-lg transition-colors border border-gray-700" title="Ver Todas">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        </button>
      </div>

      <!-- Modal Editar Estado / Info -->
      <div *ngIf="mostrarFormulario" class="bg-brand-anthracite rounded-2xl shadow-xl border border-gray-800 p-6 mb-8">
        <h3 class="text-xl font-bold text-white mb-4">Modificar Cita #{{ citaEditando?.id }}</h3>
        <form [formGroup]="citaForm" (ngSubmit)="guardarCita()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-brand-muted text-sm mb-1">Estado de la Cita</label>
            <select formControlName="estado" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-primary">
              <option value="PENDIENTE">Pendiente</option>
              <option value="COMPLETADA">Completada</option>
              <option value="CANCELADA">Cancelada</option>
            </select>
          </div>
          <div>
             <label class="block text-brand-muted text-sm mb-1">Fecha</label>
            <input formControlName="fecha" type="date" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-primary">
          </div>
          <div>
             <label class="block text-brand-muted text-sm mb-1">Hora</label>
            <input formControlName="hora" type="time" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-primary">
          </div>
          <div>
             <label class="block text-brand-muted text-sm mb-1">Servicio (Sólo Lectura en edicion Admin)</label>
            <input formControlName="nombreServicio" type="text" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-brand-muted uppercase" readonly>
          </div>
          <div class="col-span-full flex justify-end gap-3 mt-4">
            <button type="button" (click)="cancelarFormulario()" class="px-6 py-2 text-brand-light bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">Cancelar</button>
            <button type="submit" [disabled]="citaForm.invalid" class="px-6 py-2 text-white bg-primary hover:bg-primary-hover rounded-lg shadow-lg disabled:opacity-50">Guardar Cambios</button>
          </div>
        </form>
      </div>

      <!-- Tabla -->
      <div class="bg-brand-anthracite rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
        <table class="w-full text-left text-sm text-brand-light">
          <thead class="text-xs uppercase bg-gray-800 text-brand-muted border-b border-gray-700">
            <tr>
              <th class="px-6 py-4 font-medium">ID / Fecha</th>
              <th class="px-6 py-4 font-medium">Servicio</th>
              <th class="px-6 py-4 font-medium">Vehículo</th>
              <th class="px-6 py-4 font-medium">Usuario / Cliente</th>
              <th class="px-6 py-4 font-medium">Estado</th>
              <th class="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="isLoading" class="border-b border-gray-800">
              <td colspan="6" class="px-6 py-8 text-center text-brand-muted">Cargando citas...</td>
            </tr>
            <tr *ngIf="!isLoading && citas.length === 0" class="border-b border-gray-800">
              <td colspan="6" class="px-6 py-8 text-center text-brand-muted">No se encontraron citas.</td>
            </tr>
            <tr *ngFor="let c of citas" class="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
              <td class="px-6 py-4">
                <span class="block text-white font-medium">#{{ c.id }}</span>
                <span class="block text-brand-muted text-xs">{{ c.fecha | date:'mediumDate' }} {{ c.hora }}</span>
              </td>
              <td class="px-6 py-4 font-medium text-white">{{ c.nombreServicio }}</td>
              <td class="px-6 py-4 font-mono tracking-wider font-bold text-gray-300">{{ c.matriculaVehiculo }}</td>
              <td class="px-6 py-4 text-brand-muted">{{ c.nombreUsuario }}</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 rounded text-xs font-bold" 
                  [ngClass]="{
                    'bg-yellow-500/20 text-yellow-500': c.estado === 'PENDIENTE',
                    'bg-green-500/20 text-green-500': c.estado === 'COMPLETADA',
                    'bg-red-500/20 text-red-500': c.estado === 'CANCELADA'
                  }">
                  {{ c.estado }}
                </span>
              </td>
              <td class="px-6 py-4 text-right flex justify-end gap-2 items-center h-full">
                <button *ngIf="c.estado === 'PENDIENTE'" (click)="cambiarEstado(c.id, 'COMPLETADA')" class="p-2 text-brand-muted hover:text-green-500 hover:bg-green-500/10 rounded transition-colors" title="Marcar como Completada"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></button>
                <button *ngIf="c.estado === 'PENDIENTE'" (click)="cambiarEstado(c.id, 'CANCELADA')" class="p-2 text-brand-muted hover:text-red-500 hover:bg-red-500/10 rounded transition-colors" title="Cancelar"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                <button (click)="editarCita(c)" class="p-2 text-brand-muted hover:text-white hover:bg-gray-700 rounded transition-colors ml-2" title="Editar Detalles"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                <button (click)="eliminarCita(c.id)" class="p-2 text-brand-muted hover:text-red-500 hover:bg-red-500/10 rounded transition-colors" title="Eliminar del sistema"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminCitasComponent implements OnInit {
  private fb = inject(FormBuilder);
  private citaService = inject(CitaService);
  private toastService = inject(ToastService);

  citas: Cita[] = [];
  isLoading = true;
  mostrarFormulario = false;
  citaEditando: Cita | null = null;

  citaForm = this.fb.group({
    fecha: ['', Validators.required],
    hora: ['', Validators.required],
    estado: ['PENDIENTE', Validators.required],
    matriculaVehiculo: [{ value: '', disabled: true }, Validators.required], // We don't alter vehicule via Citas update
    nombreServicio: [{ value: '', disabled: true }, Validators.required] // Only show
  });

  ngOnInit() {
    this.cargarCitas();
  }

  cargarCitas() {
    this.isLoading = true;
    this.citaService.obtenerTodas().subscribe({
      next: (data) => {
        this.citas = data;
        this.isLoading = false;
      },
      error: () => {
        this.toastService.show('Error al cargar la lista de citas', 'error');
        this.isLoading = false;
      }
    });
  }

  buscarPorNombre(nombre: string) {
    if (!nombre) {
      this.cargarCitas();
      return;
    }
    this.isLoading = true;
    this.citaService.buscarPorNombre(nombre).subscribe({
      next: (data) => {
        this.citas = data;
        this.isLoading = false;
      },
      error: () => {
        this.toastService.show('Error al buscar citas', 'error');
        this.isLoading = false;
      }
    });
  }

  cambiarEstado(id: number, nuevoEstado: string) {
    this.citaService.cambiarEstado(id, nuevoEstado).subscribe({
      next: () => {
        this.toastService.show('Estado de la cita actualizado', 'success');
        this.cargarCitas();
      },
      error: () => this.toastService.show('Error al cambiar el estado', 'error')
    });
  }

  editarCita(cita: Cita) {
    this.citaEditando = cita;
    this.citaForm.patchValue({
      fecha: cita.fecha,
      hora: cita.hora,
      estado: cita.estado,
      matriculaVehiculo: cita.matriculaVehiculo,
      nombreServicio: cita.nombreServicio
    });
    this.mostrarFormulario = true;
    window.scrollTo(0, 0);
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
    this.citaEditando = null;
  }

  guardarCita() {
    if (this.citaForm.invalid || !this.citaEditando) return;
    const formVals = this.citaForm.getRawValue();
    const data = {
      fecha: formVals.fecha,
      hora: formVals.hora,
      matriculaVehiculo: formVals.matriculaVehiculo,
      nombreServicio: formVals.nombreServicio
    };

    // Primero si cambia estado
    if (formVals.estado !== this.citaEditando.estado) {
      this.citaService.cambiarEstado(this.citaEditando.id, formVals.estado!).subscribe({
        next: () => this.ejecutarModificacionAdmin(data)
      });
    } else {
      this.ejecutarModificacionAdmin(data);
    }
  }

  ejecutarModificacionAdmin(data: any) {
    this.citaService.modificarAdmin(this.citaEditando!.id, data).subscribe({
      next: () => {
        this.toastService.show('Cita actualizada correctamente', 'success');
        this.cargarCitas();
        this.cancelarFormulario();
      },
      error: () => this.toastService.show('Error al actualizar los detalles de la cita', 'error')
    });
  }

  eliminarCita(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar permanentemente esta cita del sistema?')) {
      this.citaService.eliminarCita(id).subscribe({
        next: () => {
          this.toastService.show('Cita eliminada correctamente', 'success');
          this.cargarCitas();
        },
        error: () => this.toastService.show('Error al eliminar la cita', 'error')
      });
    }
  }
}
