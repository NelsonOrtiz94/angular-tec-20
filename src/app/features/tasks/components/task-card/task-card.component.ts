import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SprintTask } from '../../../../core/models/sprint-task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a
      [routerLink]="['/tasks', task().id]"
      class="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border-l-4 cursor-pointer"
      [class]="borderColor()"
      [attr.aria-label]="'Ver detalle de ' + task().title"
    >
      <div class="flex items-start justify-between gap-2">
        <h3 class="font-semibold text-gray-800 text-sm leading-tight">{{ task().title }}</h3>
        <span class="shrink-0 text-xs px-2 py-0.5 rounded-full font-medium" [class]="priorityClass()">
          {{ priorityLabel() }}
        </span>
      </div>

      <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ task().description }}</p>

      <div class="flex items-center justify-between mt-3">
        <span class="text-xs px-2 py-0.5 rounded-full" [class]="statusClass()">
          {{ statusLabel() }}
        </span>
        <span class="text-xs text-gray-400">{{ task().assignee }}</span>
      </div>

      <div class="flex items-center justify-between mt-2">
        <div class="flex gap-1 flex-wrap">
          @for (tag of task().tags; track tag) {
            <span class="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{{ tag }}</span>
          }
        </div>
        <span class="text-xs text-gray-400">{{ task().dueDate }}</span>
      </div>
    </a>
  `
})
export class TaskCardComponent {
  readonly task = input.required<SprintTask>();

  borderColor(): string {
    const map: Record<string, string> = {
      critical: 'border-red-500',
      high: 'border-orange-400',
      medium: 'border-yellow-400',
      low: 'border-gray-300'
    };
    return map[this.task().priority] ?? 'border-gray-300';
  }

  priorityClass(): string {
    const map: Record<string, string> = {
      critical: 'bg-red-100 text-red-700',
      high: 'bg-orange-100 text-orange-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-gray-100 text-gray-600'
    };
    return map[this.task().priority] ?? '';
  }

  priorityLabel(): string {
    const map: Record<string, string> = {
      critical: 'Crítica', high: 'Alta', medium: 'Media', low: 'Baja'
    };
    return map[this.task().priority] ?? this.task().priority;
  }

  statusClass(): string {
    const map: Record<string, string> = {
      'todo': 'bg-gray-100 text-gray-600',
      'in-progress': 'bg-blue-100 text-blue-700',
      'blocked': 'bg-red-100 text-red-700',
      'done': 'bg-green-100 text-green-700'
    };
    return map[this.task().status] ?? '';
  }

  statusLabel(): string {
    const map: Record<string, string> = {
      'todo': 'Por hacer',
      'in-progress': 'En progreso',
      'blocked': 'Bloqueada',
      'done': 'Finalizada'
    };
    return map[this.task().status] ?? this.task().status;
  }
}