import { Pipe, PipeTransform } from '@angular/core';
import { TaskPriority } from '../../core/models/sprint-task.model';

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  critical: 'Crítica',
  high: 'Alta',
  medium: 'Media',
  low: 'Baja'
};

const PRIORITY_CLASSES: Record<TaskPriority, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-gray-100 text-gray-600'
};

const PRIORITY_BORDER: Record<TaskPriority, string> = {
  critical: 'border-red-500',
  high: 'border-orange-400',
  medium: 'border-yellow-400',
  low: 'border-gray-300'
};

@Pipe({ name: 'taskPriority', standalone: true, pure: true })
export class TaskPriorityPipe implements PipeTransform {
  transform(value: TaskPriority, mode: 'label' | 'class' | 'border' = 'label'): string {
    if (mode === 'label') return PRIORITY_LABELS[value] ?? value;
    if (mode === 'border') return PRIORITY_BORDER[value] ?? 'border-gray-300';
    return PRIORITY_CLASSES[value] ?? '';
  }
}