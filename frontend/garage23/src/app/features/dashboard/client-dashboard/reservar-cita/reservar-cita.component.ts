import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

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
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reservar-cita.component.html'
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
  serviciosLista: Servicio[] = [];
  servicioSeleccionado: Servicio | null = null;
  isSubmitting = false;

  // Todas las horas que trabaja el taller
  todasLasHoras: string[] = ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'];
  // Las horas que mostraremos en el desplegable (se irán borrando las ocupadas)
  horasDisponibles: string[] = [];
  fechaMinima: string = '';

  citaForm = this.fb.group({
    servicioId: ['', Validators.required],
    vehiculoId: ['', Validators.required],
    fecha: ['', Validators.required],
    hora: [{ value: '', disabled: true }, Validators.required] // Empieza bloqueado hasta elegir fecha
  });

  ngOnInit() {
    // 1. Fecha mínima (Hoy)
    const hoy = new Date();
    this.fechaMinima = hoy.toISOString().split('T')[0];
    this.horasDisponibles = [...this.todasLasHoras];

    const user = this.authService.currentUser();

    if (user) {
      this.vehiculoService.obtenerMisVehiculos().subscribe({
        next: (data) => {
          this.vehiculos = data;
          console.log("Vehículos listos para reservar:", data);
        },
        error: (err) => console.error("Error cargando vehículos", err)
      });
    }

    // 3. Cargar Servicios
    this.servicioService.obtenerTodos().subscribe({
      next: (data) => this.serviciosLista = data,
      error: (err) => console.error("Error cargando servicios", err)
    });

    // 4. Mostrar precio dinámico al elegir servicio
    this.citaForm.get('servicioId')?.valueChanges.subscribe(id => {
      this.servicioSeleccionado = this.serviciosLista.find(s => s.id === Number(id)) || null;
    });

    // 5. ¡LA MAGIA DE LAS HORAS! Si el usuario cambia la fecha, buscamos ocupadas
    this.citaForm.get('fecha')?.valueChanges.subscribe(fechaElegida => {
      if (fechaElegida) {
        // Desbloqueamos el desplegable de horas
        this.citaForm.get('hora')?.enable();
        this.citaForm.get('hora')?.setValue(''); // Reseteamos la hora elegida

        // Preguntamos a Java qué horas están pilladas
        this.citaService.obtenerHorasOcupadas(fechaElegida).subscribe({
          next: (horasOcupadas) => {
            // Filtramos: Nos quedamos solo con las horas que NO están en la lista de ocupadas
            this.horasDisponibles = this.todasLasHoras.filter(h => !horasOcupadas.includes(h));

            if (this.horasDisponibles.length === 0) {
              this.toastService.show('Ese día está completo. Por favor, elige otro.', 'warning');
              this.citaForm.get('hora')?.disable();
            }
          },
          error: () => {
            this.toastService.show('Error al consultar disponibilidad', 'error');
          }
        });
      }
    });
  }

  reservar() {
    if (this.citaForm.invalid) {
      this.toastService.show('Rellena todos los campos', 'error');
      return;
    }

    this.isSubmitting = true;

    // Aseguramos que los IDs sean números reales
    const servicioElegidoId = Number(this.citaForm.get('servicioId')?.value);
    const vehiculoElegidoId = Number(this.citaForm.get('vehiculoId')?.value);

    // ESTE ES EL CHIVATO - Míralo en la consola (F12)
    console.log("🛠️ ID del Servicio que Angular va a enviar:", servicioElegidoId);

    const request = {
      fecha: this.citaForm.get('fecha')?.value,
      hora: this.citaForm.get('hora')?.value,
      vehiculoId: vehiculoElegidoId,
      servicioId: servicioElegidoId,
      estado: 'PENDIENTE'
    };

    this.citaService.crearCita(request).subscribe({
      next: () => {
        this.toastService.show('Cita reservada correctamente', 'success');
        this.isSubmitting = false;

        // ¡CORREGIDO! Ahora te lleva al Dashboard del cliente
        this.router.navigate(['/client-dashboard']);
      },
      error: (err) => {
        this.toastService.show('Error al reservar la cita.', 'error');
        this.isSubmitting = false;
      }
    });
  }
}