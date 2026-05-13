import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // <-- ¡ESTA ES LA CLAVE PARA LOS BOTONES!
import { VehiculoService } from '../../../../core/services/vehiculo/vehiculo.service';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
    selector: 'app-servicios',
    standalone: true,
    // ¡Fíjate que RouterLink está metido aquí dentro!
    imports: [CommonModule, RouterLink],
    templateUrl: './servicios.component.html'
})
export class ServiciosComponent implements OnInit {
    private vehiculoService = inject(VehiculoService);
    private authService = inject(AuthService);

    tieneVehiculos: boolean = false;

    ngOnInit() {
        // Comprobamos si el usuario tiene coches para mostrar un bloque u otro
        const user = this.authService.currentUser();
        if (user) {
            this.vehiculoService.obtenerMisVehiculos().subscribe({
                next: (vehiculos) => {
                    this.tieneVehiculos = vehiculos && vehiculos.length > 0;
                },
                error: () => {
                    this.tieneVehiculos = false;
                }
            });
        }
    }
}