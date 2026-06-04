export type TaskStatus = 'todo' | 'in-progress' | 'blocked' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface SprintTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SprintSummary {
  total: number;
  open: number;
  blocked: number;
  done: number;
  progressPercent: number;
}

export type CreateTaskDto = Omit<SprintTask, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTaskDto = Partial<CreateTaskDto>;
