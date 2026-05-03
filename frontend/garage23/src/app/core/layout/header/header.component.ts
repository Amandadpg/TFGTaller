import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast/toast.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="h-16 bg-black shadow-md border-b border-gray-900 flex items-center justify-between px-6 z-10 sticky top-0">
      <span class="text-white font-black uppercase tracking-widest text-sm bg-gray-900 px-4 py-2 rounded-lg border border-gray-800 shadow-inner">
        Panel de Control
      </span>
      
      <div class="flex items-center gap-5">
        <div class="h-8 w-px bg-gray-800"></div>
        <div class="flex items-center gap-3 bg-gray-900/50 py-1.5 px-3 rounded-none border border-gray-800 hover:bg-gray-800 transition-colors">
          <div class="w-8 h-8 flex items-center justify-center text-primary font-bold text-sm cursor-pointer transition-shadow">
            <svg class="w-5 h-5 text-primary drop-shadow-[0_0_5px_#E820BB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </div>
          <span class="text-sm font-semibold text-gray-300 cursor-pointer uppercase tracking-wider">
            Admin
          </span>
          <button (click)="logout()" class="ml-2 text-xs text-gray-400 hover:text-white hover:bg-red-600/80 border border-transparent hover:border-red-500 transition-all duration-300 px-3 py-1.5 rounded-none font-bold uppercase tracking-widest active:scale-95 flex items-center gap-2 group">
            <span>Salir</span>
            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  toastService = inject(ToastService);
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
    this.toastService.show('Sesión cerrada', 'info');
  }
}
