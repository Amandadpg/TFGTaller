import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CitaService } from '../../../../core/services/cita/cita.service';
import { VehiculoService } from '../../../../core/services/vehiculo/vehiculo.service';
import { ServicioService } from '../../../../core/services/servicio/servicio.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Vehiculo } from '../../../../core/models/vehiculo.model';
import { Servicio } from '../../../../core/models/servicio.model';
import { ToastService } from '../../../../core/services/toast/toast.service';

@Component({
  selector: 'app-reservar-cita',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-3xl mx-auto p-8">
      <div class="bg-brand-anthracite rounded-2xl shadow-xl border border-gray-800 p-8">
        <h2 class="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          Reservar Cita
        </h2>

        <div *ngIf="servicioSeleccionado" class="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8 flex flex-col md:flex-row shadow-inner gap-6 items-center">
          <div class="flex-1">
            <h3 class="text-xl font-bold text-white mb-2">{{ servicioSeleccionado.nombreServicio }}</h3>
            <p class="text-brand-muted text-sm">{{ servicioSeleccionado.descripcion }}</p>
          </div>
          <div class="text-right whitespace-nowrap">
            <span class="block text-sm text-brand-muted mb-1">Precio</span>
            <span class="text-2xl font-black text-primary">{{ servicioSeleccionado.precio }}€</span>
          </div>
        </div>

        <form [formGroup]="citaForm" (ngSubmit)="reservar()" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-brand-muted text-sm font-medium mb-2">Selecciona un Vehículo</label>
              <select formControlName="matriculaVehiculo" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors">
                <option value="" disabled selected>Elige tu vehículo...</option>
                <option *ngFor="let v of vehiculos" [value]="v.matricula">{{ v.marca }} {{ v.modelo }} ({{ v.matricula }})</option>
              </select>
              <p *ngIf="vehiculos.length === 0" class="text-xs text-red-400 mt-2">No tienes vehículos registrados. Ve a <a routerLink="/mis-vehiculos" class="text-primary hover:underline">Mis Vehículos</a> para añadir uno.</p>
            </div>
            
            <div>
              <label class="block text-brand-muted text-sm font-medium mb-2">Fecha y Hora</label>
              <input type="datetime-local" formControlName="fechaHora" class="w-full bg-brand-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors">
            </div>
          </div>

          <div class="pt-6 border-t border-gray-800 flex justify-end gap-4">
            <button type="button" routerLink="/catalogo" class="px-6 py-3 text-brand-light bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors font-semibold">Cancelar</button>
            <button type="submit" [disabled]="citaForm.invalid || vehiculos.length === 0 || isSubmitting" class="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              <span *ngIf="isSubmitting" class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
              Confirmar Reserva
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ReservarCitaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private citaService = inject(CitaService);
  private vehiculoService = inject(VehiculoService);
  private servicioService = inject(ServicioService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  vehiculos: Vehiculo[] = [];
  servicioSeleccionado: Servicio | null = null;
  isSubmitting = false;

  citaForm = this.fb.group({
    matriculaVehiculo: ['', Validators.required],
    fechaHora: ['', Validators.required],
  });

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.vehiculoService.listarVehiculosPorUsuario(user.id).subscribe(data => {
        this.vehiculos = data;
      });
    }

    this.route.queryParams.subscribe(params => {
      if (params['servicioId']) {
        const id = Number(params['servicioId']);
        // Buscamos si ya están cargados para evitar refetch (fallback si recargan la página)
        if (this.servicioService.servicios().length === 0) {
          this.servicioService.cargarServicios(); // no devuelve promise, but updates signal
          // Para no complicarlo mucho en este flow local, podríamos iterar cuando cargue
          setTimeout(() => {
             this.servicioSeleccionado = this.servicioService.servicios().find(s => s.id === id) || null;
          }, 500);
        } else {
          this.servicioSeleccionado = this.servicioService.servicios().find(s => s.id === id) || null;
        }
      }
    });
  }

  reservar() {
    if (this.citaForm.invalid || !this.servicioSeleccionado) return;
    this.isSubmitting = true;

    // Split datetime-local into fecha (YYYY-MM-DD) and hora (HH:mm)
    const datetime = this.citaForm.value.fechaHora;
    const [fecha, horaCompleta] = datetime!.split('T');
    const hora = horaCompleta.substring(0, 5); // take HH:mm

    const request = {
      fecha: fecha,
      hora: hora,
      matriculaVehiculo: this.citaForm.value.matriculaVehiculo,
      nombreServicio: this.servicioSeleccionado.nombreServicio
    };

    this.citaService.reservar(request).subscribe({
      next: () => {
        this.toastService.show('Cita reservada correctamente', 'success');
        this.isSubmitting = false;
        this.router.navigate(['/client-dashboard']); // O a Mis citas
      },
      error: (err) => {
        this.toastService.show('Error al reservar la cita. Quizás haya solapamiento.', 'error');
        this.isSubmitting = false;
      }
    });
  }
}
