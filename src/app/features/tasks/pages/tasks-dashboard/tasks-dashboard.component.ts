import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TaskStore } from '../../state/task.store';
import { TaskListComponent } from '../../components/task-list/task-list.component';
import { TaskFiltersComponent } from '../../components/task-filters/task-filters.component';
import { SprintMetricsComponent } from '../../components/sprint-metrics/sprint-metrics.component';

@Component({
  selector: 'app-tasks-dashboard',
  standalone: true,
  imports: [RouterLink, TaskListComponent, TaskFiltersComponent, SprintMetricsComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">IAS Sprint Board</h1>
            <p class="text-sm text-gray-500">Gestión de tareas del equipo</p>
          </div>
          <a
            routerLink="/tasks/new"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            aria-label="Crear nueva tarea"
          >
            + Nueva tarea
          </a>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 py-6 space-y-6">
        @defer {
          <app-sprint-metrics />
        } @placeholder {
          <div class="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
        }

        <app-task-filters />
        <app-task-list />
      </main>
    </div>
  `
})
export class TasksDashboardComponent implements OnInit {
  private readonly store = inject(TaskStore);

  ngOnInit(): void {
    this.store.load();
  }
}