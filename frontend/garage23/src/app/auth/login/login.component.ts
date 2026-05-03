import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { ToastService } from '../../core/services/toast/toast.service';

@Component({
  selector: 'app-login',
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
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Garage23AMG
        </h2>
        <p class="mt-4 text-center text-sm text-gray-400 font-medium tracking-widest uppercase">
          Inicia sesión para gestionar el taller
        </p>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in relative z-10">
        <div class="bg-black py-10 px-4 shadow-[0_0_40px_rgba(232,32,187,0.15)] sm:px-10 border border-white/10 relative overflow-hidden">
          
          <form class="space-y-8" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div>
              <label for="email" class="block text-sm font-semibold text-gray-300 uppercase tracking-wider"> Correo electrónico </label>
              <div class="mt-2 relative group">
                <input id="email" type="email" formControlName="email" 
                  class="bg-transparent text-white focus:ring-0 focus:border-primary block w-full pl-3 sm:text-lg border-white/20 border-b-2 border-t-0 border-r-0 border-l-0 py-3 transition-colors placeholder-gray-600" 
                  placeholder="admin@garage23.com">
              </div>
              @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                <p class="mt-2 text-xs text-primary font-bold flex items-center gap-1 uppercase tracking-wide">
                  El email es requerido y debe ser válido
                </p>
              }
            </div>

            <div>
              <label for="contrasena" class="block text-sm font-semibold text-gray-300 uppercase tracking-wider"> Contraseña </label>
              <div class="mt-2 relative group">
                <input id="contrasena" type="password" formControlName="contrasena" 
                  class="bg-transparent text-white focus:ring-0 focus:border-primary block w-full pl-3 sm:text-lg border-white/20 border-b-2 border-t-0 border-r-0 border-l-0 py-3 transition-colors placeholder-gray-600" 
                  placeholder="••••••••">
              </div>
              @if (loginForm.get('contrasena')?.invalid && loginForm.get('contrasena')?.touched) {
                <p class="mt-2 text-xs text-primary font-bold flex items-center gap-1 uppercase tracking-wide">
                  La contraseña debe tener mínimo 4 caracteres
                </p>
              }
            </div>

            <div class="pt-4">
              <button type="submit" [disabled]="loginForm.invalid || isLoading"
                class="w-full flex justify-center py-4 px-4 border border-transparent shadow-[0_0_20px_#E820BB] text-sm font-black text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-95 tracking-widest uppercase">
                @if (isLoading) {
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Conectando...
                } @else {
                  Entrar
                }
              </button>
            </div>
            
            <div class="mt-6 text-center pb-2">
              <a routerLink="/registro" class="text-sm font-semibold tracking-wider text-primary hover:text-white transition-colors duration-200">
                ¿No tienes cuenta? Regístrate aquí
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  isLoading = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(4)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value as any).subscribe({
        next: (res) => {
          this.toastService.show('Bienvenido', 'success');
          this.isLoading = false;
          
          console.log('[LoginComponent] Token asignado, ejecutando redirección explícita...');
          
          // Navegación post-login explícita según rol
          const userRole = this.authService.currentUser()?.rol as string;
          console.log('[LoginComponent] Rol detectado:', userRole);
          
          if (userRole === 'ADMIN' || userRole === 'ROLE_ADMIN') {
            this.router.navigate(['/admin/dashboard']);
          } else if (userRole === 'CLIENTE' || userRole === 'ROLE_CLIENTE') {
            this.router.navigate(['/client-dashboard']);
          } else {
            console.warn('[LoginComponent] Rol desconocido o no detectado, se redirige a /');
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          this.toastService.show('Credenciales incorrectas', 'error');
          this.isLoading = false;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
