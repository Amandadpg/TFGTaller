import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-3">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          class="min-w-[320px] p-4 rounded-none shadow-[0_0_20px_rgba(0,0,0,0.5)] border-l-4 flex items-center justify-between text-white transition-all duration-300 ease-in-out bg-black/90 backdrop-blur-md"
          [ngClass]="{
            'border-primary': toast.type === 'success',
            'border-red-600': toast.type === 'error',
            'border-blue-500': toast.type === 'info',
            'border-amber-500': toast.type === 'warning'
          }"
        >
          <div class="flex items-center gap-3">
            @if (toast.type === 'success') {
              <svg class="w-6 h-6 text-primary drop-shadow-[0_0_5px_#E820BB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            }
            @if (toast.type === 'error') {
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            }
            <span class="font-medium tracking-wide">{{ toast.message }}</span>
          </div>
          <button (click)="toastService.remove(toast.id)" class="ml-4 text-gray-400 hover:text-white focus:outline-none transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);
}
