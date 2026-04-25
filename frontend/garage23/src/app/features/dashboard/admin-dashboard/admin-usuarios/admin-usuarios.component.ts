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
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-bold flex items-center gap-3" style="color: #1a1a1a;">
          <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          Gestión de Usuarios
        </h2>
        <button (click)="mostrarFormularioNuevo()" class="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-all">
          + Nuevo Usuario
        </button>
      </div>

      
      <div class="mb-6 flex gap-4">
        <input type="text" #buscadorNombre placeholder="Buscar usuario por nombre..." class="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-primary shadow-sm font-medium">
        <button (click)="buscarPorNombre(buscadorNombre.value)" class="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors border border-gray-700">Buscar</button>
        <button (click)="cargarUsuarios()" class="bg-gray-800 hover:bg-gray-700 text-brand-muted hover:text-white font-bold py-3 px-4 rounded-lg border border-gray-700">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        </button>
      </div>

      <div *ngIf="mostrarFormulario" class="bg-brand-anthracite rounded-2xl border border-gray-800 p-6 mb-8 shadow-xl animate-in fade-in duration-300">
        <h3 class="text-xl font-bold text-white mb-4">{{ usuarioEditando ? 'Editar Usuario' : 'Nuevo Usuario' }}</h3>
        <form [formGroup]="usuarioForm" (ngSubmit)="guardarUsuario()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div><label class="block text-brand-muted text-sm mb-1">Nombre</label><input formControlName="nombre" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-primary"></div>
          <div><label class="block text-brand-muted text-sm mb-1">Apellidos</label><input formControlName="apellidos" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-primary"></div>
          <div><label class="block text-brand-muted text-sm mb-1">DNI</label><input formControlName="dni" (input)="usuarioForm.get('dni')?.setValue($any($event.target).value.toUpperCase())" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-primary uppercase"></div>
          <div><label class="block text-brand-muted text-sm mb-1">Teléfono</label><input formControlName="telefono" type="tel" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-primary"></div>
          <div class="md:col-span-2"><label class="block text-brand-muted text-sm mb-1">Dirección</label><input formControlName="direccion" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-primary"></div>
          <div><label class="block text-brand-muted text-sm mb-1">Email</label><input formControlName="email" type="email" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-primary"></div>
          <div *ngIf="!usuarioEditando"><label class="block text-brand-muted text-sm mb-1">Contraseña</label><input formControlName="contrasena" type="password" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-primary"></div>
          <div><label class="block text-brand-muted text-sm mb-1">Rol</label><select formControlName="rol" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-primary"><option value="CLIENTE">Cliente</option><option value="ADMIN">Admin</option></select></div>
          <div class="col-span-full flex justify-end gap-3 mt-4">
            <button type="button" (click)="cancelarFormulario()" class="px-6 py-2 text-brand-light bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">Cancelar</button>
            <button type="submit" [disabled]="usuarioForm.invalid" class="px-6 py-2 text-white bg-primary hover:bg-primary-hover rounded-lg">Guardar</button>
          </div>
        </form>
      </div>

      <div class="bg-brand-anthracite rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
        <table class="w-full text-left text-sm text-brand-light">
          <thead class="bg-gray-800 text-brand-muted border-b border-gray-700">
            <tr>
              <th class="px-6 py-4">ID</th>
              <th class="px-6 py-4">Nombre Completo</th>
              <th class="px-6 py-4">DNI</th>
              <th class="px-6 py-4">Rol</th>
              <th class="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of usuarios" class="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
              <td class="px-6 py-4 font-mono text-gray-500">#{{ u.id }}</td>
              <td class="px-6 py-4 font-medium text-white">{{ u.nombre }} {{ u.apellidos }}</td>
              <td class="px-6 py-4">{{ u.dni }}</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 rounded text-xs font-bold" [ngClass]="u.rol === 'ADMIN' ? 'bg-primary/20 text-primary' : 'bg-blue-500/20 text-blue-400'">{{ u.rol }}</span>
              </td>
              <td class="px-6 py-4 text-right flex justify-end gap-2">
                <button (click)="verDetalles(u)" class="p-2 text-blue-400 hover:text-white hover:bg-blue-500/20 rounded transition-colors" title="Ver Detalles">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                </button>
                <button (click)="editarUsuario(u)" class="p-2 text-brand-muted hover:text-white hover:bg-gray-700 rounded"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                <button (click)="eliminarUsuario(u.id)" class="p-2 text-brand-muted hover:text-red-500 hover:bg-red-500/10 rounded"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="usuarioSeleccionado" class="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-start justify-center p-4 overflow-y-auto">
        <div class="bg-brand-anthracite w-full max-w-4xl my-8 rounded-3xl border border-white/10 shadow-2xl animate-in zoom-in duration-200">
          
          <div class="p-8 border-b border-white/5 flex justify-between items-center sticky top-0 bg-brand-anthracite/95 backdrop-blur-md rounded-t-3xl z-10">
            <div>
              <h3 class="text-3xl font-extrabold text-white tracking-tight">Ficha del Cliente</h3>
              <p class="text-primary font-medium text-lg">{{ usuarioSeleccionado.nombre }} {{ usuarioSeleccionado.apellidos }}</p>
            </div>
            <button (click)="usuarioSeleccionado = null" class="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all text-3xl leading-none">
              &times;
            </button>
          </div>
          
          <div class="p-8 space-y-10">
            <section>
              <h4 class="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4 ml-1">Información General</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p class="text-gray-500 text-[10px] uppercase font-bold mb-1">DNI</p>
                  <p class="text-white font-mono font-medium">{{ usuarioSeleccionado.dni }}</p>
                </div>
                <div class="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p class="text-gray-500 text-[10px] uppercase font-bold mb-1">Teléfono</p>
                  <p class="text-white font-medium">{{ usuarioSeleccionado.telefono }}</p>
                </div>
                <div class="bg-white/5 p-4 rounded-2xl border border-white/5 lg:col-span-2">
                  <p class="text-gray-500 text-[10px] uppercase font-bold mb-1">Email</p>
                  <p class="text-white font-medium">{{ usuarioSeleccionado.email }}</p>
                </div>
                <div class="bg-white/5 p-4 rounded-2xl border border-white/5 lg:col-span-2">
                  <p class="text-gray-500 text-[10px] uppercase font-bold mb-1">Dirección</p>
                  <p class="text-white font-medium">{{ usuarioSeleccionado.direccion }}</p>
                </div>
                <div class="bg-white/5 p-4 rounded-2xl border border-white/5 lg:col-span-2">
                  <p class="text-gray-500 text-[10px] uppercase font-bold mb-1">Rol</p>
                  <p class="text-white font-medium">{{ usuarioSeleccionado.rol }}</p>
                </div>
              </div>
            </section>

            <section>
              <h4 class="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4 ml-1">Vehículos Registrados</h4>
              <div *ngIf="usuarioSeleccionado.vehiculos?.length; else noVehiculos" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div *ngFor="let v of usuarioSeleccionado.vehiculos" class="bg-brand-dark p-5 rounded-2xl border-l-4 border-primary shadow-inner">
                  <p class="text-white font-bold text-lg">{{ v.marca }} {{ v.modelo }}</p>
                  <p class="text-brand-muted text-sm font-mono mt-1">{{ v.matricula }} • {{ v.motor }}</p>
                </div>
              </div>
              <ng-template #noVehiculos><p class="text-gray-600 italic ml-1">No tiene vehículos registrados.</p></ng-template>
            </section>

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
  private vehiculoService = inject(VehiculoService); // <--- AÑADE ESTE
  private citaService = inject(CitaService);
  private toastService = inject(ToastService);

  usuarios: Usuario[] = [];
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
    this.isLoading = true;
    this.usuarioService.obtenerTodosUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.isLoading = false;
      },
      error: () => {
        this.toastService.show('Error al cargar usuarios', 'error');
        this.isLoading = false;
      }
    });
  }

  verDetalles(usuario: Usuario) {
    this.usuarioService.obtenerUsuarioPorId(usuario.id).subscribe({
      next: (data) => this.usuarioSeleccionado = data,
      error: () => this.toastService.show('No se pudo obtener la ficha completa', 'error')
    });
  }

  buscarPorNombre(nombre: string) {
    if (!nombre) {
      this.cargarUsuarios();
      return;
    }
    this.isLoading = true;
    this.usuarioService.buscarUsuariosPorNombre(nombre).subscribe({
      next: (data) => {
        this.usuarios = data;
        this.isLoading = false;

        // Si el backend devuelve 200 OK pero la lista está vacía
        if (data.length === 0) {
          this.toastService.show('No se ha encontrado ningún usuario con ese nombre', 'error');
        }
      },
      error: () => {
        // Vaciamos la tabla de resultados
        this.usuarios = [];
        this.isLoading = false;

        // ¡AQUÍ ESTÁ LA CLAVE! 
        // Usamos toastService en lugar de alert() o SweetAlert
        this.toastService.show('No se ha encontrado ningún usuario con ese nombre', 'error');
      }
    });
  }

  mostrarFormularioNuevo() {
    this.usuarioEditando = null;
    this.usuarioForm.reset({ rol: 'CLIENTE' });
    this.usuarioForm.get('contrasena')?.setValidators([Validators.required]);
    this.usuarioForm.get('contrasena')?.updateValueAndValidity();
    this.mostrarFormulario = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  editarUsuario(usuario: Usuario) {
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

      // 1. Traemos todos los vehículos del sistema
      this.vehiculoService.listarTodosVehiculos().subscribe({
        next: (todosLosVehiculos: any[]) => {

          // 2. Filtramos los que pertenecen al usuario que queremos borrar
          // REVISA: v.usuarioId debe coincidir con el nombre del campo en tu modelo Java
          const vehiculosDelUsuario = todosLosVehiculos.filter(v => v.usuarioId === usuarioId);

          // 3. Si tiene vehículos, limpiamos sus citas y luego los borramos
          if (vehiculosDelUsuario.length > 0) {
            vehiculosDelUsuario.forEach((vehiculo: any) => {

              this.citaService.obtenerTodas().subscribe((todasLasCitas: any[]) => {
                // Filtramos las citas de este vehículo por su matrícula
                const citasDelCoche = todasLasCitas.filter(c => c.matriculaVehiculo === vehiculo.matricula);

                citasDelCoche.forEach((cita: any) => {
                  this.citaService.eliminarCita(cita.id).subscribe({
                    next: () => console.log(`Cita ${cita.id} borrada`),
                    error: () => console.log('Cita ya eliminada o error ignorado')
                  });
                });
                // Ponemos las citas en estado CANCELADA
                citasDelCoche.forEach((cita: any) => {
                  this.citaService.cambiarEstado(cita.id, 'CANCELADA').subscribe();
                });

                // Borramos el vehículo físicamente
                this.vehiculoService.eliminarVehiculo(vehiculo.id).subscribe();
              });
            });
          }

          // 4. El paso final: Borrar al usuario
          // Esperamos 1.5 segundos para que al servidor le dé tiempo a borrar los vehículos
          // 4. El paso final dentro de tu función eliminarUsuario
          setTimeout(() => {
            this.usuarioService.eliminarUsuario(usuarioId).subscribe({
              next: () => {
                // Si entra aquí, es que el backend devolvió un JSON perfecto
                this.toastService.show('Usuario eliminado correctamente', 'success');
                this.cargarUsuarios();
              },
              error: (err) => {
                // CASO ESPECIAL: Si el status es 200, ¡ES QUE HA FUNCIONADO!
                if (err.status === 200) {
                  this.toastService.show('Usuario eliminado con éxito', 'success');
                  this.cargarUsuarios();
                }
                // Si el error es 404, revisa la ruta en tu UsuarioService
                else if (err.status === 404) {
                  this.toastService.show('Error: No se encuentra la ruta de borrado en el servidor (404)', 'error');
                  console.error('Revisa la URL en UsuarioService.eliminarUsuario. La URL intentada fue:', err.url);
                }
                else {
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