import { Component, inject } from '@angular/core';
import { TaskStore } from '../../state/task.store';

@Component({
  selector: 'app-sprint-metrics',
  standalone: true,
  template: `
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white rounded-lg shadow">
      <div class="text-center">
        <p class="text-3xl font-bold text-gray-800">{{ store.summary().total }}</p>
        <p class="text-sm text-gray-500 mt-1">Total</p>
      </div>
      <div class="text-center">
        <p class="text-3xl font-bold text-blue-600">{{ store.summary().open }}</p>
        <p class="text-sm text-gray-500 mt-1">Abiertas</p>
      </div>
      <div class="text-center">
        <p class="text-3xl font-bold text-red-500">{{ store.summary().blocked }}</p>
        <p class="text-sm text-gray-500 mt-1">Bloqueadas</p>
      </div>
      <div class="text-center">
        <p class="text-3xl font-bold text-green-600">{{ store.summary().done }}</p>
        <p class="text-sm text-gray-500 mt-1">Finalizadas</p>
      </div>
      <div class="col-span-2 md:col-span-4 mt-2">
        <div class="flex items-center justify-between mb-1">
          <span class="text-sm text-gray-600">Progreso del sprint</span>
          <span class="text-sm font-semibold text-gray-800">{{ store.summary().progressPercent }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5" role="progressbar"
          [attr.aria-valuenow]="store.summary().progressPercent"
          aria-valuemin="0" aria-valuemax="100">
          <div class="bg-green-500 h-2.5 rounded-full transition-all duration-300"
            [style.width.%]="store.summary().progressPercent">
          </div>
        </div>
      </div>
    </div>
  `
})
export class SprintMetricsComponent {
  protected readonly store = inject(TaskStore);
}