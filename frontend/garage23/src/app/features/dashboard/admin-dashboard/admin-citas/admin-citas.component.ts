import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CitaService } from '../../../../core/services/cita/cita.service';
import { UsuarioService } from '../../../../core/services/usuario/usuario.service';
import { VehiculoService } from '../../../../core/services/vehiculo/vehiculo.service';
import { ServicioService } from '../../../../core/services/servicio/servicio.service';
import { ToastService } from '../../../../core/services/toast/toast.service';

@Component({
  selector: 'app-admin-citas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-8">
      <!-- CABECERA -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
          <span class="text-pink-500">📅</span> Gestión de Citas
        </h1>
        <button (click)="mostrarFormularioNuevo()" class="bg-pink-600 hover:bg-pink-500 text-white font-bold py-2 px-6 rounded-lg shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all uppercase tracking-widest text-sm">
          + Programar Cita
        </button>
      </div>

      <!-- BUSCADOR FLEXIBLE HASTA EL FINAL -->
      <div class="mb-8 flex gap-4 h-[50px]">
        <input 
          type="text" 
          [value]="textoBusquedaCita"
          (input)="filtrarDatosAlMomento($event)" 
          placeholder="🔍 Buscar por nombre del cliente..." 
          class="flex-1 bg-[#111] border border-gray-800 rounded-lg px-5 text-white outline-none focus:border-pink-500 transition-all text-base placeholder:text-gray-500"
        >
        <!-- BOTÓN LIMPIAR / RECARGAR -->
        <button (click)="limpiarBusquedaCitas()" class="bg-[#1e2330] hover:bg-[#2a3142] text-gray-400 hover:text-white w-[50px] rounded-lg transition-all border border-gray-700/50 flex items-center justify-center shrink-0 shadow-lg" title="Limpiar y recargar">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        </button>
      </div>

      <!-- FORMULARIO NUEVA CITA -->
      <div *ngIf="mostrarFormulario" class="bg-[#111] rounded-2xl shadow-xl border border-gray-800 border-t-4 border-t-pink-500 p-6 mb-8 animate-in fade-in zoom-in duration-300">
        <h3 class="text-xl font-bold text-white mb-6 uppercase tracking-widest">{{ citaEditando ? 'Modificar Cita' : 'Nueva Entrada a Taller' }}</h3>
        
        <form [formGroup]="citaForm" (ngSubmit)="guardarCita()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="relative">
            <label class="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Cliente</label>
            <input 
              type="text" 
              [value]="textoBusquedaUsuario"
              (input)="filtrarUsuarios($event)"
              (focus)="dropdownUsuario = true"
              (blur)="ocultarDropdown()"
              placeholder="🔍 Buscar por nombre o DNI..." 
              class="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500 transition-all h-[50px]"
            >
            <div *ngIf="dropdownUsuario && usuariosFiltrados.length > 0" class="absolute z-50 w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl max-h-48 overflow-y-auto">
              @for (u of usuariosFiltrados; track u.id) {
                <div (mousedown)="seleccionarUsuario(u)" class="px-4 py-3 hover:bg-pink-600 cursor-pointer border-b border-gray-800 last:border-0 group">
                  <p class="font-bold text-gray-200 group-hover:text-white">{{ u.nombre }} {{ u.apellidos }}</p>
                  <p class="text-[10px] text-gray-500 group-hover:text-pink-200">{{ u.dni }}</p>
                </div>
              }
            </div>
          </div>

          <div>
            <label class="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Vehículo</label>
            <select formControlName="vehiculoId" class="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500 h-[50px]">
              <option value="">Selecciona un vehículo...</option>
              @for (v of vehiculosDelUsuario; track v.id) {
                <option [value]="v.id">{{ v.marca }} {{ v.modelo }} ({{ v.matricula }})</option>
              }
            </select>
          </div>

          <div class="relative">
            <label class="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Servicio</label>
            <input 
              type="text" 
              [value]="textoBusquedaServicio"
              (input)="filtrarServicios($event)"
              (focus)="dropdownServicio = true"
              (blur)="ocultarDropdownServicio()"
              placeholder="🔍 Buscar servicio..." 
              class="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500 transition-all h-[50px]"
            >
            <div *ngIf="dropdownServicio && serviciosFiltrados.length > 0" class="absolute z-50 w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl max-h-48 overflow-y-auto">
              @for (s of serviciosFiltrados; track s.id) {
                <div (mousedown)="seleccionarServicio(s)" class="px-4 py-3 hover:bg-pink-600 cursor-pointer border-b border-gray-800 last:border-0 group">
                  <p class="font-bold text-gray-200 group-hover:text-white">{{ s.nombreServicio }}</p>
                </div>
              }
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 lg:col-span-1">
            <div>
              <label class="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Fecha</label>
              <input type="date" formControlName="fecha" class="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500 [color-scheme:dark] h-[50px]">
            </div>
            <div>
              <label class="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Hora</label>
              <input type="time" formControlName="hora" class="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500 [color-scheme:dark] h-[50px]">
            </div>
          </div>

          <div>
            <label class="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Estado</label>
            <select formControlName="estado" class="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500 h-[50px]">
              <option value="PENDIENTE">Pendiente</option>
              <option value="EN_CURSO">En Curso</option>
              <option value="COMPLETADA">Completada</option>
              <option value="CANCELADA">Cancelada</option>
            </select>
          </div>

          <div class="col-span-full flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button type="button" (click)="cancelarFormulario()" class="px-6 py-3 text-gray-400 font-bold bg-gray-800 hover:bg-gray-700 rounded-lg transition-all uppercase tracking-widest text-xs">Cancelar</button>
            <button type="submit" [disabled]="citaForm.invalid" class="px-8 py-3 text-white font-bold bg-pink-600 hover:bg-pink-500 rounded-lg shadow-lg shadow-pink-500/20 disabled:opacity-30 uppercase tracking-widest text-xs">Confirmar Cita</button>
          </div>
        </form>
      </div>

      <!-- TABLA DE CITAS (AHORA USA CITAS FILTRADAS) -->
      <div class="bg-[#111] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
        <table class="w-full text-left text-sm text-gray-300 border-collapse">
          <thead class="text-xs uppercase bg-gray-900/50 text-gray-400 border-b border-gray-800 tracking-widest">
            <tr>
              <th class="px-6 py-5 font-bold">Fecha / Hora</th>
              <th class="px-6 py-5 font-bold">Vehículo</th>
              <th class="px-6 py-5 font-bold">Cliente</th>
              <th class="px-6 py-5 font-bold">Servicio</th>
              <th class="px-6 py-5 text-center font-bold">Estado</th>
              <th class="px-6 py-5 text-right pr-28 font-bold w-64">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800/40">
            @for (cita of citasFiltradasTabla; track cita.id) {
              <tr class="hover:bg-gray-800/20 transition-colors group">
                <td class="px-6 py-4">
                  <div class="text-white font-bold">{{ cita.fecha | date:'dd/MM/yyyy' }}</div>
                  <div class="text-pink-500 font-mono text-xs">{{ cita.hora }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-gray-200 font-bold uppercase tracking-tight">{{ cita.matriculaVehiculo }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <span class="text-gray-500">👤</span>
                    {{ obtenerNombrePropietario(cita.matriculaVehiculo) }}
                  </div>
                </td>
                <td class="px-6 py-4 italic text-gray-400">
                  {{ cita.nombreServicio || 'Revisión General' }}
                </td>
                <td class="px-6 py-4 text-center">
                  <!-- Mantenemos los colores de estado porque aportan funcionalidad visual -->
                  <span [ngClass]="{
                    'bg-yellow-500/10 text-yellow-500': cita.estado === 'PENDIENTE',
                    'bg-blue-500/10 text-blue-500': cita.estado === 'EN_CURSO',
                    'bg-green-500/10 text-green-500': cita.estado === 'COMPLETADA',
                    'bg-red-500/10 text-red-500': cita.estado === 'CANCELADA'
                  }" class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border border-current/10">
                    {{ cita.estado }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right pr-10">
                    <div class="flex justify-end items-center gap-4">
                      <div class="flex gap-2" *ngIf="cita.estado !== 'CANCELADA' && cita.estado !== 'COMPLETADA'">
                        <button (click)="cambiarEstadoRapido(cita, 'COMPLETADA')" class="hover:scale-125 transition-transform" title="Completar">✅</button>
                        <button (click)="cambiarEstadoRapido(cita, 'CANCELADA')" class="hover:scale-125 transition-transform" title="Rechazar">❌</button>
                      </div>
                      <div class="w-[1px] h-4 bg-gray-700"></div>
                      <div class="flex gap-1">
                        <button (click)="editarCita(cita)" class="p-2 text-gray-400 hover:text-pink-500 transition-colors">✏️</button>
                        <button (click)="eliminarCita(cita.id)" class="p-2 text-gray-400 hover:text-red-500 transition-colors">🗑️</button>
                      </div>
                    </div>
                  </td>
                </tr>
            }
          </tbody>
        </table>

        <!-- MENSAJE DE TABLA VACÍA -->
        <div *ngIf="citasFiltradasTabla.length === 0" class="text-center py-12">
          <p class="text-gray-500 uppercase tracking-widest font-black text-xs">No se han encontrado citas</p>
        </div>
      </div>
    </div>
  `
})
export class AdminCitasComponent implements OnInit {
  private fb = inject(FormBuilder);
  private citaService = inject(CitaService);
  private usuarioService = inject(UsuarioService);
  private vehiculoService = inject(VehiculoService);
  private servicioService = inject(ServicioService);
  private toastService = inject(ToastService);

  // Variables principales de citas
  citas: any[] = [];
  citasFiltradasTabla: any[] = [];
  textoBusquedaCita = '';

  usuarios: any[] = [];
  todosLosVehiculos: any[] = [];
  vehiculosDelUsuario: any[] = [];
  servicios: any[] = [];

  mostrarFormulario = false;
  citaEditando: any | null = null;

  dropdownUsuario = false;
  textoBusquedaUsuario = '';
  usuariosFiltrados: any[] = [];

  dropdownServicio = false;
  textoBusquedaServicio = '';
  serviciosFiltrados: any[] = [];

  citaForm = this.fb.group({
    fecha: ['', Validators.required],
    hora: ['', Validators.required],
    vehiculoId: ['', Validators.required],
    servicioId: ['', Validators.required],
    estado: ['PENDIENTE', Validators.required]
  });

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.citaService.obtenerTodas().subscribe(data => {
      this.citas = data.sort((a: any, b: any) => {
        const dateA = new Date(`${a.fecha}T${a.hora || '00:00:00'}`);
        const dateB = new Date(`${b.fecha}T${b.hora || '00:00:00'}`);
        return dateB.getTime() - dateA.getTime();
      });
      this.citasFiltradasTabla = [...this.citas];
    });

    this.usuarioService.listarTodos().subscribe(data => {
      this.usuarios = data;
      this.usuariosFiltrados = data;
    });

    this.vehiculoService.listarTodosVehiculos().subscribe(data => this.todosLosVehiculos = data);

    this.servicioService.obtenerTodos().subscribe({
      next: (data) => {
        this.servicios = data && data.length > 0 ? data : this.serviciosDeRespaldo();
        this.serviciosFiltrados = [...this.servicios];
      },
      error: () => {
        console.warn('Backend de servicios caído (500). Cargando servicios locales.');
        this.servicios = this.serviciosDeRespaldo();
        this.serviciosFiltrados = [...this.servicios];
      }
    });
  }

  // --- BUSCADOR PRINCIPAL DE CITAS ---
  filtrarDatosAlMomento(event: any) {
    this.textoBusquedaCita = event.target.value.toLowerCase();

    this.citasFiltradasTabla = this.citas.filter(cita => {
      const nombreCliente = this.obtenerNombrePropietario(cita.matriculaVehiculo).toLowerCase();
      return nombreCliente.includes(this.textoBusquedaCita);
    });
  }

  limpiarBusquedaCitas() {
    this.textoBusquedaCita = '';
    this.cargarDatos();
  }
  // -----------------------------------

  serviciosDeRespaldo() {
    return [
      { id: 1, nombreServicio: 'Revisión Estándar' },
      { id: 2, nombreServicio: 'Cambio de Aceite' },
      { id: 3, nombreServicio: 'Mantenimiento Avanzado' },
      { id: 4, nombreServicio: 'Diagnosis Completa' }
    ];
  }

  cambiarEstadoRapido(cita: any, nuevoEstado: string) {
    this.citaService.cambiarEstado(cita.id, nuevoEstado).subscribe({
      next: () => {
        this.toastService.show(`Cita: ${nuevoEstado}`, 'success');
        this.cargarDatos();
      },
      error: (err) => {
        const msg = typeof err.error === 'string' ? err.error : 'Error al cambiar el estado.';
        this.toastService.show(msg, 'error');
        console.error(err);
      }
    });
  }

  guardarCita() {
    if (this.citaForm.invalid) return;
    const data = this.citaForm.value;

    const payload = {
      fecha: data.fecha,
      hora: data.hora?.substring(0, 5),
      vehiculoId: Number(data.vehiculoId),
      servicioId: Number(data.servicioId)
    };

    const request = this.citaEditando
      ? this.citaService.modificarAdmin(this.citaEditando.id, { ...payload, estado: data.estado })
      : this.citaService.crearCita(payload);

    request.subscribe({
      next: () => {
        this.toastService.show(this.citaEditando ? 'Cita actualizada' : 'Cita creada', 'success');
        this.cargarDatos();
        this.cancelarFormulario();
      },
      error: (err) => {
        const msg = typeof err.error === 'string' ? err.error : 'Error al procesar la cita. Verifica los datos.';
        this.toastService.show(msg, 'error');
        console.error(err);
      }
    });
  }

  filtrarUsuarios(event: any) {
    this.textoBusquedaUsuario = event.target.value.toLowerCase();
    this.dropdownUsuario = true;
    this.usuariosFiltrados = this.usuarios.filter(u =>
      u.nombre.toLowerCase().includes(this.textoBusquedaUsuario) ||
      u.dni.toLowerCase().includes(this.textoBusquedaUsuario)
    );
  }

  seleccionarUsuario(u: any) {
    this.textoBusquedaUsuario = `${u.nombre} ${u.apellidos}`;
    this.dropdownUsuario = false;
    this.vehiculosDelUsuario = this.todosLosVehiculos.filter(v => v.usuarioId === u.id);
    this.citaForm.patchValue({ vehiculoId: '' });
  }

  ocultarDropdown() {
    setTimeout(() => this.dropdownUsuario = false, 200);
  }

  filtrarServicios(event: any) {
    this.textoBusquedaServicio = event.target.value.toLowerCase();
    this.dropdownServicio = true;
    this.serviciosFiltrados = this.servicios.filter(s =>
      s.nombreServicio.toLowerCase().includes(this.textoBusquedaServicio)
    );
  }

  seleccionarServicio(s: any) {
    this.textoBusquedaServicio = s.nombreServicio;
    this.dropdownServicio = false;
    this.citaForm.patchValue({ servicioId: s.id });
  }

  ocultarDropdownServicio() {
    setTimeout(() => this.dropdownServicio = false, 200);
  }

  obtenerNombrePropietario(matricula: string): string {
    const v = this.todosLosVehiculos.find(veh => veh.matricula === matricula);
    if (!v) return 'No registrado';
    const u = this.usuarios.find(user => user.id === v.usuarioId);
    return u ? `${u.nombre} ${u.apellidos}` : 'Desconocido';
  }

  mostrarFormularioNuevo() {
    this.subir();
    this.citaEditando = null;
    this.citaForm.reset({ estado: 'PENDIENTE' });
    this.textoBusquedaUsuario = '';
    this.textoBusquedaServicio = '';
    this.vehiculosDelUsuario = [];
    this.mostrarFormulario = true;
  }

  editarCita(cita: any) {
    this.subir();
    this.citaEditando = cita;
    const v = this.todosLosVehiculos.find(veh => veh.matricula === cita.matriculaVehiculo);
    if (v) {
      const u = this.usuarios.find(user => user.id === v.usuarioId);
      if (u) {
        this.textoBusquedaUsuario = `${u.nombre} ${u.apellidos}`;
        this.vehiculosDelUsuario = this.todosLosVehiculos.filter(veh => veh.usuarioId === u.id);
      }
    }

    const s = this.servicios.find(serv => serv.nombreServicio === cita.nombreServicio);
    this.textoBusquedaServicio = s ? s.nombreServicio : '';

    this.citaForm.patchValue({
      fecha: cita.fecha,
      hora: cita.hora,
      vehiculoId: v ? v.id : '',
      servicioId: s ? s.id : '',
      estado: cita.estado
    });
    this.mostrarFormulario = true;
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
  }

  eliminarCita(id: number) {
    if (confirm('¿Eliminar cita?')) {
      this.subir();
      this.citaService.eliminarCita(id).subscribe({
        next: () => {
          this.toastService.show('Cita eliminada', 'success');
          this.cargarDatos();
        },
        error: (err) => {
          const msg = typeof err.error === 'string' ? err.error : 'Error al eliminar la cita.';
          this.toastService.show(msg, 'error');
          console.error(err);
        }
      });
    }
  }

  subir() {
    document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
  }
}