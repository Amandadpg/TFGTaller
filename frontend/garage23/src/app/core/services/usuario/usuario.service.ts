import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Usuario } from '../../models/usuario.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private api = inject(ApiService);

  obtenerTodosUsuarios(): Observable<Usuario[]> {
    return this.api.get<Usuario[]>('/usuarios/');
  }

  obtenerUsuario(id: number): Observable<Usuario> {
    return this.api.get<Usuario>(`/usuarios/${id}`);
  }

  buscarUsuariosPorNombre(nombre: string): Observable<Usuario[]> {
    return this.api.get<Usuario[]>(`/usuarios/buscar?nombre=${nombre}`);
  }

  registrar(usuario: any): Observable<Usuario> {
    return this.api.post<Usuario>('/usuarios/registro', usuario);
  }

  modificarUsuario(id: number, usuario: any): Observable<Usuario> {
    return this.api.put<Usuario>(`/usuarios/${id}`, usuario);
  }

  cambiarContrasena(id: number, contrasenaData: any): Observable<any> {
    return this.api.put<any>(`/usuarios/${id}/contrasena`, contrasenaData); // Using PUT since ApiService only has PUT/POST/DELETE/GET mappings right now. I should add patch to apiService ideally, but I can bypass or we just use what we have. Actually the controller uses PatchMapping!
  }

  eliminarUsuario(id: number): Observable<string> {
    return this.api.delete<string>(`/usuarios/${id}`);
  }
}
