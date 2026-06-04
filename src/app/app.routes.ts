import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full'
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./features/tasks/pages/tasks-dashboard/tasks-dashboard.component')
        .then(m => m.TasksDashboardComponent)
  },
  {
    path: 'tasks/new',
    loadComponent: () =>
      import('./features/tasks/pages/task-form/task-form.component')
        .then(m => m.TaskFormComponent)
  },
  {
    path: 'tasks/:id',
    loadComponent: () =>
      import('./features/tasks/pages/task-detail/task-detail.component')
        .then(m => m.TaskDetailComponent)
  },
  {
    path: 'tasks/:id/edit',
    loadComponent: () =>
      import('./features/tasks/pages/task-form/task-form.component')
        .then(m => m.TaskFormComponent)
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component')
        .then(m => m.NotFoundComponent)
  }
];