import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TaskStore } from './task.store';

describe('TaskStore', () => {
  let store: TaskStore;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    store = TestBed.inject(TaskStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debe iniciar con estado vacío', () => {
    expect(store.tasks()).toEqual([]);
    expect(store.loading()).toBeFalse();
    expect(store.error()).toBeNull();
  });

  it('debe cargar tareas correctamente', () => {
    const mockTasks = [
      { id: 'T-1', title: 'Test', description: 'desc', status: 'todo', priority: 'low',
        assignee: 'Ana', dueDate: '2026-12-01', tags: [], createdAt: '', updatedAt: '' }
    ];

    TestBed.runInInjectionContext(() => store.load());

    const req = httpMock.expectOne('/api/tasks');
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);

    expect(store.tasks().length).toBe(1);
    expect(store.loading()).toBeFalse();
    expect(store.error()).toBeNull();
  });

  it('debe manejar error de carga', () => {
    TestBed.runInInjectionContext(() => store.load());

    const req = httpMock.expectOne('/api/tasks');
    req.flush('Error', { status: 500, statusText: 'Server Error' });

    expect(store.tasks()).toEqual([]);
    expect(store.error()).toBeTruthy();
    expect(store.loading()).toBeFalse();
  });

  it('debe filtrar por búsqueda de texto', () => {
    store.tasks.set([
      { id: 'T-1', title: 'Angular routing', description: 'desc', status: 'todo',
        priority: 'high', assignee: 'Ana', dueDate: '2026-12-01', tags: [], createdAt: '', updatedAt: '' },
      { id: 'T-2', title: 'Testing unitario', description: 'desc', status: 'done',
        priority: 'low', assignee: 'Carlos', dueDate: '2026-12-01', tags: [], createdAt: '', updatedAt: '' }
    ]);

    store.setSearch('angular');
    expect(store.filteredTasks().length).toBe(1);
    expect(store.filteredTasks()[0].id).toBe('T-1');
  });

  it('debe filtrar por estado', () => {
    store.tasks.set([
      { id: 'T-1', title: 'A', description: 'desc', status: 'todo',
        priority: 'low', assignee: 'Ana', dueDate: '2026-12-01', tags: [], createdAt: '', updatedAt: '' },
      { id: 'T-2', title: 'B', description: 'desc', status: 'done',
        priority: 'low', assignee: 'Ana', dueDate: '2026-12-01', tags: [], createdAt: '', updatedAt: '' }
    ]);

    store.setStatus('done');
    expect(store.filteredTasks().length).toBe(1);
    expect(store.filteredTasks()[0].id).toBe('T-2');
  });

  it('debe calcular el summary correctamente', () => {
    store.tasks.set([
      { id: 'T-1', title: 'A', description: 'd', status: 'todo', priority: 'low',
        assignee: 'A', dueDate: '2026-12-01', tags: [], createdAt: '', updatedAt: '' },
      { id: 'T-2', title: 'B', description: 'd', status: 'done', priority: 'low',
        assignee: 'A', dueDate: '2026-12-01', tags: [], createdAt: '', updatedAt: '' },
      { id: 'T-3', title: 'C', description: 'd', status: 'blocked', priority: 'low',
        assignee: 'A', dueDate: '2026-12-01', tags: [], createdAt: '', updatedAt: '' },
      { id: 'T-4', title: 'D', description: 'd', status: 'in-progress', priority: 'low',
        assignee: 'A', dueDate: '2026-12-01', tags: [], createdAt: '', updatedAt: '' }
    ]);

    const summary = store.summary();
    expect(summary.total).toBe(4);
    expect(summary.done).toBe(1);
    expect(summary.blocked).toBe(1);
    expect(summary.open).toBe(2);
    expect(summary.progressPercent).toBe(25);
  });
});