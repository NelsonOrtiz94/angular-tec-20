import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { TaskApiService } from '../../data-access/task-api.service';
import { SprintTask } from '../../../../core/models/sprint-task.model';
import { TaskStatusPipe } from '../../../../shared/pipes/task-status.pipe';
import { TaskPriorityPipe } from '../../../../shared/pipes/task-priority.pipe';
import { Component, inject, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [RouterLink, SlicePipe, TaskStatusPipe, TaskPriorityPipe],
  template: `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm">
        <div class="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <a
            routerLink="/tasks"
            class="text-gray-500 hover:text-gray-700 text-sm"
            aria-label="Volver al dashboard"
          >
            ← Volver
          </a>
          <h1 class="text-xl font-bold text-gray-900">Detalle de tarea</h1>
        </div>
      </header>

      <main class="max-w-3xl mx-auto px-4 py-6">
        @if (loading()) {
          <div class="flex justify-center py-16" aria-live="polite" aria-busy="true">
            <div
              class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
            ></div>
            <span class="ml-3 text-gray-500">Cargando tarea...</span>
          </div>
        } @else if (error()) {
          <div class="text-center py-16" aria-live="assertive">
            <p class="text-red-500">{{ error() }}</p>
            <a routerLink="/tasks" class="mt-4 inline-block text-blue-600 hover:underline"
              >Volver al dashboard</a
            >
          </div>
        } @else if (task()) {
          <div class="bg-white rounded-lg shadow p-6 space-y-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-xs text-gray-400 mb-1">{{ task()!.id }}</p>
                <h2 class="text-2xl font-bold text-gray-900">{{ task()!.title }}</h2>
              </div>
              <a
                [routerLink]="['/tasks', task()!.id, 'edit']"
                class="shrink-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                aria-label="Editar tarea"
              >
                Editar
              </a>
            </div>

            <p class="text-gray-600 leading-relaxed">{{ task()!.description }}</p>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wide">Estado</p>
                <span
                  class="mt-1 inline-block text-sm px-2 py-0.5 rounded-full"
                  [class]="task()!.status | taskStatus:'class'"
                >
                  {{ task()!.status | taskStatus:'label' }}
                </span>
              </div>
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wide">Prioridad</p>
                <span
                  class="mt-1 inline-block text-sm px-2 py-0.5 rounded-full"
                  [class]="task()!.priority | taskPriority:'class'"
                >
                  {{ task()!.priority | taskPriority:'label' }}
                </span>
              </div>
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wide">Responsable</p>
                <p class="mt-1 text-sm text-gray-700">{{ task()!.assignee }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wide">Fecha límite</p>
                <p class="mt-1 text-sm text-gray-700">{{ task()!.dueDate }}</p>
              </div>
            </div>

            @if (task()!.tags.length > 0) {
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wide mb-2">Etiquetas</p>
                <div class="flex flex-wrap gap-2">
                  @for (tag of task()!.tags; track tag) {
                    <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{{
                      tag
                    }}</span>
                  }
                </div>
              </div>
            }

            <div class="grid grid-cols-2 gap-4 border-t pt-4">
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wide">Creada</p>
                <p class="mt-1 text-sm text-gray-500">{{ task()!.createdAt | slice: 0 : 10 }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wide">Actualizada</p>
                <p class="mt-1 text-sm text-gray-500">{{ task()!.updatedAt | slice: 0 : 10 }}</p>
              </div>
            </div>
          </div>
        }
      </main>
    </div>
  `,
})
export class TaskDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(TaskApiService);

  readonly task = signal<SprintTask | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/tasks']);
      return;
    }

    this.loading.set(true);
    this.api.getTask(id).subscribe({
      next: (task) => {
        this.task.set(task);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se encontró la tarea.');
        this.loading.set(false);
      },
    });
  }

  statusLabel(): string {
    const map: Record<string, string> = {
      todo: 'Por hacer',
      'in-progress': 'En progreso',
      blocked: 'Bloqueada',
      done: 'Finalizada',
    };
    return map[this.task()?.status ?? ''] ?? '';
  }

  statusClass(): string {
    const map: Record<string, string> = {
      todo: 'bg-gray-100 text-gray-600',
      'in-progress': 'bg-blue-100 text-blue-700',
      blocked: 'bg-red-100 text-red-700',
      done: 'bg-green-100 text-green-700',
    };
    return map[this.task()?.status ?? ''] ?? '';
  }

  priorityLabel(): string {
    const map: Record<string, string> = {
      critical: 'Crítica',
      high: 'Alta',
      medium: 'Media',
      low: 'Baja',
    };
    return map[this.task()?.priority ?? ''] ?? '';
  }

  priorityClass(): string {
    const map: Record<string, string> = {
      critical: 'bg-red-100 text-red-700',
      high: 'bg-orange-100 text-orange-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-gray-100 text-gray-600',
    };
    return map[this.task()?.priority ?? ''] ?? '';
  }
}
