import { computed, inject, Injectable, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TaskApiService } from '../data-access/task-api.service';
import {
  CreateTaskDto,
  SprintSummary,
  SprintTask,
  TaskPriority,
  TaskStatus,
  UpdateTaskDto
} from '../../../core/models/sprint-task.model';

@Injectable({ providedIn: 'root' })
export class TaskStore {
  private readonly api = inject(TaskApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly tasks = signal<SprintTask[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly search = signal('');
  readonly status = signal<TaskStatus | 'all'>('all');
  readonly priority = signal<TaskPriority | 'all'>('all');
  readonly selectedTaskId = signal<string | null>(null);

  readonly filteredTasks = computed(() => {
    const searchTerm = this.search().toLowerCase().trim();
    const statusFilter = this.status();
    const priorityFilter = this.priority();

    return this.tasks().filter(task => {
      const matchesSearch =
        !searchTerm ||
        task.title.toLowerCase().includes(searchTerm) ||
        task.assignee.toLowerCase().includes(searchTerm) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchTerm));

      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  });

  readonly summary = computed<SprintSummary>(() => {
    const all = this.tasks();
    const total = all.length;
    const done = all.filter(t => t.status === 'done').length;
    const blocked = all.filter(t => t.status === 'blocked').length;
    const open = all.filter(t => t.status === 'todo' || t.status === 'in-progress').length;
    const progressPercent = total > 0 ? Math.round((done / total) * 100) : 0;

    return { total, open, blocked, done, progressPercent };
  });

  readonly selectedTask = computed(() =>
    this.tasks().find(t => t.id === this.selectedTaskId()) ?? null
  );

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.getTasks()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: tasks => {
          this.tasks.set(tasks);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se pudieron cargar las tareas. Intenta nuevamente.');
          this.loading.set(false);
        }
      });
  }

  create(dto: CreateTaskDto): void {
    this.loading.set(true);

    this.api.createTask(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: newTask => {
          this.tasks.update(current => [...current, newTask]);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se pudo crear la tarea.');
          this.loading.set(false);
        }
      });
  }

  update(id: string, dto: UpdateTaskDto): void {
    this.loading.set(true);

    this.api.updateTask(id, dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: updatedTask => {
          this.tasks.update(current =>
            current.map(t => t.id === id ? updatedTask : t)
          );
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se pudo actualizar la tarea.');
          this.loading.set(false);
        }
      });
  }

  select(id: string | null): void {
    this.selectedTaskId.set(id);
  }

  setSearch(value: string): void {
    this.search.set(value);
  }

  setStatus(value: TaskStatus | 'all'): void {
    this.status.set(value);
  }

  setPriority(value: TaskPriority | 'all'): void {
    this.priority.set(value);
  }
}