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
    if (role === 'CLIENTE') return router.parseUrl('/client-dashboard');
  }
  return true;
};

export const routes: Routes = [
  // ==========================================
  // ZONA PÚBLICA (Landing Page)
  // ==========================================
  {
    path: '',
    pathMatch: 'full',
    canActivate: [postLoginRedirectGuard],
    loadComponent: () => import('./features/home-public/home-public.component').then(m => m.HomePublicComponent)
  },

  // ==========================================
  // RUTAS AUTH
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
  // ZONA WEB CLIENTE (Protegidas)
  // ==========================================
  {
    path: '',
    component: WebLayoutComponent,
    children: [
      {
        path: 'client-dashboard',
        canActivate: [authGuard],
        loadComponent: () => import('./features/dashboard/client-dashboard/client-dashboard.component').then(c => c.ClientDashboardComponent)
      },
      {
        path: 'servicios',
        canActivate: [authGuard],
        loadComponent: () => import('./features/dashboard/client-dashboard/servicios/servicios.component').then(c => c.ServiciosComponent)
      },
      {
        path: 'mi-perfil',
        canActivate: [authGuard],
        loadComponent: () => import('./features/dashboard/client-dashboard/perfil/perfil.component').then(c => c.PerfilComponent)
      },
      {
        path: 'sobre-nosotros',
        loadComponent: () => import('./features/dashboard/client-dashboard/sobre-nosotros/sobre-nosotros.component').then(c => c.SobreNosotrosComponent)
      },
      {
        path: 'noticias',
        loadComponent: () => import('./features/dashboard/client-dashboard/noticias/noticias.component').then(c => c.NoticiasComponent)
      },
      {
        path: 'noticias/:id',
        loadComponent: () => import('./features/dashboard/client-dashboard/noticias-detalle/noticias-detalle.component').then(c => c.NoticiaDetalleComponent)
      },
      {
        path: 'mis-vehiculos',
        canActivate: [authGuard],
        loadComponent: () => import('./features/dashboard/client-dashboard/mis-vehiculos/mis-vehiculos.component').then(c => c.MisVehiculosComponent)
      },
      {
        path: 'reservar',
        canActivate: [authGuard],
        loadComponent: () => import('./features/dashboard/client-dashboard/reservar-cita/reservar-cita.component').then(c => c.ReservarCitaComponent)
      },
    ]
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
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/admin-dashboard/admin-stats.component').then(c => c.AdminStatsComponent),
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./features/dashboard/admin-dashboard/admin-usuarios/admin-usuarios.component').then(c => c.AdminUsuariosComponent)
      },
      {
        path: 'vehiculos',
        loadComponent: () => import('./features/dashboard/admin-dashboard/admin-vehiculos/admin-vehiculos.component').then(c => c.AdminVehiculosComponent)
      },
      {
        path: 'citas',
        loadComponent: () => import('./features/dashboard/admin-dashboard/admin-citas/admin-citas.component').then(c => c.AdminCitasComponent)
      },
      {
        path: 'servicios',
        loadComponent: () => import('./features/dashboard/admin-dashboard/admin-servicios/admin-servicios.component').then(c => c.AdminServiciosComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ==========================================
  // RUTA POR DEFECTO (Error 404)
  // ==========================================
  { path: '**', redirectTo: '' }
];