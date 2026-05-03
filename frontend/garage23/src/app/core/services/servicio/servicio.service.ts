import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Servicio } from '../../models/servicio.model';
import { ToastService } from '../toast/toast.service';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private api = inject(ApiService);
  private toastService = inject(ToastService);

  servicios = signal<Servicio[]>([]);
  isLoading = signal<boolean>(false);

  cargarServicios() {
    this.isLoading.set(true);
    this.api.get<Servicio[]>('/servicios/').subscribe({
      next: (data) => {
        this.servicios.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toastService.show('Error al cargar la lista de servicios', 'error');
        this.isLoading.set(false);
      }
    });
  }

  obtenerTodos(): Observable<any[]> {
    return this.api.get<any[]>('/servicios');
  }

  crearServicio(servicio: Partial<Servicio>) {
    return this.api.post<Servicio>('/servicios/', servicio);
  }

  actualizarServicio(id: number, servicio: Partial<Servicio>) {
    return this.api.put<Servicio>(`/servicios/${id}`, servicio);
  }

  eliminarServicio(id: number) {
    return this.api.delete<string>(`/servicios/${id}`, { responseType: 'json' });
  }

  buscarServiciosPorNombre(nombre: string) {
    return this.api.get<Servicio[]>(`/servicios/buscar?nombre=${nombre}`);
  }
}
