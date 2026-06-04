import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TaskListComponent } from './task-list.component';
import { TaskStore } from '../../state/task.store';

describe('TaskListComponent', () => {
  let fixture: ComponentFixture<TaskListComponent>;
  let store: TaskStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    store = TestBed.inject(TaskStore);
    fixture.detectChanges();
  });

  it('debe mostrar estado de carga', () => {
    store.loading.set(true);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Cargando tareas');
  });

  it('debe mostrar mensaje de error', () => {
    store.loading.set(false);
    store.error.set('Error de conexión');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Error de conexión');
  });

  it('debe mostrar mensaje cuando no hay tareas', () => {
    store.loading.set(false);
    store.error.set(null);
    store.tasks.set([]);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('No hay tareas');
  });

  it('debe renderizar tarjetas cuando hay tareas', () => {
    store.loading.set(false);
    store.error.set(null);
    store.tasks.set([
      { id: 'T-1', title: 'Tarea de prueba', description: 'desc', status: 'todo',
        priority: 'high', assignee: 'Ana', dueDate: '2026-12-01', tags: [], createdAt: '', updatedAt: '' }
    ]);
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('app-task-card');
    expect(cards.length).toBe(1);
  });
});