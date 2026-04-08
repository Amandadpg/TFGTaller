import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehiculoService } from '../../../../core/services/vehiculo/vehiculo.service';
import { Vehiculo } from '../../../../core/models/vehiculo.model';
import { ToastService } from '../../../../core/services/toast/toast.service';

@Component({
  selector: 'app-admin-vehiculos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-8">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-bold text-brand-light flex items-center gap-3">
          <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
          Gestión de Todos los Vehículos
        </h2>
        <button (click)="mostrarFormularioNuevo()" class="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-6 rounded-lg shadow-lg shadow-primary/20 transition-all">
          + Nuevo Vehículo Global
        </button>
      </div>

      <!-- Buscador -->
      <div class="mb-6 flex gap-4">
        <input type="text" #buscadorMatricula placeholder="Buscar por matrícula..." class="flex-1 bg-brand-anthracite border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 outline-none uppercase">
        <button (click)="buscarPorMatricula(buscadorMatricula.value)" class="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors border border-gray-700">Buscar</button>
        <button (click)="cargarVehiculos()" class="bg-gray-800 hover:bg-gray-700 text-brand-muted hover:text-white font-bold py-3 px-4 rounded-lg transition-colors border border-gray-700" title="Ver Todos">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        </button>
      </div>

      <!-- Formulario -->
      <div *ngIf="mostrarFormulario" class="bg-brand-anthracite rounded-2xl shadow-xl border border-gray-800 p-6 mb-8">
        <h3 class="text-xl font-bold text-white mb-4">{{ vehiculoEditando ? 'Editar Vehículo' : 'Añadir Vehículo (Sin vincular a usuario)' }}</h3>
        <form [formGroup]="vehiculoForm" (ngSubmit)="guardarVehiculo()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-brand-muted text-sm mb-1">Matrícula</label>
            <input formControlName="matricula" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-primary uppercase">
          </div>
          <div>
            <label class="block text-brand-muted text-sm mb-1">Marca</label>
            <input formControlName="marca" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-primary">
          </div>
          <div>
            <label class="block text-brand-muted text-sm mb-1">Modelo</label>
            <input formControlName="modelo" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-primary">
          </div>
          <div>
            <label class="block text-brand-muted text-sm mb-1">Tipo</label>
            <select formControlName="tipo" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-primary">
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

      <!-- Tabla -->
      <div class="bg-brand-anthracite rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
        <table class="w-full text-left text-sm text-brand-light">
          <thead class="text-xs uppercase bg-gray-800 text-brand-muted border-b border-gray-700">
            <tr>
              <th class="px-6 py-4 font-medium">Matrícula</th>
              <th class="px-6 py-4 font-medium">Marca</th>
              <th class="px-6 py-4 font-medium">Modelo</th>
              <th class="px-6 py-4 font-medium">Tipo</th>
              <th class="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="isLoading" class="border-b border-gray-800">
              <td colspan="5" class="px-6 py-8 text-center text-brand-muted">Cargando vehículos...</td>
            </tr>
            <tr *ngIf="!isLoading && vehiculos.length === 0" class="border-b border-gray-800">
              <td colspan="5" class="px-6 py-8 text-center text-brand-muted">No se encontraron vehículos.</td>
            </tr>
            <tr *ngFor="let v of vehiculos" class="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
              <td class="px-6 py-4 font-mono tracking-wider font-bold text-white"><span class="bg-gray-800 px-2 py-1 rounded border border-gray-700">{{ v.matricula }}</span></td>
              <td class="px-6 py-4">{{ v.marca }}</td>
              <td class="px-6 py-4">{{ v.modelo }}</td>
              <td class="px-6 py-4">
                <span class="text-xs font-bold px-2 py-1 bg-gray-700 rounded text-brand-light">{{ v.tipo }}</span>
              </td>
              <td class="px-6 py-4 text-right flex justify-end gap-2">
                <button (click)="editarVehiculo(v)" class="p-2 text-brand-muted hover:text-white hover:bg-gray-700 rounded transition-colors" title="Editar"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                <button (click)="eliminarVehiculo(v.id)" class="p-2 text-brand-muted hover:text-red-500 hover:bg-red-500/10 rounded transition-colors" title="Eliminar"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminVehiculosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private vehiculoService = inject(VehiculoService);
  private toastService = inject(ToastService);

  vehiculos: Vehiculo[] = [];
  isLoading = true;
  mostrarFormulario = false;
  vehiculoEditando: Vehiculo | null = null;

  vehiculoForm = this.fb.group({
    matricula: ['', Validators.required],
    marca: ['', Validators.required],
    modelo: ['', Validators.required],
    tipo: ['COCHE', Validators.required]
  });

  ngOnInit() {
    this.cargarVehiculos();
  }

  cargarVehiculos() {
    this.isLoading = true;
    this.vehiculoService.listarTodosVehiculos().subscribe({
      next: (data) => {
        this.vehiculos = data;
        this.isLoading = false;
      },
      error: () => {
        this.toastService.show('Error al cargar la lista de vehículos', 'error');
        this.isLoading = false;
      }
    });
  }

  buscarPorMatricula(mat: string) {
    if (!mat) {
      this.cargarVehiculos();
      return;
    }
    this.isLoading = true;
    this.vehiculoService.buscarVehiculosPorMatricula(mat).subscribe({
      next: (data) => {
        this.vehiculos = data;
        this.isLoading = false;
      },
      error: () => {
        this.toastService.show('Error en búsqueda', 'error');
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
    const data = this.vehiculoForm.value;

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
    if (confirm('¿Estás seguro de que deseas eliminar este vehículo en todo el sistema?')) {
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
