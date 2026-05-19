import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toast$: any;
  hide(id: string) {
    throw new Error('Method not implemented.');
  }
  toasts = signal<ToastMessage[]>([]);

  show(message: string, type: ToastType = 'info', durationMs: number = 3000) {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, message, type };

    this.toasts.update(currentToasts => [...currentToasts, newToast]);

    if (durationMs > 0) {
      setTimeout(() => {
        this.remove(id);
      }, durationMs);
    }
  }

  remove(id: string) {
    this.toasts.update(currentToasts => currentToasts.filter(t => t.id !== id));
  }
}
