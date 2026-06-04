import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskStore } from '../../state/task.store';
import { TaskPriority, TaskStatus } from '../../../../core/models/sprint-task.model';

@Component({
  selector: 'app-task-filters',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="flex flex-col md:flex-row gap-3 p-4 bg-white rounded-lg shadow">
      <div class="flex-1">
        <label for="search" class="sr-only">Buscar tareas</label>
        <input
          id="search"
          type="search"
          placeholder="Buscar por título, responsable o etiqueta..."
          class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          [ngModel]="store.search()"
          (ngModelChange)="store.setSearch($event)"
          aria-label="Buscar tareas"
        />
      </div>
      <div>
        <label for="status-filter" class="sr-only">Filtrar por estado</label>
        <select
          id="status-filter"
          class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          [ngModel]="store.status()"
          (ngModelChange)="store.setStatus($event)"
          aria-label="Filtrar por estado"
        >
          <option value="all">Todos los estados</option>
          <option value="todo">Por hacer</option>
          <option value="in-progress">En progreso</option>
          <option value="blocked">Bloqueada</option>
          <option value="done">Finalizada</option>
        </select>
      </div>
      <div>
        <label for="priority-filter" class="sr-only">Filtrar por prioridad</label>
        <select
          id="priority-filter"
          class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          [ngModel]="store.priority()"
          (ngModelChange)="store.setPriority($event)"
          aria-label="Filtrar por prioridad"
        >
          <option value="all">Todas las prioridades</option>
          <option value="critical">Crítica</option>
          <option value="high">Alta</option>
          <option value="medium">Media</option>
          <option value="low">Baja</option>
        </select>
      </div>
    </div>
  `
})
export class TaskFiltersComponent {
  protected readonly store = inject(TaskStore);
}