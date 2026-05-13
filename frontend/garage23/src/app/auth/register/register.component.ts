import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { ToastService } from '../../core/services/toast/toast.service'; // <-- Importado

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="h-screen w-full overflow-y-auto bg-black font-sans text-white">
      
      <div class="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(219,39,119,0.1)_0,black_80%)]"></div>

      <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 relative z-10">
        
        <div class="max-w-2xl w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-10 shadow-2xl">
          
          <div class="mb-8">
            <a routerLink="/" class="inline-flex items-center gap-2 text-zinc-400 hover:text-pink-600 transition-colors text-sm font-bold uppercase tracking-wider group">
              <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Volver al inicio
            </a>
          </div>

          <div class="text-center mb-8">
            <h2 class="text-3xl font-black tracking-widest uppercase mb-2">
              CREAR CUENTA <span class="text-pink-600">AMG</span>
            </h2>
            <p class="text-zinc-500 text-sm tracking-widest uppercase">Únete a Garage23AMG</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label class="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1">Nombre</label>
                <input type="text" formControlName="nombre" class="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-600 transition-colors" placeholder="Tu nombre">
              </div>

              <div>
                <label class="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1">Apellidos</label>
                <input type="text" formControlName="apellidos" class="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-600 transition-colors" placeholder="Tus apellidos">
              </div>

              <div>
                <label class="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1">DNI</label>
                <input type="text" formControlName="dni" class="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-600 transition-colors uppercase" placeholder="12345678X">
              </div>

              <div>
                <label class="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1">Teléfono</label>
                <input type="tel" formControlName="telefono" class="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-600 transition-colors" placeholder="600 000 000">
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1">Email</label>
              <input type="email" formControlName="email" class="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-600 transition-colors" placeholder="tu@email.com">
            </div>

            <div>
              <label class="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1">Dirección</label>
              <input type="text" formControlName="direccion" class="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-600 transition-colors" placeholder="Dirección completa">
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label class="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1">Contraseña</label>
                <input type="password" formControlName="contrasena" class="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-600 transition-colors" placeholder="••••••••">
              </div>

              <div>
                <label class="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1">Confirmar</label>
                <input type="password" formControlName="confirmarContrasena" class="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-600 transition-colors" placeholder="••••••••">
              </div>
            </div>

            <p *ngIf="registerForm.hasError('mismatch') && registerForm.get('confirmarContrasena')?.touched" class="text-pink-500 text-xs font-bold px-1">
              Las contraseñas no coinciden.
            </p>

            <button type="submit" [disabled]="registerForm.invalid || isLoading"
              class="w-full bg-pink-600 hover:bg-pink-700 text-white font-black py-4 rounded-xl transition-all active:scale-95 disabled:opacity-50 mt-6 uppercase tracking-widest text-sm flex justify-center items-center gap-2">
              <span *ngIf="!isLoading">Crear Cuenta</span>
              <span *ngIf="isLoading">Registrando...</span>
            </button>

            <p class="text-center text-zinc-500 text-sm mt-6">
              ¿Ya tienes cuenta? 
              <a routerLink="/login" class="text-pink-600 hover:text-pink-400 font-bold transition-colors">Inicia sesión</a>
            </p>

          </form>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastService = inject(ToastService); // <-- Inyectado

  isLoading = false;

  registerForm = this.fb.group({
    nombre: ['', Validators.required],
    apellidos: ['', Validators.required],
    dni: ['', Validators.required],
    telefono: ['', Validators.required],
    direccion: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(4)]],
    confirmarContrasena: ['', [Validators.required, Validators.minLength(4)]]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(g: FormGroup) {
    return g.get('contrasena')?.value === g.get('confirmarContrasena')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;

      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.toastService.show('¡Cuenta creada con éxito! Ya puedes iniciar sesión', 'success');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading = false;

          let mensajeError = 'Error al crear la cuenta. Comprueba tus datos.';

          // 1. Si Java manda el texto suelto (String puro)
          if (typeof err.error === 'string') {
            mensajeError = err.error;
          }
          // 2. Si Java manda un JSON y el texto está en "message"
          else if (err.error?.message) {
            mensajeError = err.error.message;
          }
          // 3. Si Java manda un JSON y el texto está en "error"
          else if (err.error?.error) {
            mensajeError = err.error.error;
          }

          // Mostramos el texto limpio en tu Toast
          this.toastService.show(mensajeError, 'error');
        }
      });

    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}