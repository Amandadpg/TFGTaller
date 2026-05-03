import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../../core/services/usuario/usuario.service';
import { Usuario } from '../../../../core/models/usuario.model';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { VehiculoService } from '../../../../core/services/vehiculo/vehiculo.service';
import { CitaService } from '../../../../core/services/cita/cita.service';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-8">
      
      <!-- CABECERA -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
          <span class="text-pink-500">👥</span> Gestión de Usuarios
        </h1>
        <button (click)="mostrarFormularioNuevo()" class="bg-pink-600 hover:bg-pink-500 text-white font-bold py-2.5 px-6 rounded-lg shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all uppercase tracking-widest text-sm">
          + Nuevo Usuario
        </button>
      </div>

      <!-- BUSCADOR REACTIVO EN TIEMPO REAL -->
      <div class="mb-8 flex gap-4 h-[50px]">
        <input 
          type="text" 
          [value]="textoBusquedaUsuario"
          (input)="filtrarDatosAlMomento($event)"
          placeholder="🔍 Buscar por nombre, apellidos o DNI..." 
          class="flex-1 bg-[#111] border border-gray-800 rounded-lg px-5 text-white outline-none focus:border-pink-500 transition-all text-base placeholder:text-gray-500"
        >
        <!-- BOTÓN LIMPIAR / RECARGAR -->
        <button (click)="limpiarBusquedaUsuarios()" class="bg-[#1e2330] hover:bg-[#2a3142] text-gray-400 hover:text-white w-[50px] rounded-lg transition-all border border-gray-700/50 flex items-center justify-center shrink-0 shadow-lg" title="Limpiar y recargar">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        </button>
      </div>

      <!-- FORMULARIO -->
      <div *ngIf="mostrarFormulario" class="bg-[#111] rounded-2xl border border-gray-800 border-t-4 border-t-pink-500 p-6 mb-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <h3 class="text-xl font-bold text-white mb-6 uppercase tracking-widest">{{ usuarioEditando ? 'Editar Usuario' : 'Registrar Nuevo Miembro' }}</h3>
        
        <form [formGroup]="usuarioForm" (ngSubmit)="guardarUsuario()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label class="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Nombre</label>
            <input formControlName="nombre" class="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500 transition-all h-[50px]">
          </div>
          <div>
            <label class="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Apellidos</label>
            <input formControlName="apellidos" class="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500 transition-all h-[50px]">
          </div>
          <div>
            <label class="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">DNI</label>
            <input formControlName="dni" class="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500 uppercase transition-all h-[50px]">
          </div>
          <div>
            <label class="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Teléfono</label>
            <input formControlName="telefono" type="tel" class="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500 transition-all h-[50px]">
          </div>
          <div class="md:col-span-2">
            <label class="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Dirección</label>
            <input formControlName="direccion" class="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500 transition-all h-[50px]">
          </div>
          <div>
            <label class="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Email</label>
            <input formControlName="email" type="email" class="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500 transition-all h-[50px]">
          </div>
          <div *ngIf="!usuarioEditando">
            <label class="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Contraseña</label>
            <input formControlName="contrasena" type="password" class="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500 transition-all h-[50px]">
          </div>
          <div>
            <label class="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Rol</label>
            <select formControlName="rol" class="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500 transition-all h-[50px]">
              <option value="CLIENTE">Cliente</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div class="col-span-full flex justify-end gap-3 mt-4 pt-6 border-t border-gray-800/50">
            <button type="button" (click)="cancelarFormulario()" class="px-6 py-3 text-gray-400 font-bold uppercase text-xs tracking-widest bg-gray-800 hover:bg-gray-700 rounded-lg transition-all">Cancelar</button>
            <button type="submit" [disabled]="usuarioForm.invalid" class="px-8 py-3 text-white bg-pink-600 hover:bg-pink-500 rounded-lg font-bold uppercase text-xs tracking-widest shadow-lg shadow-pink-500/20 disabled:opacity-30">Guardar Usuario</button>
          </div>
        </form>
      </div>

      <!-- TABLA DE USUARIOS -->
      <div class="bg-[#111] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
        <table class="w-full text-left text-sm text-gray-300">
          <thead class="bg-gray-900/80 text-gray-500 text-xs uppercase tracking-widest border-b border-gray-800">
            <tr>
              <th class="px-6 py-5 font-bold">ID</th>
              <th class="px-6 py-5 font-bold text-white">Nombre Completo</th>
              <th class="px-6 py-5 font-bold">DNI</th>
              <th class="px-6 py-5 font-bold text-center">Rol</th>
              <th class="px-6 py-5 text-right font-bold pr-14">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800/40">
            <tr *ngIf="isLoading" class="border-b border-gray-800">
              <td colspan="5" class="px-6 py-12 text-center text-gray-500 italic">
                 <div class="flex justify-center"><div class="animate-spin rounded-full h-8 w-8 border-t-2 border-pink-500"></div></div>
              </td>
            </tr>
            <tr *ngIf="!isLoading && usuariosFiltradosTabla.length === 0" class="border-b border-gray-800">
              <td colspan="5" class="px-6 py-12 text-center text-gray-500 uppercase tracking-widest font-black text-xs">No se han encontrado usuarios</td>
            </tr>
            <tr *ngFor="let u of usuariosFiltradosTabla" class="hover:bg-gray-800/20 transition-colors group">
              <td class="px-6 py-4 font-mono text-gray-600 text-xs">#{{ u.id }}</td>
              <td class="px-6 py-4 font-bold text-white uppercase tracking-tight">{{ u.nombre }} {{ u.apellidos }}</td>
              <td class="px-6 py-4 font-mono text-gray-400">{{ u.dni }}</td>
              <td class="px-6 py-4 text-center">
                <!-- ROLES: Cliente en Rosa, Admin en Blanco -->
                <span [ngClass]="u.rol === 'ADMIN' ? 'bg-white/10 text-white border-white/20' : 'bg-pink-500/10 text-pink-500 border-pink-500/20'" 
                      class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border">
                  {{ u.rol }}
                </span>
              </td>
              <td class="px-6 py-4 text-right pr-10">
                <div class="flex justify-end gap-1 transition-opacity">
                  <button (click)="verDetalles(u)" class="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Ver Detalles">👁️</button>
                  <button (click)="editarUsuario(u)" class="p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-500/10 rounded-lg transition-all" title="Editar">✏️</button>
                  <button (click)="eliminarUsuario(u.id)" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all" title="Eliminar">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- MODAL FICHA CLIENTE -->
      <div *ngIf="usuarioSeleccionado" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div class="bg-[#0a0a0a] w-full max-w-2xl rounded-3xl border border-gray-800 shadow-2xl overflow-hidden shadow-pink-500/5">
          <div class="p-8 border-b border-gray-800 flex justify-between items-center bg-gradient-to-r from-pink-500/10 to-transparent">
            <div>
              <h3 class="text-2xl font-black text-white uppercase tracking-tighter">Ficha del Cliente</h3>
              <p class="text-pink-500 font-bold text-sm tracking-widest">{{ usuarioSeleccionado.nombre }} {{ usuarioSeleccionado.apellidos }}</p>
            </div>
            <button (click)="usuarioSeleccionado = null" class="text-gray-500 hover:text-white text-3xl font-light transition-colors">&times;</button>
          </div>
          
          <div class="p-8 grid grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <p class="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Documento DNI</p>
                <p class="text-white font-mono bg-gray-900 px-3 py-1 rounded border border-gray-800 inline-block">{{ usuarioSeleccionado.dni }}</p>
              </div>
              <div>
                <p class="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Contacto Directo</p>
                <p class="text-white">{{ usuarioSeleccionado.telefono }}</p>
              </div>
            </div>
            <div class="space-y-4">
              <div>
                <p class="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Correo Electrónico</p>
                <p class="text-white truncate">{{ usuarioSeleccionado.email }}</p>
              </div>
              <div>
                <p class="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Ubicación</p>
                <p class="text-white text-sm">{{ usuarioSeleccionado.direccion }}</p>
              </div>
            </div>

            <div class="col-span-full pt-6 border-t border-gray-800">
              <h4 class="text-xs font-black uppercase tracking-widest text-pink-500 mb-4">Vehículos Vinculados</h4>
              <div *ngIf="usuarioSeleccionado.vehiculos?.length; else noVehiculos" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div *ngFor="let v of usuarioSeleccionado.vehiculos" class="bg-black p-4 rounded-xl border border-gray-800 hover:border-pink-500/50 transition-all group">
                  <p class="text-white font-bold group-hover:text-pink-500 transition-colors">{{ v.marca }} {{ v.modelo }}</p>
                  <p class="text-xs text-gray-500 font-mono mt-1 uppercase">{{ v.matricula }}</p>
                </div>
              </div>
              <ng-template #noVehiculos>
                <p class="text-gray-600 italic text-xs">Este cliente no dispone de vehículos registrados.</p>
              </ng-template>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class AdminUsuariosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private vehiculoService = inject(VehiculoService);
  private citaService = inject(CitaService);
  private toastService = inject(ToastService);

  usuarios: Usuario[] = [];
  usuariosFiltradosTabla: Usuario[] = [];
  textoBusquedaUsuario = '';

  usuarioSeleccionado: Usuario | null = null;
  isLoading = true;
  mostrarFormulario = false;
  usuarioEditando: Usuario | null = null;

  usuarioForm = this.fb.group({
    nombre: ['', Validators.required],
    apellidos: ['', Validators.required],
    dni: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
    direccion: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    contrasena: [''],
    rol: ['CLIENTE', Validators.required]
  });

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
    this.isLoading = true;
    this.usuarioService.listarTodos().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.usuariosFiltradosTabla = [...this.usuarios];
        this.isLoading = false;
      },
      error: () => {
        this.toastService.show('Error al cargar usuarios', 'error');
        this.isLoading = false;
      }
    });
  }

  // --- LÓGICA DEL BUSCADOR REACTIVO EN TIEMPO REAL ---
  filtrarDatosAlMomento(event: any) {
    this.textoBusquedaUsuario = event.target.value.toLowerCase();

    this.usuariosFiltradosTabla = this.usuarios.filter(u =>
      u.nombre.toLowerCase().includes(this.textoBusquedaUsuario) ||
      u.apellidos.toLowerCase().includes(this.textoBusquedaUsuario) ||
      u.dni.toLowerCase().includes(this.textoBusquedaUsuario)
    );
  }

  limpiarBusquedaUsuarios() {
    this.textoBusquedaUsuario = '';
    this.usuariosFiltradosTabla = [...this.usuarios];
  }
  // ----------------------------------------------------

  verDetalles(usuario: Usuario) {
    document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
    this.usuarioService.obtenerUsuarioPorId(usuario.id).subscribe({
      next: (data) => this.usuarioSeleccionado = data,
      error: () => this.toastService.show('No se pudo obtener la ficha completa', 'error')
    });
  }

  mostrarFormularioNuevo() {
    document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
    this.usuarioEditando = null;
    this.usuarioForm.reset({ rol: 'CLIENTE' });
    this.usuarioForm.get('contrasena')?.setValidators([Validators.required]);
    this.usuarioForm.get('contrasena')?.updateValueAndValidity();
    this.mostrarFormulario = true;
  }

  editarUsuario(usuario: Usuario) {
    document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
    this.usuarioEditando = usuario;
    this.usuarioForm.patchValue({
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      dni: usuario.dni,
      email: usuario.email,
      telefono: usuario.telefono,
      direccion: usuario.direccion,
      rol: usuario.rol
    });
    this.usuarioForm.get('contrasena')?.clearValidators();
    this.usuarioForm.get('contrasena')?.updateValueAndValidity();
    this.mostrarFormulario = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
    this.usuarioEditando = null;
  }

  guardarUsuario() {
    document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
    if (this.usuarioForm.invalid) return;
    const data = this.usuarioForm.value;

    if (this.usuarioEditando) {
      this.usuarioService.modificarUsuario(this.usuarioEditando.id, data).subscribe({
        next: () => {
          this.toastService.show('Usuario actualizado', 'success');
          this.cargarUsuarios();
          this.cancelarFormulario();
        },
        error: () => this.toastService.show('Error al actualizar', 'error')
      });
    } else {
      this.usuarioService.registrar({
        ...data,
        confirmarContrasena: data.contrasena
      } as any).subscribe({
        next: () => {
          this.toastService.show('Usuario creado', 'success');
          this.cargarUsuarios();
          this.cancelarFormulario();
        },
        error: (err) => this.toastService.show(err?.error?.message || 'Error al crear', 'error')
      });
    }
  }

  eliminarUsuario(usuarioId: number) {
    if (confirm('¿Estás seguro? Se cancelarán sus citas y se borrarán sus vehículos y cuenta.')) {
      document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'smooth' });

      this.vehiculoService.listarTodosVehiculos().subscribe({
        next: (todosLosVehiculos: any[]) => {
          const vehiculosDelUsuario = todosLosVehiculos.filter(v => v.usuarioId === usuarioId);

          if (vehiculosDelUsuario.length > 0) {
            vehiculosDelUsuario.forEach((vehiculo: any) => {
              this.citaService.obtenerTodas().subscribe((todasLasCitas: any[]) => {
                const citasDelCoche = todasLasCitas.filter(c => c.matriculaVehiculo === vehiculo.matricula);

                citasDelCoche.forEach((cita: any) => {
                  this.citaService.eliminarCita(cita.id).subscribe({
                    next: () => console.log(`Cita ${cita.id} borrada`),
                    error: () => console.log('Cita ya eliminada o error ignorado')
                  });
                });

                citasDelCoche.forEach((cita: any) => {
                  this.citaService.cambiarEstado(cita.id, 'CANCELADA').subscribe();
                });

                this.vehiculoService.eliminarVehiculo(vehiculo.id).subscribe();
              });
            });
          }

          setTimeout(() => {
            this.usuarioService.eliminarUsuario(usuarioId).subscribe({
              next: () => {
                this.toastService.show('Usuario eliminado correctamente', 'success');
                this.cargarUsuarios();
              },
              error: (err) => {
                if (err.status === 200) {
                  this.toastService.show('Usuario eliminado con éxito', 'success');
                  this.cargarUsuarios();
                } else if (err.status === 404) {
                  this.toastService.show('Error: No se encuentra la ruta de borrado en el servidor (404)', 'error');
                  console.error('Revisa la URL en UsuarioService.eliminarUsuario. La URL intentada fue:', err.url);
                } else {
                  this.toastService.show('Error real al eliminar el usuario', 'error');
                  console.error('Detalle del error:', err);
                }
              }
            });
          }, 1500);
        },
        error: () => {
          this.toastService.show('Error al obtener la lista de vehículos', 'error');
        }
      });
    }
  }
}