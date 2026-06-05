import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { animate, group, query, style, transition, trigger } from '@angular/animations';
import { ToastComponent } from './shared/components/toast/toast.component';

export const routeFadeAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({ position: 'absolute', width: '100%', opacity: 0 })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('150ms ease-out', style({ opacity: 0 }))
      ], { optional: true }),
      query(':enter', [
        animate('200ms 100ms ease-in', style({ opacity: 1 }))
      ], { optional: true })
    ])
  ])
]);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  animations: [routeFadeAnimation],
  styles: [`
    :host { display: block; position: relative; }
  `],
  template: `
    <div style="position: relative; overflow: hidden;">
      <router-outlet #outlet="outlet" />
    </div>
    <app-toast />
  `
})
export class App {}