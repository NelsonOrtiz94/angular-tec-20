import { DestroyRef, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SprintTask, CreateTaskDto, UpdateTaskDto } from '../../../core/models/sprint-task.model';

@Injectable({ providedIn: 'root' })
export class TaskApiService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/tasks';

  getTasks(): Observable<SprintTask[]> {
    return this.http.get<SprintTask[]>(this.baseUrl);
  }

  getTask(id: string): Observable<SprintTask> {
    return this.http.get<SprintTask>(`${this.baseUrl}/${id}`);
  }

  createTask(dto: CreateTaskDto): Observable<SprintTask> {
    return this.http.post<SprintTask>(this.baseUrl, dto);
  }

  updateTask(id: string, dto: UpdateTaskDto): Observable<SprintTask> {
    return this.http.put<SprintTask>(`${this.baseUrl}/${id}`, dto);
  }
}