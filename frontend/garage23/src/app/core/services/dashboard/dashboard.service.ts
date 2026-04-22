import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Cita } from '../../models/cita.model';

export interface DashboardStats {
  totalUsuarios: number;
  totalVehiculos: number;
  citasPendientesHoy: number;
  ingresosEstimados: number;
  agenda: (Cita & { nombreUsuario?: string })[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin/dashboard/stats`;

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.apiUrl);
  }
}
