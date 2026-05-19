import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Cita } from '../../models/cita.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private api = inject(ApiService);

  obtenerCitasPorUsuario(usuarioId: number): Observable<any[]> {
    // Ajusta la URL si tu backend espera otra cosa
    return this.api.get<any[]>(`/citas?usuarioId=${usuarioId}`);
  }

  obtenerHorasOcupadas(fecha: string): Observable<string[]> {
    return this.api.get<string[]>(`/citas/horas-ocupadas?fecha=${fecha}`);
  }

  // Llama a la ruta PATCH que cambia el estado
  cancelarCita(idCita: number): Observable<any> {
    return this.api.patch(`/citas/${idCita}/estado?nuevoEstado=CANCELADA`, {});
  }

  obtenerMisCitas(): Observable<any[]> {
    return this.api.get<any[]>('/citas/mis-citas');
  }
  obtenerTodas(): Observable<any[]> {
    return this.api.get<any[]>('/citas');
  }

  buscarPorId(id: number): Observable<Cita> {
    return this.api.get<Cita>(`/citas/${id}`);
  }

  buscarPorNombre(nombre: string): Observable<Cita[]> {
    return this.api.get<Cita[]>(`/citas/buscar?nombre=${nombre}`);
  }

  crearCita(cita: any): Observable<Cita> {
    return this.api.post<Cita>('/citas/reservar', cita);
  }

  // The backend uses PATCH. We need to add patch to api service. Let's assume we update apiService next.
  cambiarEstado(id: number, nuevoEstado: string): Observable<Cita> {
    return this.api.patch<Cita>(`/citas/${id}/estado?nuevoEstado=${nuevoEstado}`, {});
  }

  modificarAdmin(id: number, cita: any): Observable<Cita> {
    return this.api.put<Cita>(`/citas/${id}/admin`, cita);
  }

  modificarCitaCliente(id: number, cita: any): Observable<Cita> {
    return this.api.put<Cita>(`/citas/${id}/cliente`, cita);
  }

  eliminarCita(id: number): Observable<any> {
    return this.api.delete<any>(`/citas/${id}`, { responseType: 'text' });
  }
}
