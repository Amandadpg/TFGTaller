import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehiculoService } from '../../../../core/services/vehiculo/vehiculo.service';
import { UsuarioService } from '../../../../core/services/usuario/usuario.service';
import { ToastService } from '../../../../core/services/toast/toast.service';

@Component({
  selector: 'app-admin-vehiculos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-8">
      
      <!-- CABECERA -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
          <span class="text-pink-500">🚗</span> Gestión de Vehículos
        </h1>
        <button (click)="mostrarFormularioNuevo()" class="bg-pink-600 hover:bg-pink-500 text-white font-bold py-2.5 px-6 rounded-lg shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all uppercase tracking-widest text-sm">
          + Nuevo Vehículo
        </button>
      </div>

      <!-- BUSCADOR REACTIVO EN TIEMPO REAL -->
      <div class="mb-8 flex gap-4 h-[50px]">
        <input 
          type="text" 
          [value]="textoBusquedaVehiculo"
          (input)="filtrarDatosAlMomento($event)" 
          placeholder="🔍 Buscar por matrícula, marca o modelo..." 
          class="flex-1 bg-[#111] border border-gray-800 rounded-lg px-5 text-white outline-none focus:border-pink-500 transition-all text-base placeholder:text-gray-500"
        >
        <!-- BOTÓN LIMPIAR / RECARGAR -->
        <button (click)="limpiarBusquedaVehiculos()" class="bg-[#1e2330] hover:bg-[#2a3142] text-gray-400 hover:text-white w-[50px] rounded-lg transition-all border border-gray-700/50 flex items-center justify-center shrink-0 shadow-lg" title="Limpiar y recargar">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        </button>
      </div>

      <!-- FORMULARIO -->
      <div *ngIf="mostrarFormulario" class="bg-[#111] rounded-2xl shadow-xl border border-gray-800 border-t-4 border-t-pink-500 p-6 mb-8 animate-in fade-in zoom-in duration-300">
        <h3 class="text-xl font-bold text-white mb-6 uppercase tracking-widest">{{ vehiculoEditando ? 'Editar Vehículo' : 'Añadir Vehículo al Taller' }}</h3>
        
        <form [formGroup]="vehiculoForm" (ngSubmit)="guardarVehiculo()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label class="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Matrícula</label>
            <input formControlName="matricula" class="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500 uppercase transition-all h-[50px]">
          </div>
          <div>
            <label class="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Marca</label>
            <input formControlName="marca" class="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500 transition-all h-[50px]">
          </div>
          <div>
            <label class="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Modelo</label>
            <input formControlName="modelo" class="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500 transition-all h-[50px]">
          </div>
          
          <!-- BUSCADOR DE PROPIETARIO DENTRO DEL FORMULARIO -->
          <div class="relative lg:col-span-1">
            <label class="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Propietario</label>
            <div class="relative">
              <input 
                type="text" 
                [value]="obtenerTextoBuscador()"
                (input)="filtrarUsuariosDropdown($event)"
                (focus)="mostrarDropdownUsuarios = true"
                (blur)="ocultarDropdownUsuarios()"
                placeholder="🔍 Buscar cliente..." 
                class="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500 transition-colors h-[50px]"
                [ngClass]="{'border-pink-500 bg-pink-900/10 text-pink-100': vehiculoForm.get('dniCliente')?.value}"
              >
              
              <div *ngIf="mostrarDropdownUsuarios" class="absolute z-50 w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl max-h-48 overflow-y-auto">
                @for (u of usuariosFiltrados; track u.id) {
                  <div (mousedown)="seleccionarUsuarioParaFormulario(u)" class="px-4 py-3 hover:bg-pink-600 hover:text-white cursor-pointer border-b border-gray-800 last:border-0 transition-colors group">
                    <div class="font-bold text-gray-200 group-hover:text-white">{{ u.nombre }} {{ u.apellidos }}</div>
                    <div class="text-xs text-gray-500 font-mono group-hover:text-pink-200">{{ u.dni }}</div>
                  </div>
                }
                
                @if (usuariosFiltrados.length === 0) {
                  <div class="px-4 py-4 text-center text-gray-500 text-sm italic">
                    No hay clientes con ese nombre o DNI.
                  </div>
                }
              </div>
            </div>
            <p *ngIf="!vehiculoForm.get('dniCliente')?.value && vehiculoForm.touched" class="text-red-500 text-xs mt-1">Debe seleccionar un propietario.</p>
          </div>

          <div>
            <label class="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Tipo</label>
            <select formControlName="tipo" class="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500 transition-all h-[50px]">
              <option value="COCHE">Coche</option>
              <option value="MOTO">Moto</option>
              <option value="CAMION">Camión</option>
              <option value="OTROS">Otros</option>
            </select>
          </div>

          <div class="col-span-full flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button type="button" (click)="cancelarFormulario()" class="px-6 py-3 text-gray-400 font-bold uppercase text-xs tracking-widest bg-gray-800 hover:bg-gray-700 rounded-lg transition-all">Cancelar</button>
            <button type="submit" [disabled]="vehiculoForm.invalid" class="px-8 py-3 text-white font-bold uppercase text-xs tracking-widest bg-pink-600 hover:bg-pink-500 rounded-lg shadow-lg shadow-pink-500/20 disabled:opacity-50">Guardar Vehículo</button>
          </div>
        </form>
      </div>

      <!-- TABLA DE VEHÍCULOS -->
      <div class="bg-[#111] rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
        <table class="w-full text-left text-sm text-gray-300">
          <thead class="text-xs uppercase bg-gray-900/50 text-gray-400 border-b border-gray-800 tracking-widest">
            <tr>
              <th class="px-6 py-5 font-bold">Matrícula</th>
              <th class="px-6 py-5 font-bold">Marca</th>
              <th class="px-6 py-5 font-bold">Modelo</th>
              <th class="px-6 py-5 font-bold text-white">Propietario</th>
              <th class="px-6 py-5 font-bold text-center">Tipo</th>
              <th class="px-6 py-5 font-bold text-right pr-14 w-48">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="isLoading" class="border-b border-gray-800">
              <td colspan="6" class="px-6 py-12 text-center text-gray-500 italic">
                 <div class="flex justify-center"><div class="animate-spin rounded-full h-8 w-8 border-t-2 border-pink-500"></div></div>
              </td>
            </tr>
            <tr *ngIf="!isLoading && vehiculosFiltrados.length === 0" class="border-b border-gray-800">
              <td colspan="6" class="px-6 py-12 text-center text-gray-500 uppercase tracking-widest font-black text-xs">No se han encontrado vehículos</td>
            </tr>
            <tr *ngFor="let v of vehiculosFiltrados" class="border-b border-gray-800 hover:bg-gray-800/30 transition-colors group">
              <td class="px-6 py-4 font-mono tracking-wider font-bold text-white">
                <span class="bg-black px-3 py-1.5 rounded border border-gray-700 shadow-inner group-hover:border-pink-500/50 transition-colors">{{ v.matricula }}</span>
              </td>
              <td class="px-6 py-4 text-white font-medium uppercase">{{ v.marca }}</td>
              <td class="px-6 py-4">{{ v.modelo }}</td>
              <td class="px-6 py-4 text-gray-300 font-medium">
                <div class="flex items-center gap-2">
                  <span class="text-pink-500">👤</span>
                  {{ obtenerNombrePropietario(v.usuarioId) }}
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <span class="text-[10px] font-black px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-gray-300 tracking-widest uppercase">{{ v.tipo }}</span>
              </td>
              <td class="px-6 py-4 text-right pr-10">
                <div class="flex justify-end items-center gap-2">
                  <button (click)="editarVehiculo(v)" class="p-2 text-gray-400 hover:text-pink-500 transition-colors" title="Editar">✏️</button>
                  <button (click)="eliminarVehiculo(v.id)" class="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Eliminar">🗑️</button>
                </div>
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

  // Variables principales de vehículos
  vehiculos: any[] = [];
  vehiculosFiltrados: any[] = [];
  textoBusquedaVehiculo = '';

  usuarios: any[] = [];

  isLoading = true;
  mostrarFormulario = false;
  vehiculoEditando: any | null = null;

  // Variables para el buscador de propietarios en el formulario
  mostrarDropdownUsuarios = false;
  textoBusquedaPropietario = '';
  usuariosFiltrados: any[] = [];

  vehiculoForm = this.fb.group({
    matricula: ['', Validators.required],
    marca: ['', Validators.required],
    modelo: ['', Validators.required],
    tipo: ['COCHE', Validators.required],
    dniCliente: ['', [Validators.required]] // Oculto visualmente, pero se rellena con el dropdown
  });

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarVehiculos();
  }

  // --- LÓGICA DEL BUSCADOR GENERAL EN TIEMPO REAL ---
  filtrarDatosAlMomento(event: any) {
    this.textoBusquedaVehiculo = event.target.value.toLowerCase();

    this.vehiculosFiltrados = this.vehiculos.filter(v =>
      v.matricula.toLowerCase().includes(this.textoBusquedaVehiculo) ||
      v.marca.toLowerCase().includes(this.textoBusquedaVehiculo) ||
      v.modelo.toLowerCase().includes(this.textoBusquedaVehiculo)
    );
  }

  limpiarBusquedaVehiculos() {
    this.textoBusquedaVehiculo = '';
    this.vehiculosFiltrados = [...this.vehiculos];
  }
  // ---------------------------------------------------

  cargarVehiculos() {
    document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
    this.isLoading = true;
    this.vehiculoService.listarTodosVehiculos().subscribe({
      next: (data: any) => {
        this.vehiculos = Array.isArray(data) ? data : [];
        this.vehiculosFiltrados = [...this.vehiculos]; // Inicializamos la tabla
        this.isLoading = false;
      },
      error: () => {
        this.toastService.show('Error al cargar la lista de vehículos', 'error');
        this.isLoading = false;
      }
    });
  }

  // --- LÓGICA DEL BUSCADOR DE CLIENTES EN FORMULARIO ---
  cargarUsuarios() {
    this.usuarioService.listarTodos().subscribe({
      next: (data: any) => {
        this.usuarios = Array.isArray(data) ? data : [];
        this.usuariosFiltrados = this.usuarios;
      }
    });
  }

  filtrarUsuariosDropdown(event: any) {
    this.textoBusquedaPropietario = event.target.value;
    this.mostrarDropdownUsuarios = true;

    if (!this.textoBusquedaPropietario) {
      this.vehiculoForm.patchValue({ dniCliente: '' });
    }

    const termino = this.textoBusquedaPropietario.toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter(u =>
      u.nombre.toLowerCase().includes(termino) ||
      u.apellidos.toLowerCase().includes(termino) ||
      u.dni.toLowerCase().includes(termino)
    );
  }

  seleccionarUsuarioParaFormulario(usuario: any) {
    this.vehiculoForm.patchValue({ dniCliente: usuario.dni });
    this.mostrarDropdownUsuarios = false;
    this.textoBusquedaPropietario = '';
  }

  obtenerTextoBuscador(): string {
    if (this.mostrarDropdownUsuarios) {
      return this.textoBusquedaPropietario;
    }

    const dniActual = this.vehiculoForm.get('dniCliente')?.value;
    if (dniActual) {
      const u = this.usuarios.find(user => user.dni === dniActual);
      return u ? `✅ ${u.nombre} ${u.apellidos} (${u.dni})` : dniActual;
    }

    return '';
  }

  ocultarDropdownUsuarios() {
    setTimeout(() => {
      this.mostrarDropdownUsuarios = false;
    }, 200);
  }

  obtenerNombrePropietario(usuarioId: number): string {
    if (!usuarioId) return 'Sin asignar';
    const dueño = this.usuarios.find(u => u.id === usuarioId);
    return dueño ? `${dueño.nombre} ${dueño.apellidos}` : 'Desconocido';
  }
  // ----------------------------------------

  mostrarFormularioNuevo() {
    document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
    this.vehiculoEditando = null;
    this.vehiculoForm.reset({ tipo: 'COCHE' });
    this.textoBusquedaPropietario = '';
    this.usuariosFiltrados = this.usuarios;
    this.mostrarFormulario = true;
  }

  editarVehiculo(vehiculo: any) {
    document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
    this.vehiculoEditando = vehiculo;

    const dueño = this.usuarios.find(u => u.id === vehiculo.usuarioId);

    this.vehiculoForm.patchValue({
      matricula: vehiculo.matricula,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      tipo: vehiculo.tipo,
      dniCliente: dueño ? dueño.dni : ''
    });

    this.mostrarFormulario = true;
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
    this.vehiculoEditando = null;
    this.textoBusquedaPropietario = '';
  }

  guardarVehiculo() {
    document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
    if (this.vehiculoForm.invalid) return;

    const data = this.vehiculoForm.value;

    if (this.vehiculoEditando) {
      this.vehiculoService.modificarVehiculo(this.vehiculoEditando.id, data).subscribe({
        next: () => {
          this.toastService.show('Vehículo actualizado con éxito', 'success');
          this.cargarVehiculos();
          this.cancelarFormulario();
        },
        error: (err) => {
          console.error('Error al modificar:', err);
          this.toastService.show('No se pudo modificar el vehículo', 'error');
        }
      });
    } else {
      this.vehiculoService.darAltaVehiculo(data).subscribe({
        next: () => {
          this.toastService.show('Vehículo dado de alta', 'success');
          this.cargarVehiculos();
          this.cancelarFormulario();
        },
        error: (err) => {
          this.toastService.show('Error al dar de alta', 'error');
        }
      });
    }
  }

  eliminarVehiculo(id: number) {
    document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
    if (confirm('¿Estás seguro de que deseas eliminar este vehículo en todo el sistema?')) {
      this.vehiculoService.eliminarVehiculo(id).subscribe({
        next: () => {
          this.toastService.show('Vehículo eliminado', 'success');
          this.cargarVehiculos();
        }
      });
    }
  }
}