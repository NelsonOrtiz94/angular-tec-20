import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SprintTask, CreateTaskDto } from '../models/sprint-task.model';
import { MOCK_TASKS } from '../../data/mock-tasks.data';

let tasks: SprintTask[] = [...MOCK_TASKS];

export const mockTasksInterceptor: HttpInterceptorFn = (req, next) => {
  const { url, method } = req;

  // GET /api/tasks
  if (method === 'GET' && url === '/api/tasks') {
    return of(new HttpResponse({ status: 200, body: [...tasks] })).pipe(delay(400));
  }

  // GET /api/tasks/:id
  if (method === 'GET' && url.match(/\/api\/tasks\/[\w-]+$/)) {
    const id = url.split('/').pop();
    const task = tasks.find(t => t.id === id);
    if (task) {
      return of(new HttpResponse({ status: 200, body: { ...task } })).pipe(delay(300));
    }
    return of(new HttpResponse({ status: 404, body: { message: 'Tarea no encontrada' } })).pipe(delay(300));
  }

  // POST /api/tasks
  if (method === 'POST' && url === '/api/tasks') {
    const dto = req.body as CreateTaskDto;
    const now = new Date().toISOString();
    const newTask: SprintTask = {
      ...dto,
      id: `TASK-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };
    tasks = [...tasks, newTask];
    return of(new HttpResponse({ status: 201, body: { ...newTask } })).pipe(delay(400));
  }

  // PUT /api/tasks/:id
  if (method === 'PUT' && url.match(/\/api\/tasks\/[\w-]+$/)) {
    const id = url.split('/').pop();
    const dto = req.body as Partial<SprintTask>;
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      const updated: SprintTask = {
        ...tasks[index],
        ...dto,
        id: tasks[index].id,
        updatedAt: new Date().toISOString()
      };
      tasks = tasks.map(t => t.id === id ? updated : t);
      return of(new HttpResponse({ status: 200, body: { ...updated } })).pipe(delay(400));
    }
    return of(new HttpResponse({ status: 404, body: { message: 'Tarea no encontrada' } })).pipe(delay(300));
  }

  return next(req);
};