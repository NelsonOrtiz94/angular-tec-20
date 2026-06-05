import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SprintTask } from '../../../../core/models/sprint-task.model';
import { TaskStatusPipe } from '../../../../shared/pipes/task-status.pipe';
import { TaskPriorityPipe } from '../../../../shared/pipes/task-priority.pipe';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [RouterLink, TaskStatusPipe, TaskPriorityPipe],
  template: `
    <a
      [routerLink]="['/tasks', task().id]"
      class="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border-l-4 cursor-pointer"
      [class]="task().priority | taskPriority:'border'"
      [attr.aria-label]="'Ver detalle de ' + task().title"
    >
      <div class="flex items-start justify-between gap-2">
        <h3 class="font-semibold text-gray-800 text-sm leading-tight">{{ task().title }}</h3>
        <span class="shrink-0 text-xs px-2 py-0.5 rounded-full font-medium"
          [class]="task().priority | taskPriority:'class'">
          {{ task().priority | taskPriority:'label' }}
        </span>
      </div>

      <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ task().description }}</p>

      <div class="flex items-center justify-between mt-3">
        <span class="text-xs px-2 py-0.5 rounded-full" [class]="task().status | taskStatus:'class'">
          {{ task().status | taskStatus:'label' }}
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
}