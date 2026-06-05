import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { TaskStore } from '../../state/task.store';
import { TaskApiService } from '../../data-access/task-api.service';
import { CreateTaskDto, TaskPriority, TaskStatus } from '../../../../core/models/sprint-task.model';
import { ToastService } from '../../../../shared/services/toast.service';

function futureDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const selected = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected < today ? { pastDate: true } : null;
}

interface TaskForm {
  title: FormControl<string>;
  description: FormControl<string>;
  status: FormControl<TaskStatus>;
  priority: FormControl<TaskPriority>;
  assignee: FormControl<string>;
  dueDate: FormControl<string>;
  tags: FormControl<string>;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm">
        <div class="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <a
            routerLink="/tasks"
            class="text-gray-500 hover:text-gray-700 text-sm"
            aria-label="Volver al dashboard"
            >← Volver</a
          >
          <h1 class="text-xl font-bold text-gray-900">
            {{ isEditMode() ? 'Editar tarea' : 'Nueva tarea' }}
          </h1>
        </div>
      </header>

      <main class="max-w-2xl mx-auto px-4 py-6">
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          novalidate
          class="bg-white rounded-lg shadow p-6 space-y-5"
        >
          <!-- Title -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-1"
              >Título <span aria-hidden="true">*</span></label
            >
            <input
              id="title"
              type="text"
              formControlName="title"
              class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              [class.border-red-400]="isInvalid('title')"
              [class.border-gray-300]="!isInvalid('title')"
              aria-required="true"
              [attr.aria-describedby]="isInvalid('title') ? 'title-error' : null"
            />
            @if (isInvalid('title')) {
              <p id="title-error" class="mt-1 text-xs text-red-500" role="alert">
                @if (form.controls.title.errors?.['required']) {
                  El título es requerido.
                } @else if (form.controls.title.errors?.['minlength']) {
                  Mínimo 5 caracteres.
                } @else if (form.controls.title.errors?.['maxlength']) {
                  Máximo 80 caracteres.
                }
              </p>
            }
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1"
              >Descripción <span aria-hidden="true">*</span></label
            >
            <textarea
              id="description"
              formControlName="description"
              rows="4"
              class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              [class.border-red-400]="isInvalid('description')"
              [class.border-gray-300]="!isInvalid('description')"
              aria-required="true"
              [attr.aria-describedby]="isInvalid('description') ? 'desc-error' : null"
            ></textarea>
            @if (isInvalid('description')) {
              <p id="desc-error" class="mt-1 text-xs text-red-500" role="alert">
                @if (form.controls.description.errors?.['required']) {
                  La descripción es requerida.
                } @else if (form.controls.description.errors?.['minlength']) {
                  Mínimo 20 caracteres.
                } @else if (form.controls.description.errors?.['maxlength']) {
                  Máximo 500 caracteres.
                }
              </p>
            }
          </div>

          <!-- Status + Priority -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 mb-1"
                >Estado <span aria-hidden="true">*</span></label
              >
              <select
                id="status"
                formControlName="status"
                class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                [class.border-red-400]="isInvalid('status')"
                [class.border-gray-300]="!isInvalid('status')"
                aria-required="true"
              >
                <option value="">Seleccionar estado</option>
                <option value="todo">Por hacer</option>
                <option value="in-progress">En progreso</option>
                <option value="blocked">Bloqueada</option>
                <option value="done">Finalizada</option>
              </select>
              @if (isInvalid('status')) {
                <p class="mt-1 text-xs text-red-500" role="alert">Selecciona un estado válido.</p>
              }
            </div>
            <div>
              <label for="priority" class="block text-sm font-medium text-gray-700 mb-1"
                >Prioridad <span aria-hidden="true">*</span></label
              >
              <select
                id="priority"
                formControlName="priority"
                class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                [class.border-red-400]="isInvalid('priority')"
                [class.border-gray-300]="!isInvalid('priority')"
                aria-required="true"
              >
                <option value="">Seleccionar prioridad</option>
                <option value="critical">Crítica</option>
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </select>
              @if (isInvalid('priority')) {
                <p class="mt-1 text-xs text-red-500" role="alert">
                  Selecciona una prioridad válida.
                </p>
              }
            </div>
          </div>

