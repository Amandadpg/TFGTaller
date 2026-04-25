import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-24 right-6 z-[9999] flex flex-col gap-4 pointer-events-none">
      
      <div *ngFor="let toast of toastService.toasts()" 
           class="pointer-events-auto flex items-center gap-5 px-6 py-5 bg-white border-2 rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] animate-toast-in min-w-[400px]"
           [ngClass]="{
             'border-red-600': toast.type === 'error',
             'border-green-600': toast.type === 'success',
             'border-blue-600': toast.type === 'info'
           }">
        
        <div class="shrink-0" [ngClass]="{
          'text-red-600': toast.type === 'error',
          'text-green-600': toast.type === 'success',
          'text-blue-600': toast.type === 'info'
        }">
          <svg *ngIf="toast.type === 'error'" class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <svg *ngIf="toast.type === 'success'" class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>

        <div class="flex-1">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Aviso del Sistema</p>
          <p class="text-base font-extrabold text-black leading-tight">
            {{ toast.message }}
          </p>
        </div>

        <button (click)="cerrarToast(toast.id)" class="text-gray-300 hover:text-black transition-all text-2xl font-bold p-1">
          &times;
        </button>
      </div>
    </div>
  `,
  styles: [`
    @keyframes toastIn {
      from { opacity: 0; transform: translateX(50px) scale(0.9); }
      to { opacity: 1; transform: translateX(0) scale(1); }
    }
    .animate-toast-in {
      animation: toastIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
  `]
})
export class ToastComponent {
  public toastService = inject(ToastService);

  cerrarToast(id: string) {
    this.toastService.remove(id);
  }
}