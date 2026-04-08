import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Vehiculo } from '../../models/vehiculo.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  private api = inject(ApiService);

  listarTodosVehiculos(): Observable<Vehiculo[]> {
    return this.api.get<Vehiculo[]>('/vehiculos');
  }

  listarVehiculosPorUsuario(usuarioId: number): Observable<Vehiculo[]> {
    return this.api.get<Vehiculo[]>(`/vehiculos/usuario/${usuarioId}`);
  }

  buscarVehiculosPorMatricula(matricula: string): Observable<Vehiculo[]> {
    return this.api.get<Vehiculo[]>(`/vehiculos/buscar-matricula?matricula=${matricula}`);
  }

  buscarVehiculosPorMarca(marca: string): Observable<Vehiculo[]> {
    return this.api.get<Vehiculo[]>(`/vehiculos/buscar-marca?marca=${marca}`);
  }

  darAltaVehiculo(vehiculo: any): Observable<Vehiculo> {
    return this.api.post<Vehiculo>('/vehiculos/alta', vehiculo);
  }

  modificarVehiculo(vehiculoId: number, vehiculo: any): Observable<Vehiculo> {
    return this.api.put<Vehiculo>(`/vehiculos/${vehiculoId}`, vehiculo);
  }

  eliminarVehiculo(vehiculoId: number): Observable<string> {
    return this.api.delete<string>(`/vehiculos/${vehiculoId}`);
  }
}
