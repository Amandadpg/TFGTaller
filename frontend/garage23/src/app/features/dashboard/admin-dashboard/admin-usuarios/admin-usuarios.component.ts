import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../../core/services/usuario/usuario.service';
import { Usuario } from '../../../../core/models/usuario.model';
import { ToastService } from '../../../../core/services/toast/toast.service';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-8">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-bold text-brand-light flex items-center gap-3">
          <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          Gestión de Usuarios
        </h2>
        <button (click)="mostrarFormularioNuevo()" class="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-6 rounded-lg shadow-lg shadow-primary/20 transition-all">
          + Nuevo Usuario
        </button>
      </div>

      <!-- Buscador -->
      <div class="mb-6 flex gap-4">
        <input type="text" #buscadorNombre placeholder="Buscar usuario por nombre..." class="flex-1 bg-brand-anthracite border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 outline-none">
        <button (click)="buscarPorNombre(buscadorNombre.value)" class="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors border border-gray-700">Buscar</button>
        <button (click)="cargarUsuarios()" class="bg-gray-800 hover:bg-gray-700 text-brand-muted hover:text-white font-bold py-3 px-4 rounded-lg transition-colors border border-gray-700" title="Ver Todos">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        </button>
      </div>

      <!-- Formulario de Usuario -->
      <div *ngIf="mostrarFormulario" class="bg-brand-anthracite rounded-2xl shadow-xl border border-gray-800 p-6 mb-8">
        <h3 class="text-xl font-bold text-white mb-4">{{ usuarioEditando ? 'Editar Usuario' : 'Nuevo Usuario' }}</h3>
        <form [formGroup]="usuarioForm" (ngSubmit)="guardarUsuario()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="block text-brand-muted text-sm mb-1">Nombre</label>
            <input formControlName="nombre" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-primary">
          </div>
          <div>
            <label class="block text-brand-muted text-sm mb-1">Apellidos</label>
            <input formControlName="apellidos" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-primary">
          </div>
          <div>
            <label class="block text-brand-muted text-sm mb-1">DNI</label>
            <input formControlName="dni" [readOnly]="usuarioEditando" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-primary uppercase read-only:opacity-50">
          </div>
          <div>
            <label class="block text-brand-muted text-sm mb-1">Email</label>
            <input formControlName="email" type="email" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-primary">
          </div>
          <div *ngIf="!usuarioEditando">
            <label class="block text-brand-muted text-sm mb-1">Contraseña</label>
            <input formControlName="contrasena" type="password" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-primary">
          </div>
          <div>
            <label class="block text-brand-muted text-sm mb-1">Rol</label>
            <select formControlName="rol" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-primary">
              <option value="CLIENTE">Cliente</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          
          <div class="col-span-full flex justify-end gap-3 mt-4">
            <button type="button" (click)="cancelarFormulario()" class="px-6 py-2 text-brand-light bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">Cancelar</button>
            <button type="submit" [disabled]="usuarioForm.invalid" class="px-6 py-2 text-white bg-primary hover:bg-primary-hover rounded-lg disabled:opacity-50">Guardar</button>
          </div>
        </form>
      </div>

      <!-- Tabla de Usuarios -->
      <div class="bg-brand-anthracite rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-brand-light">
            <thead class="text-xs uppercase bg-gray-800 text-brand-muted border-b border-gray-700">
              <tr>
                <th class="px-6 py-4 font-medium">ID</th>
                <th class="px-6 py-4 font-medium">Nombre Completo</th>
                <th class="px-6 py-4 font-medium">DNI</th>
                <th class="px-6 py-4 font-medium">Email</th>
                <th class="px-6 py-4 font-medium">Rol</th>
                <th class="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngIf="isLoading" class="border-b border-gray-800">
                <td colspan="6" class="px-6 py-8 text-center text-brand-muted">Cargando usuarios...</td>
              </tr>
              <tr *ngFor="let u of usuarios" class="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                <td class="px-6 py-4 font-mono text-gray-500">#{{ u.id }}</td>
                <td class="px-6 py-4 font-medium text-white">{{ u.nombre }} {{ u.apellidos }}</td>
                <td class="px-6 py-4 font-mono tracking-wider">{{ u.dni }}</td>
                <td class="px-6 py-4">{{ u.email }}</td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 rounded text-xs font-bold" [ngClass]="u.rol === 'ADMIN' ? 'bg-primary/20 text-primary' : 'bg-blue-500/20 text-blue-400'">
                    {{ u.rol }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right flex justify-end gap-2">
                  <button (click)="editarUsuario(u)" class="p-2 text-brand-muted hover:text-white hover:bg-gray-700 rounded transition-colors" title="Editar"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                  <button (click)="eliminarUsuario(u.id)" class="p-2 text-brand-muted hover:text-red-500 hover:bg-red-500/10 rounded transition-colors" title="Eliminar"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminUsuariosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private toastService = inject(ToastService);

  usuarios: Usuario[] = [];
  isLoading = true;
  mostrarFormulario = false;
  usuarioEditando: Usuario | null = null;

  usuarioForm = this.fb.group({
    nombre: ['', Validators.required],
    apellidos: ['', Validators.required],
    dni: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    contrasena: [''], // Only required on create
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
      },
      error: () => {
        this.toastService.show('Error al buscar usuarios', 'error');
        this.isLoading = false;
      }
    });
  }

  mostrarFormularioNuevo() {
    this.usuarioEditando = null;
    this.usuarioForm.reset({ rol: 'CLIENTE' });
    this.usuarioForm.get('contrasena')?.setValidators([Validators.required]);
    this.usuarioForm.get('contrasena')?.updateValueAndValidity();
    this.mostrarFormulario = true;
  }

  editarUsuario(usuario: Usuario) {
    this.usuarioEditando = usuario;
    this.usuarioForm.patchValue({
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      dni: usuario.dni,
      email: usuario.email,
      rol: usuario.rol
    });
    this.usuarioForm.get('contrasena')?.clearValidators();
    this.usuarioForm.get('contrasena')?.updateValueAndValidity();
    this.mostrarFormulario = true;
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
          this.toastService.show('Usuario actualizado correctamente', 'success');
          this.cargarUsuarios();
          this.cancelarFormulario();
        },
        error: () => this.toastService.show('Error al actualizar usuario', 'error')
      });
    } else {
      this.usuarioService.registrar(data).subscribe({
        next: () => {
          this.toastService.show('Usuario creado correctamente', 'success');
          this.cargarUsuarios();
          this.cancelarFormulario();
        },
        error: () => this.toastService.show('Error al crear usuario', 'error')
      });
    }
  }

  eliminarUsuario(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.usuarioService.eliminarUsuario(id).subscribe({
        next: () => {
          this.toastService.show('Usuario eliminado', 'success');
          this.cargarUsuarios();
        },
        error: () => this.toastService.show('Error al eliminar usuario', 'error')
      });
    }
  }
}
