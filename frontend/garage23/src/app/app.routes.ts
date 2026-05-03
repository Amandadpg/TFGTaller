import { Routes } from '@angular/router';
import { WebLayoutComponent } from './core/layout/web-layout/web-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth/auth.service';

// GUARD: Redirige si el usuario ya está logueado
const postLoginRedirectGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    const role = auth.currentUser()?.rol;
    if (role === 'ADMIN') return router.parseUrl('/admin/dashboard');
    if (role === 'CLIENTE') return router.parseUrl('/mi-perfil'); // Cambiado a mi-perfil ya que unificamos
  }
  return true; // Permite el acceso a landing/login si no está autenticado
};

export const routes: Routes = [
  // ==========================================
  // ZONA WEB (Landing y Cliente)
  // ==========================================
  {
    path: '',
    component: WebLayoutComponent,
    children: [
      // Pública
      {
        path: '',
        pathMatch: 'full',
        canActivate: [postLoginRedirectGuard],
        loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
      },
      // Cliente (Protegidas)
      {
        path: 'client-dashboard',
        canActivate: [authGuard],
        redirectTo: 'mi-perfil', // Redirigimos el antiguo dashboard al perfil
        pathMatch: 'full'
      },
      {
        path: 'mi-perfil',
        canActivate: [authGuard],
        loadComponent: () => import('./features/dashboard/client-dashboard/perfil/perfil.component').then(c => c.PerfilComponent)
      },
      {
        path: 'mis-vehiculos',
        canActivate: [authGuard],
        loadComponent: () => import('./features/dashboard/client-dashboard/mis-vehiculos/mis-vehiculos.component').then(c => c.MisVehiculosComponent)
      },
      {
        path: 'catalogo',
        canActivate: [authGuard],
        redirectTo: '', // El catálogo ahora está en el Home
        pathMatch: 'full'
      },
      {
        path: 'reservar',
        canActivate: [authGuard],
        loadComponent: () => import('./features/dashboard/client-dashboard/reservar-cita/reservar-cita.component').then(c => c.ReservarCitaComponent)
      }
    ]
  },

  // ==========================================
  // RUTAS AUTH (Sin Navbar)
  // ==========================================
  {
    path: 'login',
    canActivate: [postLoginRedirectGuard],
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'registro',
    canActivate: [postLoginRedirectGuard],
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
  },

  // ==========================================
  // ZONA ADMIN (Usa el Sidebar Negro/Rosa)
  // ==========================================
  {
    path: 'admin',
    loadComponent: () => import('./features/dashboard/admin-dashboard/admin-dashboard.component').then(c => c.AdminDashboardComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard', // URL: /admin/dashboard
        loadComponent: () => import('./features/dashboard/admin-dashboard/admin-stats.component').then(c => c.AdminStatsComponent),
      },
      {
        path: 'usuarios', // URL: /admin/usuarios
        loadComponent: () => import('./features/dashboard/admin-dashboard/admin-usuarios/admin-usuarios.component').then(c => c.AdminUsuariosComponent)
      },
      {
        path: 'vehiculos', // URL: /admin/vehiculos
        loadComponent: () => import('./features/dashboard/admin-dashboard/admin-vehiculos/admin-vehiculos.component').then(c => c.AdminVehiculosComponent)
      },
      {
        path: 'citas', // URL: /admin/citas
        loadComponent: () => import('./features/dashboard/admin-dashboard/admin-citas/admin-citas.component').then(c => c.AdminCitasComponent)
      },
      {
        path: 'servicios', // URL: /admin/servicios
        loadComponent: () => import('./features/dashboard/admin-dashboard/admin-servicios/admin-servicios.component').then(c => c.AdminServiciosComponent)
      },
      // Si entran a "/admin" a secas, los mandamos a las estadísticas
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ==========================================
  // RUTA POR DEFECTO (Error 404)
  // ==========================================
  { path: '**', redirectTo: '' }
];