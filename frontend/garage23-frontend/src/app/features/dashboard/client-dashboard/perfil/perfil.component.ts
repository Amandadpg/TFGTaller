import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { UsuarioService } from '../../../../core/services/usuario/usuario.service';
import { VehiculoService } from '../../../../core/services/vehiculo/vehiculo.service';
import { CitaService } from '../../../../core/services/cita/cita.service';
import { ToastService } from '../../../../core/services/toast/toast.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private vehiculoService = inject(VehiculoService);
  private citaService = inject(CitaService);
  private toastService = inject(ToastService);

  tabActiva: string = 'datos';
  editandoDatos: boolean = false;

  perfilForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    apellidos: ['', Validators.required],
    dni: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.pattern('^[0-9]{9}$')]],
    direccion: ['']
  });

  usuarioId!: number;
  misVehiculos: any[] = [];
  misCitas: any[] = [];

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.usuarioId = user.id;
      this.cargarPerfilCompleto();
      this.cargarHistorial();
    }
  }

  cargarPerfilCompleto() {
    this.usuarioService.obtenerUsuarioPorId(this.usuarioId).subscribe({
      next: (user) => {
        this.perfilForm.patchValue({
          nombre: user.nombre || '',
          apellidos: user.apellidos || '',
          dni: user.dni || '',
          email: user.email || '',
          telefono: user.telefono || '',
          direccion: user.direccion || ''
        });
        this.perfilForm.disable();
      }
    });
  }

  cargarHistorial() {
    this.vehiculoService.obtenerMisVehiculos().subscribe(res => this.misVehiculos = res);

    // Cargar citas y ordenarlas por fecha y hora (de más inminente a más lejana)
    this.citaService.obtenerMisCitas().subscribe(res => {
      this.misCitas = res.sort((a: any, b: any) => {
        const fechaA = new Date(a.fecha + 'T' + a.hora).getTime();
        const fechaB = new Date(b.fecha + 'T' + b.hora).getTime();
        return fechaA - fechaB;
      });
    });
  }

  cancelarCita(idCita: number) {
    if (confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
      this.citaService.cancelarCita(idCita).subscribe({
        next: () => {
          this.toastService.show('Cita cancelada con éxito', 'success');
          this.cargarHistorial();
        },
        error: () => this.toastService.show('Error al cancelar la cita', 'error')
      });
    }
  }

  activarEdicion() {
    this.editandoDatos = true;
    this.perfilForm.enable();
  }

  cancelarEdicion() {
    this.editandoDatos = false;
    this.perfilForm.disable();
    this.cargarPerfilCompleto();
  }

  guardarDatos() {
    if (this.perfilForm.valid) {
      this.usuarioService.modificarUsuario(this.usuarioId, this.perfilForm.getRawValue()).subscribe({
        next: () => {
          this.toastService.show('¡Datos actualizados correctamente!', 'success');
          this.cancelarEdicion();
        },
        error: (err) => {
          const mensaje = typeof err.error === 'string' ? err.error : err.error?.message;
          this.toastService.show('Error: ' + (mensaje || 'No se pudo guardar'), 'error');
        }
      });
    } else {
      this.toastService.show('Revisa los campos. El teléfono debe tener 9 números.', 'warning');
    }
  }

  cerrarSesion() { this.authService.logout(); }
  cambiarTab(t: string) { this.tabActiva = t; }
}