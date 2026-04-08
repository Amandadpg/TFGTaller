import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen w-full bg-gray-50 overflow-hidden font-sans">
      <app-sidebar></app-sidebar>
      <div class="flex flex-col flex-1 overflow-hidden h-full">
        <app-header></app-header>
        <main class="flex-1 overflow-y-auto bg-slate-50 relative p-6">
          <div class="mx-auto w-full max-w-7xl animate-fade-in">
            <router-outlet></router-outlet>
          </div>
        </main>
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
export class MainLayoutComponent {}
