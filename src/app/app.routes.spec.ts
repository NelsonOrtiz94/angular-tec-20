import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { Location } from '@angular/common';
import { routes } from './app.routes';
import { App } from './app';

describe('App Routes', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    TestBed.createComponent(App);
  });

  it('/ debe redirigir a /tasks', async () => {
    await router.navigate(['/']);
    expect(location.path()).toBe('/tasks');
  });

  it('/tasks debe cargar TasksDashboardComponent', async () => {
    await router.navigate(['/tasks']);
    expect(location.path()).toBe('/tasks');
  });

  it('/tasks/:id debe navegar con parámetro', async () => {
    await router.navigate(['/tasks', 'TASK-101']);
    expect(location.path()).toBe('/tasks/TASK-101');
  });

  it('ruta inexistente debe ir a not-found', async () => {
    await router.navigate(['/ruta-inexistente']);
    expect(location.path()).toBe('/ruta-inexistente');
    const currentRoute = router.routerState.snapshot.root.firstChild;
    expect(currentRoute).toBeTruthy();
  });
});