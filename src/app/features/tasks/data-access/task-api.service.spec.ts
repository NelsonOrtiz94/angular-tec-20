import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TaskApiService } from './task-api.service';
import { SprintTask } from '../../../core/models/sprint-task.model';

const mockTask: SprintTask = {
  id: 'TASK-1', title: 'Test task', description: 'Description here',
  status: 'todo', priority: 'medium', assignee: 'Ana Torres',
  dueDate: '2026-12-01', tags: ['test'], createdAt: '2026-06-01T00:00:00.000Z', updatedAt: '2026-06-01T00:00:00.000Z'
};

describe('TaskApiService', () => {
  let service: TaskApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TaskApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getTasks debe hacer GET a /api/tasks y retornar array tipado', () => {
    let result: SprintTask[] | undefined;
    service.getTasks().subscribe(tasks => result = tasks);

    const req = httpMock.expectOne('/api/tasks');
    expect(req.request.method).toBe('GET');
    req.flush([mockTask]);

    expect(result).toBeDefined();
    expect(result!.length).toBe(1);
    expect(result![0].id).toBe('TASK-1');
  });

  it('getTask debe hacer GET a /api/tasks/:id', () => {
    let result: SprintTask | undefined;
    service.getTask('TASK-1').subscribe(task => result = task);

    const req = httpMock.expectOne('/api/tasks/TASK-1');
    expect(req.request.method).toBe('GET');
    req.flush(mockTask);

    expect(result!.title).toBe('Test task');
  });

  it('createTask debe hacer POST a /api/tasks', () => {
    const dto = { title: 'Nueva', description: 'Descripción larga aquí', status: 'todo' as const,
      priority: 'low' as const, assignee: 'Carlos', dueDate: '2026-12-01', tags: [] };

    service.createTask(dto).subscribe();

    const req = httpMock.expectOne('/api/tasks');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush({ ...mockTask, ...dto });
  });

  it('getTasks debe propagar error HTTP', () => {
    let errorReceived = false;
    service.getTasks().subscribe({ error: () => errorReceived = true });

    const req = httpMock.expectOne('/api/tasks');
    req.flush('Error', { status: 500, statusText: 'Server Error' });

    expect(errorReceived).toBeTrue();
  });
});