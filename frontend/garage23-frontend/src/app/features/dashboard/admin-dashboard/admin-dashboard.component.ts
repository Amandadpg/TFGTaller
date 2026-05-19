import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../../core/layout/header/header.component';
import { SidebarComponent } from '../../../core/layout/sidebar/sidebar.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <div class="flex h-screen bg-[#0a0a0a] text-white overflow-hidden relative">
      
      <div *ngIf="sidebarOpen" (click)="sidebarOpen = false" 
           class="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-opacity">
      </div>

      <app-sidebar [isOpen]="sidebarOpen" (closeMenu)="sidebarOpen = false" class="z-50"></app-sidebar>

      <main class="flex-1 flex flex-col overflow-hidden bg-[#0a0a0a] w-full">
        <app-header (toggleMenu)="sidebarOpen = !sidebarOpen"></app-header>

        <section id="main-content" class="flex-1 overflow-y-auto p-4 md:p-8">
          <div class="max-w-7xl mx-auto">
            <router-outlet></router-outlet>
          </div>
        </section>
      </main>

    </div>
  `
})
export class AdminDashboardComponent {
  sidebarOpen = false;
}