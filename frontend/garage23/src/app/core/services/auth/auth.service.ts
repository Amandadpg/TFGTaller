import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Usuario } from '../../models/usuario.model';
import { environment } from '../../../../environments/environment';

export interface AuthResponse {
  token: string;
  user: Usuario;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  currentUser = signal<Usuario | null>(null);
  token = signal<string | null>(localStorage.getItem('token'));

  constructor() {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      try {
        this.currentUser.set(JSON.parse(storedUser));
      } catch (e) {
        this.logout();
      }
    }
  }

  login(credentials: { email: string; contrasena: string }): Observable<any> {
    const payload = { email: credentials.email, password: credentials.contrasena };
    return this.http.post<any>(`${this.baseUrl}/login`, payload).pipe(
      tap(response => {
        console.log('Login Response del backend:', response);
        const user = {
          id: response.userId,
          nombre: response.nombre,
          apellidos: '', // Falta en el DTO simplificado del AuthController
          dni: '',
          email: credentials.email,
          rol: response.rol
        } as Usuario;

        this.setAuth(response.accessToken, user);
      })
    );
  }

  getRoleRedirectPath(): string {
    const userRole = this.currentUser()?.rol as string;
    if (userRole === 'ADMIN' || userRole === 'ROLE_ADMIN') {
      return '/admin-dashboard';
    } else if (userRole === 'CLIENTE' || userRole === 'ROLE_CLIENTE') {
      return '/client-dashboard';
    }
    return '/login';
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/registro`, userData);
  }

  logout() {
    this.token.set(null);
    this.currentUser.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  private setAuth(token: string, user: Usuario) {
    this.token.set(token);
    this.currentUser.set(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  isAuthenticated(): boolean {
    return !!this.token();
  }
}
