import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { ToastService } from '../../core/services/toast/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div class="absolute inset-0 z-0">
        <div class="w-full h-full bg-[radial-gradient(circle_at_center,rgba(232,32,187,0.1)_0,black_70%)]"></div>
      </div>
      
      <div class="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <h2 class="mt-6 text-center text-4xl font-black text-white tracking-widest flex items-center justify-center gap-3 uppercase">
          <svg class="w-12 h-12 text-primary drop-shadow-[0_0_15px_#E820BB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
          </svg>
          Registro GARAGE23AMG
        </h2>
        <p class="mt-4 text-center text-sm text-gray-400 font-medium tracking-widest uppercase">
          Crea tu cuenta de cliente
        </p>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-xl animate-fade-in relative z-10">
        <div class="bg-black py-10 px-4 shadow-[0_0_40px_rgba(232,32,187,0.15)] sm:px-10 border border-white/10 relative overflow-hidden">
          
          <form class="space-y-6" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Nombre -->
              <div>
                <label for="nombre" class="block text-sm font-semibold text-gray-300 uppercase tracking-wider"> Nombre </label>
                <div class="mt-2 relative">
                  <input id="nombre" type="text" formControlName="nombre" 
                    class="bg-transparent text-white focus:ring-0 focus:border-primary block w-full pl-3 sm:text-lg border-white/20 border-b-2 border-t-0 border-r-0 border-l-0 py-2 transition-colors placeholder-gray-600" 
                    placeholder="Juan">
                </div>
              </div>

              <!-- Apellidos -->
              <div>
                <label for="apellidos" class="block text-sm font-semibold text-gray-300 uppercase tracking-wider"> Apellidos </label>
                <div class="mt-2 relative">
                  <input id="apellidos" type="text" formControlName="apellidos" 
                    class="bg-transparent text-white focus:ring-0 focus:border-primary block w-full pl-3 sm:text-lg border-white/20 border-b-2 border-t-0 border-r-0 border-l-0 py-2 transition-colors placeholder-gray-600" 
                    placeholder="Pérez">
                </div>
              </div>
              
              <!-- DNI -->
              <div>
                <label for="dni" class="block text-sm font-semibold text-gray-300 uppercase tracking-wider"> DNI </label>
                <div class="mt-2 relative">
                  <input id="dni" type="text" formControlName="dni" 
                    class="bg-transparent text-white focus:ring-0 focus:border-primary block w-full pl-3 sm:text-lg border-white/20 border-b-2 border-t-0 border-r-0 border-l-0 py-2 transition-colors placeholder-gray-600" 
                    placeholder="12345678A">
                </div>
              </div>

              <!-- Teléfono -->
              <div>
                <label for="telefono" class="block text-sm font-semibold text-gray-300 uppercase tracking-wider"> Teléfono </label>
                <div class="mt-2 relative">
                  <input id="telefono" type="text" formControlName="telefono" 
                    class="bg-transparent text-white focus:ring-0 focus:border-primary block w-full pl-3 sm:text-lg border-white/20 border-b-2 border-t-0 border-r-0 border-l-0 py-2 transition-colors placeholder-gray-600" 
                    placeholder="600123456">
                </div>
              </div>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-semibold text-gray-300 uppercase tracking-wider"> Correo electrónico </label>
              <div class="mt-2 relative">
                <input id="email" type="email" formControlName="email" 
                  class="bg-transparent text-white focus:ring-0 focus:border-primary block w-full pl-3 sm:text-lg border-white/20 border-b-2 border-t-0 border-r-0 border-l-0 py-2 transition-colors placeholder-gray-600" 
                  placeholder="ejemplo@email.com">
              </div>
            </div>

            <!-- Dirección -->
            <div>
              <label for="direccion" class="block text-sm font-semibold text-gray-300 uppercase tracking-wider"> Dirección </label>
              <div class="mt-2 relative">
                <input id="direccion" type="text" formControlName="direccion" 
                  class="bg-transparent text-white focus:ring-0 focus:border-primary block w-full pl-3 sm:text-lg border-white/20 border-b-2 border-t-0 border-r-0 border-l-0 py-2 transition-colors placeholder-gray-600" 
                  placeholder="Calle Falsa 123">
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Contraseña -->
              <div>
                <label for="contrasena" class="block text-sm font-semibold text-gray-300 uppercase tracking-wider"> Contraseña </label>
                <div class="mt-2 relative">
                  <input id="contrasena" type="password" formControlName="contrasena" 
                    class="bg-transparent text-white focus:ring-0 focus:border-primary block w-full pl-3 sm:text-lg border-white/20 border-b-2 border-t-0 border-r-0 border-l-0 py-2 transition-colors placeholder-gray-600" 
                    placeholder="••••••••">
                </div>
              </div>

              <!-- Confirmar Contraseña -->
              <div>
                <label for="confirmarContrasena" class="block text-sm font-semibold text-gray-300 uppercase tracking-wider"> Confirmar </label>
                <div class="mt-2 relative">
                  <input id="confirmarContrasena" type="password" formControlName="confirmarContrasena" 
                    class="bg-transparent text-white focus:ring-0 focus:border-primary block w-full pl-3 sm:text-lg border-white/20 border-b-2 border-t-0 border-r-0 border-l-0 py-2 transition-colors placeholder-gray-600" 
                    placeholder="••••••••">
                </div>
              </div>
            </div>

            <div class="pt-6">
              <button type="submit" [disabled]="registerForm.invalid || isLoading"
                class="w-full flex justify-center py-4 px-4 border border-transparent shadow-[0_0_20px_#E820BB] text-sm font-black text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-95 tracking-widest uppercase">
                @if (isLoading) {
                  Registrando...
                } @else {
                  Crear Cuenta
                }
              </button>
            </div>
            
            <div class="mt-6 text-center pb-2">
              <a routerLink="/login" class="text-sm font-semibold tracking-wider text-primary hover:text-white transition-colors duration-200">
                ¿Ya tienes cuenta? Inicia sesión
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  isLoading = false;

  registerForm = this.fb.group({
    nombre: ['', Validators.required],
    apellidos: ['', Validators.required],
    dni: ['', [Validators.required, Validators.maxLength(10)]],
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
      const data = this.registerForm.value;
      this.authService.register(data).subscribe({
        next: () => {
          this.toastService.show('Usuario registrado correctamente. Ahora puedes iniciar sesión.', 'success');
          this.isLoading = false;
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.toastService.show('Error al registrar usuario: ' + (err.error?.message || err.message), 'error');
          this.isLoading = false;
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
