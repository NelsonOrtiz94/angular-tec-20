import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2" aria-live="polite" aria-atomic="false">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="flex items-center justify-between gap-4 px-4 py-3 rounded-lg shadow-lg text-sm font-medium min-w-64 max-w-sm transition-all"
          [class]="toastClass(toast.type)"
          role="alert"
        >
          <span>{{ toast.message }}</span>
          <button
            class="shrink-0 opacity-70 hover:opacity-100 text-lg leading-none"
            (click)="toastService.dismiss(toast.id)"
            aria-label="Cerrar notificación"
          >&times;</button>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  protected readonly toastService = inject(ToastService);

  toastClass(type: string): string {
    const map: Record<string, string> = {
      success: 'bg-green-600 text-white',
      error: 'bg-red-600 text-white',
      info: 'bg-blue-600 text-white'
    };
    return map[type] ?? '';
  }
}