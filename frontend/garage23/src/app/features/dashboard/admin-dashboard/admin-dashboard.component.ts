import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../../core/layout/header/header.component';
import { SidebarComponent } from '../../../core/layout/sidebar/sidebar.component'; // <-- ¡AQUÍ INYECTAMOS EL MENÚ REAL!

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <div class="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      
      <!-- MAGIA: Usamos el Sidebar oficial que acabamos de editar -->
      <app-sidebar></app-sidebar>

      <main class="flex-1 flex flex-col overflow-hidden bg-[#0a0a0a]">
        <!-- Cabecera oficial -->
        <app-header></app-header>

        <section id="main-content" class="flex-1 overflow-y-auto p-8">
          <div class="max-w-7xl mx-auto">
            <!-- Aquí dentro se cargan Citas, Usuarios, Vehículos, etc. -->
            <router-outlet></router-outlet>
          </div>
        </section>
      </main>

    </div>
  `
})
export class AdminDashboardComponent {
  // ¡Fíjate qué limpio! 
  // Ya no necesitamos la lista de 'navLinks' aquí porque el 'SidebarComponent' 
  // oficial ya sabe qué botones mostrar gracias al *ngIf="isAdmin()".
}