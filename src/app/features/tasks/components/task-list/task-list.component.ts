import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TaskStore } from '../../state/task.store';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskCardComponent, RouterLink],
  template: `
    @if (store.loading()) {
      <div class="flex justify-center items-center py-16" aria-live="polite" aria-busy="true">
        <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span class="ml-3 text-gray-500">Cargando tareas...</span>
      </div>
    } @else if (store.error()) {
      <div class="text-center py-16" aria-live="assertive">
        <p class="text-red-500 font-medium">{{ store.error() }}</p>
        <button
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          (click)="store.load()"
        >
          Reintentar
        </button>
      </div>
    } @else if (store.filteredTasks().length === 0) {
      <div class="text-center py-16 text-gray-400" aria-live="polite">
        <p class="text-lg">No hay tareas que coincidan con los filtros.</p>
        <p class="text-sm mt-1">Intenta ajustar los criterios de búsqueda.</p>
      </div>
    } @else {
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (task of store.paginatedTasks(); track task.id) {
          <app-task-card [task]="task" />
        }
      </div>

      @if (store.totalPages() > 1) {
        <div class="flex items-center justify-between mt-6 px-1" aria-label="Paginación">
          <p class="text-sm text-gray-500">
            Página {{ store.currentPage() }} de {{ store.totalPages() }}
            <span class="ml-1 text-gray-400">({{ store.filteredTasks().length }} tareas)</span>
          </p>
          <div class="flex gap-2">
            <button
              class="px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              [disabled]="store.currentPage() === 1"
              (click)="store.prevPage()"
              aria-label="Página anterior"
            >
              ← Anterior
            </button>
            <button
              class="px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              [disabled]="store.currentPage() === store.totalPages()"
              (click)="store.nextPage()"
              aria-label="Página siguiente"
            >
              Siguiente →
            </button>
          </div>
        </div>
      }
    }
  `
})
export class TaskListComponent {
  protected readonly store = inject(TaskStore);
}