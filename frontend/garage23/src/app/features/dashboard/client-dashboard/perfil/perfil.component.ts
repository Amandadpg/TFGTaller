import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { UsuarioService } from '../../../../core/services/usuario/usuario.service';
import { ToastService } from '../../../../core/services/toast/toast.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-2xl mx-auto p-8">
      <div class="bg-brand-anthracite rounded-2xl shadow-xl border border-gray-800 p-8">
        <h2 class="text-2xl font-bold text-brand-light mb-6 flex items-center gap-3">
          <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          Mi Perfil
        </h2>
        
        <form [formGroup]="perfilForm" (ngSubmit)="guardarCambios()" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-brand-muted text-sm font-medium mb-2">Nombre</label>
              <input type="text" formControlName="nombre" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-3 text-brand-light focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors">
            </div>
            <div>
              <label class="block text-brand-muted text-sm font-medium mb-2">Apellidos</label>
              <input type="text" formControlName="apellidos" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-3 text-brand-light focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors">
            </div>
            <div>
              <label class="block text-brand-muted text-sm font-medium mb-2">DNI</label>
              <input type="text" formControlName="dni" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-3 text-brand-muted cursor-not-allowed" title="El DNI no se puede modificar">
            </div>
            <div>
              <label class="block text-brand-muted text-sm font-medium mb-2">Correo Electrónico</label>
              <input type="email" formControlName="email" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-3 text-brand-light focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors">
            </div>
          </div>

          <div class="pt-4 border-t border-gray-800 flex justify-end">
            <button type="submit" [disabled]="perfilForm.invalid || isSubmitting" class="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              <span *ngIf="isSubmitting" class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class PerfilComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private toastService = inject(ToastService);

  perfilForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    apellidos: ['', Validators.required],
    dni: [{value: '', disabled: true}],
    email: ['', [Validators.required, Validators.email]]
  });

  isSubmitting = false;
  usuarioId!: number;

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.usuarioId = user.id;
      this.perfilForm.patchValue({
        nombre: user.nombre,
        apellidos: user.apellidos,
        dni: user.dni,
        email: user.email
      });
    }
  }

  guardarCambios() {
    if (this.perfilForm.valid) {
      this.isSubmitting = true;
      const data = this.perfilForm.getRawValue(); // include disabled fields or not, we only send updates
      this.usuarioService.modificarUsuario(this.usuarioId, data).subscribe({
        next: (user) => {
          this.toastService.show('Perfil actualizado correctamente', 'success');
          // Update local storage via authService if needed
          this.isSubmitting = false;
        },
        error: () => {
          this.toastService.show('Error al actualizar el perfil', 'error');
          this.isSubmitting = false;
        }
      });
    }
  }
}
