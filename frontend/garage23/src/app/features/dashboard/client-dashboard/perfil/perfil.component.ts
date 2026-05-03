import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { UsuarioService } from '../../../../core/services/usuario/usuario.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { MisVehiculosComponent } from '../mis-vehiculos/mis-vehiculos.component';
import { CitaService } from '../../../../core/services/cita/cita.service';
import { VehiculoService } from '../../../../core/services/vehiculo/vehiculo.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MisVehiculosComponent],
  template: `
    <div class="max-w-7xl mx-auto p-6 lg:p-12 min-h-screen">
      
      <div class="mb-10">
        <h2 class="text-3xl font-black text-white uppercase tracking-widest flex items-center gap-3">
          Centro del Cliente
        </h2>
        <p class="text-gray-400 mt-2">Gestiona tu información personal, tus vehículos y el estado de tus citas.</p>
      </div>

      <!-- TABS -->
      <div class="flex flex-wrap gap-2 mb-8 border-b border-gray-800 pb-px">
        <button (click)="activeTab = 'datos'" [class.bg-primary]="activeTab === 'datos'" [class.text-white]="activeTab === 'datos'" [class.text-gray-400]="activeTab !== 'datos'"
                class="px-8 py-3 rounded-t-lg font-black uppercase tracking-widest text-sm transition-all hover:bg-gray-900 border border-transparent" [class.border-gray-800]="activeTab === 'datos'">
          Mis Datos
        </button>
        <button (click)="activeTab = 'vehiculos'" [class.bg-primary]="activeTab === 'vehiculos'" [class.text-white]="activeTab === 'vehiculos'" [class.text-gray-400]="activeTab !== 'vehiculos'"
                class="px-8 py-3 rounded-t-lg font-black uppercase tracking-widest text-sm transition-all hover:bg-gray-900 border border-transparent" [class.border-gray-800]="activeTab === 'vehiculos'">
          Mis Vehículos
        </button>
        <button (click)="activeTab = 'citas'" [class.bg-primary]="activeTab === 'citas'" [class.text-white]="activeTab === 'citas'" [class.text-gray-400]="activeTab !== 'citas'"
                class="px-8 py-3 rounded-t-lg font-black uppercase tracking-widest text-sm transition-all hover:bg-gray-900 border border-transparent" [class.border-gray-800]="activeTab === 'citas'">
          Mis Citas
        </button>
      </div>

      <!-- TAB 1: DATOS -->
      <div *ngIf="activeTab === 'datos'" class="bg-[#111] rounded-2xl shadow-2xl border border-gray-800 p-8 animate-fade-in">
        <h3 class="text-xl font-bold text-white mb-6 uppercase tracking-wider">Información Personal</h3>
        
        <form [formGroup]="perfilForm" (ngSubmit)="guardarCambios()" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Nombre</label>
              <input type="text" formControlName="nombre" class="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors">
            </div>
            <div>
              <label class="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Apellidos</label>
              <input type="text" formControlName="apellidos" class="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors">
            </div>
            <div>
              <label class="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">DNI</label>
              <input type="text" formControlName="dni" class="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-gray-600 cursor-not-allowed" title="El DNI no se puede modificar">
            </div>
            <div>
              <label class="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Correo Electrónico</label>
              <input type="email" formControlName="email" class="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors">
            </div>
          </div>

          <div class="pt-6 border-t border-gray-800/50 flex justify-end">
            <button type="submit" [disabled]="perfilForm.invalid || isSubmitting" class="bg-primary hover:bg-primary/90 text-white font-black py-3 px-10 rounded-none shadow-[0_0_15px_rgba(232,32,187,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm">
              <span *ngIf="isSubmitting">Guardando...</span>
              <span *ngIf="!isSubmitting">Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>

      <!-- TAB 2: VEHICULOS -->
      <div *ngIf="activeTab === 'vehiculos'" class="animate-fade-in -mx-8 -my-8">
        <!-- Reusamos el componente standalone existente -->
        <app-mis-vehiculos></app-mis-vehiculos>
      </div>

      <!-- TAB 3: CITAS -->
      <div *ngIf="activeTab === 'citas'" class="bg-[#111] rounded-2xl shadow-2xl border border-gray-800 p-8 animate-fade-in">
        <h3 class="text-xl font-bold text-white mb-6 uppercase tracking-wider flex items-center justify-between">
          <span>Historial de Citas</span>
          <button (click)="cargarCitas()" class="text-xs text-primary font-black uppercase tracking-widest hover:text-white transition-colors">Actualizar</button>
        </h3>
        
        <div *ngIf="isLoadingCitas" class="text-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto"></div>
        </div>

        <div *ngIf="!isLoadingCitas && misCitas.length === 0" class="text-center py-16 bg-black rounded-xl border border-gray-800 border-dashed">
          <p class="text-gray-500 font-medium tracking-wide">No tienes citas programadas.</p>
        </div>

        <div class="space-y-4">
          <div *ngFor="let cita of misCitas" class="bg-black p-6 rounded-xl border border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-primary/50 transition-colors">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <span class="bg-gray-900 text-primary px-3 py-1 text-xs font-black uppercase tracking-widest rounded">{{ cita.fecha | date:'dd MMM yyyy' }}</span>
                <span class="text-white font-black">{{ cita.hora }}</span>
                <span [ngClass]="{
                  'bg-green-500/10 text-green-500 border-green-500/20': cita.estado === 'COMPLETADA',
                  'bg-yellow-500/10 text-yellow-500 border-yellow-500/20': cita.estado === 'PENDIENTE',
                  'bg-blue-500/10 text-blue-500 border-blue-500/20': cita.estado === 'CONFIRMADA',
                  'bg-red-500/10 text-red-500 border-red-500/20': cita.estado === 'CANCELADA'
                }" class="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest border rounded">
                  {{ cita.estado }}
                </span>
              </div>
              <p class="text-white font-bold">{{ cita.servicio || 'Servicio General' }}</p>
              <p class="text-gray-500 text-sm font-mono mt-1">Matrícula: {{ cita.matriculaVehiculo }}</p>
            </div>
            
            <div *ngIf="cita.estado === 'PENDIENTE' || cita.estado === 'CONFIRMADA'">
              <button (click)="cancelarCita(cita.id)" class="px-4 py-2 text-xs font-black uppercase tracking-widest text-red-500 hover:text-white hover:bg-red-500 border border-red-500 rounded transition-all">
                Cancelar Cita
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.4s ease-out forwards;
    }
  `]
})
export class PerfilComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private toastService = inject(ToastService);
  private citaService = inject(CitaService);
  private vehiculoService = inject(VehiculoService);

  activeTab: 'datos' | 'vehiculos' | 'citas' = 'datos';

  perfilForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    apellidos: ['', Validators.required],
    dni: [{value: '', disabled: true}],
    email: ['', [Validators.required, Validators.email]]
  });

  isSubmitting = false;
  usuarioId!: number;

  misCitas: any[] = [];
  isLoadingCitas = false;

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.usuarioId = user.id;
      this.perfilForm.patchValue({
        nombre: user.nombre,
        apellidos: user.apellidos,
        dni: user.dni,
        email: user.email
      });
      this.cargarCitas();
    }
  }

  guardarCambios() {
    if (this.perfilForm.valid) {
      this.isSubmitting = true;
      const data = this.perfilForm.getRawValue();
      this.usuarioService.modificarUsuario(this.usuarioId, data).subscribe({
        next: (user) => {
          this.toastService.show('Perfil actualizado correctamente', 'success');
          this.isSubmitting = false;
        },
        error: () => {
          this.toastService.show('Error al actualizar el perfil', 'error');
          this.isSubmitting = false;
        }
      });
    }
  }

  cargarCitas() {
    this.isLoadingCitas = true;
    
    this.vehiculoService.listarVehiculosPorUsuario(this.usuarioId).subscribe({
      next: (vehiculos) => {
        const misMatriculas = vehiculos.map((v: any) => v.matricula);
        
        this.citaService.obtenerTodas().subscribe({
          next: (todasLasCitas) => {
            // Filtramos solo las citas de los vehículos del usuario
            this.misCitas = todasLasCitas.filter((c: any) => misMatriculas.includes(c.matriculaVehiculo));
            
            // Ordenamos por fecha descendente
            this.misCitas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
            
            this.isLoadingCitas = false;
          },
          error: () => {
            this.toastService.show('Error al cargar historial de citas', 'error');
            this.isLoadingCitas = false;
          }
        });
      },
      error: () => {
        this.isLoadingCitas = false;
      }
    });
  }

  cancelarCita(id: number) {
    if (confirm('¿Estás seguro de cancelar esta cita?')) {
      this.citaService.cambiarEstado(id, 'CANCELADA').subscribe({
        next: () => {
          this.toastService.show('Cita cancelada', 'info');
          this.cargarCitas();
        },
        error: () => {
          this.toastService.show('Error al cancelar cita', 'error');
        }
      });
    }
  }
}
