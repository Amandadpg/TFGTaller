import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// IMPORTS AJUSTADOS A TU CARPETA ACTUAL (3 niveles)
import { VehiculoService } from '../../../core/services/vehiculo/vehiculo.service';
import { Vehiculo } from '../../../core/models/vehiculo.model';
import { ToastService } from '../../../core/services/toast/toast.service';
import { UsuarioService } from '../../../core/services/usuario/usuario.service';
import { Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-admin-vehiculos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-8">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
          Gestión de Todos los Vehículos
        </h2>
        <button (click)="mostrarFormularioNuevo()" class="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-6 rounded-lg shadow-lg shadow-primary/20 transition-all">
          + Nuevo Vehículo Global
        </button>
      </div>
      
      <div *ngIf="mostrarFormulario" class="bg-brand-anthracite rounded-2xl shadow-xl border border-gray-800 p-6 mb-8">
        <h3 class="text-xl font-bold text-white mb-4">{{ vehiculoEditando ? 'Editar Vehículo' : 'Añadir Vehículo al Taller' }}</h3>
        <form [formGroup]="vehiculoForm" (ngSubmit)="guardarVehiculo()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          
          <div class="lg:col-span-2">
            <label class="block text-brand-muted text-sm mb-1">Propietario del Vehículo</label>
            <select formControlName="dniCliente" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-primary cursor-pointer">
              <option value="" disabled selected>-- Selecciona el cliente --</option>
              <option *ngFor="let u of usuarios" [value]="u.dni">
                {{ u.nombre }} {{ u.apellidos }} (DNI: {{ u.dni }})
              </option>
            </select>
          </div>

          <div class="col-span-full flex justify-end gap-3 mt-4">
            <button type="button" (click)="cancelarFormulario()" class="px-6 py-2 text-brand-light bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">Cancelar</button>
            <button type="submit" class="px-6 py-2 text-white bg-primary hover:bg-primary-hover rounded-lg shadow-lg disabled:opacity-50 transition-all">Guardar</button>
          </div>
        </form>
      </div>

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
            <tr *ngFor="let v of vehiculos" class="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
              <td class="px-6 py-4 font-mono tracking-wider font-bold text-white"><span class="bg-gray-800 px-2 py-1 rounded border border-gray-700">{{ v.matricula }}</span></td>
              <td class="px-6 py-4">{{ v.marca }}</td>
              <td class="px-6 py-4">{{ v.modelo }}</td>
              <td class="px-6 py-4">
                <span class="text-xs font-bold px-2 py-1 bg-gray-700 rounded text-brand-light">{{ v.tipo }}</span>
              </td>
              <td class="px-6 py-4 text-right flex justify-end gap-2">
                <button (click)="editarVehiculo(v)" class="p-2 text-brand-muted hover:text-white hover:bg-gray-700 rounded transition-colors" title="Editar">✏️</button>
                <button (click)="eliminarVehiculo(v.id)" class="p-2 text-brand-muted hover:text-red-500 hover:bg-red-500/10 rounded transition-colors" title="Eliminar">🗑️</button>
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
  private usuarioService = inject(UsuarioService);
  private toastService = inject(ToastService);

  vehiculos: Vehiculo[] = [];
  usuarios: Usuario[] = [];

  isLoading = true;
  mostrarFormulario = false;
  vehiculoEditando: Vehiculo | null = null;

  vehiculoForm = this.fb.group({
    matricula: ['', Validators.required],
    marca: ['', Validators.required],
    modelo: ['', Validators.required],
    tipo: ['COCHE', Validators.required],
    dniCliente: ['', Validators.required]
  });

  ngOnInit() {
    this.cargarVehiculos();
    this.cargarUsuarios();
  }

  cargarVehiculos() {
    this.isLoading = true;
    this.vehiculoService.listarTodosVehiculos().subscribe({
      next: (data: any) => {
        this.vehiculos = data;
        this.isLoading = false;
      },
      error: () => {
        this.toastService.show('Error al cargar la lista de vehículos', 'error');
        this.isLoading = false;
      }
    });
  }

  cargarUsuarios() {
    this.usuarioService.obtenerTodosUsuarios().subscribe({
      next: (data: any) => {
        this.usuarios = data.filter((u: Usuario) => u.rol === 'CLIENTE');
      },
      error: () => console.error('No se pudieron cargar los usuarios')
    });
  }

  mostrarFormularioNuevo() {
    this.vehiculoEditando = null;
    this.vehiculoForm.reset({ tipo: 'COCHE', dniCliente: '' });
    this.mostrarFormulario = true;
  }

  editarVehiculo(vehiculo: Vehiculo) {
    this.vehiculoEditando = vehiculo;
    this.vehiculoForm.patchValue({
      matricula: vehiculo.matricula,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      tipo: vehiculo.tipo,
      dniCliente: ''
    });
    this.mostrarFormulario = true;
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
    this.vehiculoEditando = null;
  }


  guardarVehiculo() {
    if (this.vehiculoForm.invalid) return;

    const data = {
      matricula: this.vehiculoForm.value.matricula?.toUpperCase().trim(),
      marca: this.vehiculoForm.value.marca?.trim(),
      modelo: this.vehiculoForm.value.modelo?.trim(),
      tipo: this.vehiculoForm.value.tipo, // Asegúrate que sea COCHE, MOTO, etc.
      dniCliente: this.vehiculoForm.value.dniCliente
    };

    console.log("📦 Cuerpo del mensaje (JSON) que estamos enviando:", data);

    this.vehiculoService.darAltaVehiculo(data).subscribe({
      next: (res) => {
        this.toastService.show('Vehículo añadido con éxito', 'success');
        this.cargarVehiculos();
        this.cancelarFormulario();
      },
      error: (err) => {
        // ESTO ES LO MÁS IMPORTANTE:
        console.log("❌ ERROR COMPLETO DEL SERVIDOR:", err);

        if (err.status === 400) {
          // Buscamos si el backend envió detalles de qué campo falla
          const validacion = err.error?.errors;
          if (validacion) {
            console.table(validacion); // Te sacará una tabla con los campos que fallan
          }
          this.toastService.show('El servidor rechaza los datos (Error 400)', 'error');
        } else {
          this.toastService.show('Error al añadir el vehículo', 'error');
        }
      }
    });
  }

  eliminarVehiculo(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este vehículo?')) {
      this.vehiculoService.eliminarVehiculo(id).subscribe({
        next: (data: any) => {
          this.toastService.show('Vehículo eliminado', 'success');
          this.cargarVehiculos();
        },
        error: (err: any) => {
          const msg = err.error?.message || 'Error al eliminar el vehículo';
          this.toastService.show(msg, 'error');
        }
      });
    }
  }
}