          <!-- Assignee -->
          <div>
            <label for="assignee" class="block text-sm font-medium text-gray-700 mb-1"
              >Responsable <span aria-hidden="true">*</span></label
            >
            <input
              id="assignee"
              type="text"
              formControlName="assignee"
              class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              [class.border-red-400]="isInvalid('assignee')"
              [class.border-gray-300]="!isInvalid('assignee')"
              aria-required="true"
            />
            @if (isInvalid('assignee')) {
              <p class="mt-1 text-xs text-red-500" role="alert">
                @if (form.controls.assignee.errors?.['required']) {
                  El responsable es requerido.
                } @else if (form.controls.assignee.errors?.['minlength']) {
                  Mínimo 3 caracteres.
                }
              </p>
            }
          </div>

          <!-- Due Date -->
          <div>
            <label for="dueDate" class="block text-sm font-medium text-gray-700 mb-1"
              >Fecha límite <span aria-hidden="true">*</span></label
            >
            <input
              id="dueDate"
              type="date"
              formControlName="dueDate"
              class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              [class.border-red-400]="isInvalid('dueDate')"
              [class.border-gray-300]="!isInvalid('dueDate')"
              aria-required="true"
            />
            @if (isInvalid('dueDate')) {
              <p class="mt-1 text-xs text-red-500" role="alert">
                @if (form.controls.dueDate.errors?.['required']) {
                  La fecha límite es requerida.
                } @else if (form.controls.dueDate.errors?.['pastDate']) {
                  La fecha no puede ser anterior a hoy.
                }
              </p>
            }
          </div>

          <!-- Tags -->
          <div>
            <label for="tags" class="block text-sm font-medium text-gray-700 mb-1">
              Etiquetas
              <span class="text-gray-400 font-normal">(opcional, separadas por comas)</span>
            </label>
            <input
              id="tags"
              type="text"
              formControlName="tags"
              placeholder="ui, dashboard, http"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-2">
            <a
              routerLink="/tasks"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
            >
              Cancelar
            </a>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              [disabled]="store.loading()"
              aria-label="Guardar tarea"
            >
              {{ store.loading() ? 'Guardando...' : isEditMode() ? 'Actualizar' : 'Crear tarea' }}
            </button>
          </div>
        </form>
      </main>
    </div>
  `,
})
export class TaskFormComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(TaskApiService);
  private readonly toastService = inject(ToastService);
  protected readonly store = inject(TaskStore);

  readonly isEditMode = signal(false);
  private editId: string | null = null;
  submitted = false;

  readonly form = new FormGroup<TaskForm>({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(80)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(20), Validators.maxLength(500)],
    }),
    status: new FormControl<TaskStatus>('todo', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    priority: new FormControl<TaskPriority>('medium', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    assignee: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    dueDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, futureDateValidator],
    }),
    tags: new FormControl('', { nonNullable: true }),
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.editId = id;
      this.api.getTask(id).subscribe({
        next: (task) => {
          this.form.patchValue({
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            assignee: task.assignee,
            dueDate: task.dueDate,
            tags: task.tags.join(', '),
          });
        },
        error: () => this.router.navigate(['/tasks']),
      });
    }
  }

  isInvalid(field: keyof TaskForm): boolean {
    const ctrl = this.form.controls[field];
    return ctrl.invalid && (ctrl.dirty || ctrl.touched || this.submitted);
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();
    const tags = raw.tags
      ? [
          ...new Set(
            raw.tags
              .split(',')
              .map((t) => t.trim().toLowerCase())
              .filter(Boolean),
          ),
        ]
      : [];

    const dto: CreateTaskDto = {
      title: raw.title,
      description: raw.description,
      status: raw.status,
      priority: raw.priority,
      assignee: raw.assignee,
      dueDate: raw.dueDate,
      tags,
    };

    if (this.isEditMode() && this.editId) {
      this.store.update(this.editId, dto);
      this.toastService.show('Tarea actualizada correctamente');
    } else {
      this.store.create(dto);
      this.toastService.show('Tarea creada correctamente');
    }

    this.router.navigate(['/tasks']);
  }
}
