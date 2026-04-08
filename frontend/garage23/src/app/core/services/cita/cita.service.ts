import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Cita } from '../../models/cita.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private api = inject(ApiService);

  obtenerTodas(): Observable<Cita[]> {
    return this.api.get<Cita[]>('/citas');
  }

  buscarPorId(id: number): Observable<Cita> {
    return this.api.get<Cita>(`/citas/${id}`);
  }

  buscarPorNombre(nombre: string): Observable<Cita[]> {
    return this.api.get<Cita[]>(`/citas/buscar?nombre=${nombre}`);
  }

  reservar(cita: any): Observable<Cita> {
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

  eliminarCita(id: number): Observable<string> {
    return this.api.delete<string>(`/citas/${id}`);
  }
}
