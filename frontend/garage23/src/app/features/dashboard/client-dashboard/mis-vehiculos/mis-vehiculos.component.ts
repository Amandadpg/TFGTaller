import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehiculoService } from '../../../../core/services/vehiculo/vehiculo.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ToastService } from '../../../../core/services/toast/toast.service'; // <-- IMPORTADO

@Component({
  selector: 'app-mis-vehiculos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-vehiculos.component.html'
})
export class MisVehiculosComponent implements OnInit {
  private vehiculoService = inject(VehiculoService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService); // <-- INYECTADO

  vehiculos: any[] = [];
  modoEdicion: boolean = false;

  vehiculoActual: any = {
    id: null,
    marca: '',
    modelo: '',
    matricula: '',
    tipo: 'COCHE'
  };

  ngOnInit() {
    this.cargarVehiculos();
  }

  cargarVehiculos() {
    this.vehiculoService.obtenerMisVehiculos().subscribe({
      next: (data: any) => {
        this.vehiculos = data;
      },
      error: () => this.toastService.show('Error al cargar tu garaje', 'error')
    });
  }

  guardarVehiculo() {
    const payloadVehiculo = {
      matricula: this.vehiculoActual.matricula,
      marca: this.vehiculoActual.marca,
      modelo: this.vehiculoActual.modelo,
      tipo: this.vehiculoActual.tipo || 'COCHE',
      dniCliente: ''
    };

    if (this.modoEdicion) {
      this.vehiculoService.modificarVehiculo(this.vehiculoActual.id, payloadVehiculo).subscribe({
        next: (vehiculoActualizado: any) => {
          const index = this.vehiculos.findIndex(v => v.id === this.vehiculoActual.id);
          if (index !== -1) {
            this.vehiculos[index] = { ...this.vehiculos[index], ...vehiculoActualizado };
          }
          this.toastService.show('¡Vehículo actualizado correctamente!', 'success'); // <-- ÉXITO
          this.resetearFormulario();
        },
        error: () => this.toastService.show('Error al actualizar el vehículo', 'error') // <-- ERROR
      });
    } else {
      this.vehiculoService.darAltaVehiculo(payloadVehiculo).subscribe({
        next: (vehiculoCreado: any) => {
          const cocheVisual = { ...vehiculoCreado };
          this.vehiculos.push(cocheVisual);
          this.toastService.show('¡Nuevo vehículo añadido a tu garaje!', 'success'); // <-- ÉXITO
          this.resetearFormulario();
        },
        error: () => this.toastService.show('Error al registrar el vehículo. Comprueba la matrícula.', 'error') // <-- ERROR
      });
    }
  }

  editarVehiculo(coche: any) {
    this.modoEdicion = true;
    this.vehiculoActual = { ...coche };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminarVehiculo(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este vehículo de tu garaje VIP? Esta acción no se puede deshacer.')) {
      this.vehiculoService.eliminarVehiculo(id).subscribe({
        next: () => {
          this.vehiculos = this.vehiculos.filter(v => v.id !== id);
          this.toastService.show('Vehículo eliminado de tu colección', 'success'); // <-- ÉXITO
        },
        error: () => {
          this.toastService.show('No se pudo eliminar. Puede que tenga citas pendientes.', 'error'); // <-- ERROR
        }
      });
    }
  }

  resetearFormulario() {
    this.modoEdicion = false;
    this.vehiculoActual = { id: null, marca: '', modelo: '', matricula: '', tipo: 'COCHE' };
  }
}