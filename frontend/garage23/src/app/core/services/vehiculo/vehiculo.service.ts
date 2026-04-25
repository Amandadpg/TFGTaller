import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Vehiculo } from '../../models/vehiculo.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  private api = inject(ApiService);
  private http = inject(HttpClient);

  listarTodosVehiculos(): Observable<Vehiculo[]> {
    return this.api.get<Vehiculo[]>('/vehiculos');
  }

  listarVehiculosPorUsuario(usuarioId: number): Observable<Vehiculo[]> {
    // Asegúrate de que esta URL sea la que acepta tu Spring Boot
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

  eliminarVehiculo(vehiculoId: number): Observable<any> {
    // Usamos this.http directamente para tener control total
    return this.http.delete(`http://localhost:8081/vehiculos/${vehiculoId}`, { responseType: 'text' });
  }
}
