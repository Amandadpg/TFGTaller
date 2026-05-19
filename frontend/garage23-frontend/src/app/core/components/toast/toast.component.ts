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
           class="pointer-events-auto relative overflow-hidden flex items-start gap-4 px-6 py-5 bg-[#0a0a0a] border rounded-2xl animate-toast-in min-w-[320px] max-w-[450px] shadow-2xl backdrop-blur-xl"
           [ngClass]="{
             'border-red-500/30 shadow-[0_10px_40px_-10px_rgba(239,68,68,0.2)]': toast.type === 'error',
             'border-emerald-500/30 shadow-[0_10px_40px_-10px_rgba(16,185,129,0.2)]': toast.type === 'success',
             'border-yellow-500/30 shadow-[0_10px_40px_-10px_rgba(234,179,8,0.2)]': toast.type === 'warning',
             'border-pink-600/30 shadow-[0_10px_40px_-10px_rgba(219,39,119,0.2)]': toast.type === 'info' || !toast.type
           }">
        
        <div class="absolute left-0 top-0 bottom-0 w-1"
             [ngClass]="{
               'bg-red-500': toast.type === 'error',
               'bg-emerald-500': toast.type === 'success',
               'bg-yellow-500': toast.type === 'warning',
               'bg-pink-600': toast.type === 'info' || !toast.type
             }">
        </div>

        <div class="shrink-0 mt-0.5" 
             [ngClass]="{
               'text-red-500': toast.type === 'error',
               'text-emerald-500': toast.type === 'success',
               'text-yellow-500': toast.type === 'warning',
               'text-pink-600': toast.type === 'info' || !toast.type
             }">
          
          <svg *ngIf="toast.type === 'error'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          
          <svg *ngIf="toast.type === 'success'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>

          <svg *ngIf="toast.type === 'warning'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>

          <svg *ngIf="toast.type === 'info' || !toast.type" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>

        <div class="flex-1">
          <p class="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Notificación</p>
          <p class="text-sm font-medium text-white leading-relaxed">
            {{ toast.message }}
          </p>
        </div>

        <button (click)="cerrarToast(toast.id)" class="text-zinc-600 hover:text-white transition-colors p-1 -mt-1 -mr-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    @keyframes toastIn {
      from { opacity: 0; transform: translateX(20px) scale(0.95); }
      to { opacity: 1; transform: translateX(0) scale(1); }
    }
    .animate-toast-in {
      animation: toastIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class ToastComponent {
  public toastService = inject(ToastService);

  cerrarToast(id: string) {
    this.toastService.remove(id);
  }
}