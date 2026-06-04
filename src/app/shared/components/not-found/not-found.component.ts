import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 class="text-6xl font-bold text-gray-300">404</h1>
      <p class="text-xl text-gray-500">Página no encontrada</p>
      <a routerLink="/tasks" class="text-blue-600 hover:underline">Volver al dashboard</a>
    </div>
  `
})
export class NotFoundComponent {}