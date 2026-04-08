import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehiculoService } from '../../../../core/services/vehiculo/vehiculo.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Vehiculo } from '../../../../core/models/vehiculo.model';
import { ToastService } from '../../../../core/services/toast/toast.service';

@Component({
  selector: 'app-mis-vehiculos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-8">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-bold text-brand-light flex items-center gap-3">
          <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
          Mis Vehículos
        </h2>
        <button (click)="mostrarFormularioNuevo()" class="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-6 rounded-lg shadow-lg shadow-primary/20 transition-all">
          + Añadir Vehículo
        </button>
      </div>

      <!-- Formulario Modal/Inline -->
      <div *ngIf="mostrarFormulario" class="bg-brand-anthracite rounded-2xl shadow-xl border border-gray-800 p-6 mb-8">
        <h3 class="text-xl font-bold text-white mb-4">{{ vehiculoEditando ? 'Editar Vehículo' : 'Nuevo Vehículo' }}</h3>
        <form [formGroup]="vehiculoForm" (ngSubmit)="guardarVehiculo()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-brand-muted text-sm mb-1">Matrícula</label>
            <input formControlName="matricula" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none uppercase">
          </div>
          <div>
            <label class="block text-brand-muted text-sm mb-1">Marca</label>
            <input formControlName="marca" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none">
          </div>
          <div>
            <label class="block text-brand-muted text-sm mb-1">Modelo</label>
            <input formControlName="modelo" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none">
          </div>
          <div>
            <label class="block text-brand-muted text-sm mb-1">Tipo</label>
            <select formControlName="tipo" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none">
              <option value="COCHE">Coche</option>
              <option value="MOTO">Moto</option>
              <option value="CAMION">Camión</option>
              <option value="OTROS">Otros</option>
            </select>
          </div>
          <div class="col-span-full flex justify-end gap-3 mt-4">
            <button type="button" (click)="cancelarFormulario()" class="px-6 py-2 text-brand-light bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">Cancelar</button>
            <button type="submit" [disabled]="vehiculoForm.invalid" class="px-6 py-2 text-white bg-primary hover:bg-primary-hover rounded-lg shadow-lg disabled:opacity-50">Guardar</button>
          </div>
        </form>
      </div>

      <!-- Lista de Vehículos -->
      <div *ngIf="isLoading" class="text-center py-12 text-brand-muted">Cargando vehículos...</div>
      
      <div *ngIf="!isLoading && vehiculos.length === 0" class="text-center py-12 bg-brand-anthracite rounded-2xl border border-gray-800 border-dashed">
        <p class="text-brand-muted">Aún no tienes vehículos registrados.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let vehiculo of vehiculos" class="bg-brand-anthracite rounded-2xl p-6 border border-gray-800 shadow-xl hover:border-primary/50 transition-colors group">
          <div class="flex justify-between items-start mb-4">
            <div class="bg-gray-800 px-3 py-1 rounded border border-gray-700 text-white font-mono tracking-widest">{{ vehiculo.matricula }}</div>
            <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button (click)="editarVehiculo(vehiculo)" class="text-brand-muted hover:text-white"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
              <button (click)="eliminarVehiculo(vehiculo.id)" class="text-brand-muted hover:text-red-500"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
            </div>
          </div>
          <h4 class="text-xl font-bold text-white mb-1">{{ vehiculo.marca }} {{ vehiculo.modelo }}</h4>
          <p class="text-brand-muted text-sm capitalize flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-primary block"></span> {{ vehiculo.tipo | lowercase }}
          </p>
        </div>
      </div>
    </div>
  `
})
export class MisVehiculosComponent implements OnInit {
  private vehiculoService = inject(VehiculoService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  vehiculos: Vehiculo[] = [];
  isLoading = true;
  mostrarFormulario = false;
  vehiculoEditando: Vehiculo | null = null;
  usuarioId!: number;

  vehiculoForm = this.fb.group({
    matricula: ['', Validators.required],
    marca: ['', Validators.required],
    modelo: ['', Validators.required],
    tipo: ['COCHE', Validators.required]
  });

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.usuarioId = user.id;
      this.cargarVehiculos();
    }
  }

  cargarVehiculos() {
    this.isLoading = true;
    this.vehiculoService.listarVehiculosPorUsuario(this.usuarioId).subscribe({
      next: (data) => {
        this.vehiculos = data;
        this.isLoading = false;
      },
      error: () => {
        this.toastService.show('Error al cargar vehículos', 'error');
        this.isLoading = false;
      }
    });
  }

  mostrarFormularioNuevo() {
    this.vehiculoEditando = null;
    this.vehiculoForm.reset({ tipo: 'COCHE' });
    this.mostrarFormulario = true;
  }

  editarVehiculo(vehiculo: Vehiculo) {
    this.vehiculoEditando = vehiculo;
    this.vehiculoForm.patchValue({
      matricula: vehiculo.matricula,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      tipo: vehiculo.tipo
    });
    this.mostrarFormulario = true;
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
    this.vehiculoEditando = null;
  }

  guardarVehiculo() {
    if (this.vehiculoForm.invalid) return;

    const data = { ...this.vehiculoForm.value, usuarioId: this.usuarioId };

    if (this.vehiculoEditando) {
      this.vehiculoService.modificarVehiculo(this.vehiculoEditando.id, data).subscribe({
        next: () => {
          this.toastService.show('Vehículo actualizado', 'success');
          this.cargarVehiculos();
          this.cancelarFormulario();
        },
        error: () => this.toastService.show('Error al actualizar el vehículo', 'error')
      });
    } else {
      this.vehiculoService.darAltaVehiculo(data).subscribe({
        next: () => {
          this.toastService.show('Vehículo añadido', 'success');
          this.cargarVehiculos();
          this.cancelarFormulario();
        },
        error: () => this.toastService.show('Error al añadir el vehículo', 'error')
      });
    }
  }

  eliminarVehiculo(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este vehículo?')) {
      this.vehiculoService.eliminarVehiculo(id).subscribe({
        next: () => {
          this.toastService.show('Vehículo eliminado', 'success');
          this.cargarVehiculos();
        },
        error: () => this.toastService.show('Error al eliminar vehículo', 'error')
      });
    }
  }
}
