import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth/auth.service';

const postLoginRedirectGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAuthenticated()) {
    const role = auth.currentUser()?.rol;
    if (role === 'ADMIN') return router.parseUrl('/admin-dashboard');
    if (role === 'CLIENTE') return router.parseUrl('/client-dashboard');
  }
  return true; // Permite el acceso a landing/login si no está autenticado
};

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [postLoginRedirectGuard],
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
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
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { 
        path: 'client-dashboard', 
        loadComponent: () => import('./features/dashboard/client-dashboard/client-dashboard.component').then(c => c.ClientDashboardComponent) 
      },
      { 
        path: 'mi-perfil', 
        loadComponent: () => import('./features/dashboard/client-dashboard/perfil/perfil.component').then(c => c.PerfilComponent) 
      },
      { 
        path: 'mis-vehiculos', 
        loadComponent: () => import('./features/dashboard/client-dashboard/mis-vehiculos/mis-vehiculos.component').then(c => c.MisVehiculosComponent) 
      },
      { 
        path: 'catalogo', 
        loadComponent: () => import('./features/dashboard/client-dashboard/catalogo/catalogo.component').then(c => c.CatalogoComponent) 
      },
      { 
        path: 'reservar', 
        loadComponent: () => import('./features/dashboard/client-dashboard/reservar-cita/reservar-cita.component').then(c => c.ReservarCitaComponent) 
      },
      { 
        path: 'admin-dashboard', 
        loadComponent: () => import('./features/dashboard/admin-dashboard/admin-dashboard.component').then(c => c.AdminDashboardComponent) 
      },
      {
        path: 'admin-usuarios',
        loadComponent: () => import('./features/dashboard/admin-dashboard/admin-usuarios/admin-usuarios.component').then(c => c.AdminUsuariosComponent)
      },
      {
        path: 'admin-vehiculos',
        loadComponent: () => import('./features/dashboard/admin-dashboard/admin-vehiculos/admin-vehiculos.component').then(c => c.AdminVehiculosComponent)
      },
      {
        path: 'admin-citas',
        loadComponent: () => import('./features/dashboard/admin-dashboard/admin-citas/admin-citas.component').then(c => c.AdminCitasComponent)
      },
      {
        path: 'admin-servicios',
        loadComponent: () => import('./features/dashboard/admin-dashboard/admin-servicios/admin-servicios.component').then(c => c.AdminServiciosComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
