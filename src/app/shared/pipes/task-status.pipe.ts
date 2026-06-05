import { Pipe, PipeTransform } from '@angular/core';
import { TaskStatus } from '../../core/models/sprint-task.model';

const STATUS_LABELS: Record<TaskStatus, string> = {
  'todo': 'Por hacer',
  'in-progress': 'En progreso',
  'blocked': 'Bloqueada',
  'done': 'Finalizada'
};

const STATUS_CLASSES: Record<TaskStatus, string> = {
  'todo': 'bg-gray-100 text-gray-600',
  'in-progress': 'bg-blue-100 text-blue-700',
  'blocked': 'bg-red-100 text-red-700',
  'done': 'bg-green-100 text-green-700'
};

@Pipe({ name: 'taskStatus', standalone: true, pure: true })
export class TaskStatusPipe implements PipeTransform {
  transform(value: TaskStatus, mode: 'label' | 'class' = 'label'): string {
    return mode === 'label' ? STATUS_LABELS[value] ?? value : STATUS_CLASSES[value] ?? '';
  }
}