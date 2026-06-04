import { SprintTask } from '../core/models/sprint-task.model';

export const MOCK_TASKS: SprintTask[] = [
  {
    id: 'TASK-101',
    title: 'Crear layout del dashboard',
    description: 'Definir estructura visual y navegación principal de la aplicación.',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Ana Torres',
    dueDate: '2026-06-10',
    tags: ['ui', 'dashboard'],
    createdAt: '2026-06-01T09:00:00.000Z',
    updatedAt: '2026-06-02T15:20:00.000Z'
  },
  {
    id: 'TASK-102',
    title: 'Conectar servicio de tareas',
    description: 'Implementar capa HTTP tipada con manejo de errores y reintentos.',
    status: 'todo',
    priority: 'critical',
    assignee: 'Carlos Ruiz',
    dueDate: '2026-06-08',
    tags: ['http', 'architecture'],
    createdAt: '2026-06-01T10:00:00.000Z',
    updatedAt: '2026-06-01T10:00:00.000Z'
  },
  {
    id: 'TASK-103',
    title: 'Implementar filtros de búsqueda',
    description: 'Agregar filtros por estado y prioridad en el dashboard de tareas.',
    status: 'todo',
    priority: 'medium',
    assignee: 'Laura Gómez',
    dueDate: '2026-06-12',
    tags: ['ui', 'filters'],
    createdAt: '2026-06-01T11:00:00.000Z',
    updatedAt: '2026-06-01T11:00:00.000Z'
  },
  {
    id: 'TASK-104',
    title: 'Configurar pruebas unitarias',
    description: 'Establecer estructura base de testing con Jasmine y Karma para el proyecto.',
    status: 'blocked',
    priority: 'high',
    assignee: 'Pedro Sánchez',
    dueDate: '2026-06-07',
    tags: ['testing', 'ci'],
    createdAt: '2026-06-02T08:00:00.000Z',
    updatedAt: '2026-06-02T08:00:00.000Z'
  },
  {
    id: 'TASK-105',
    title: 'Diseñar modelo de dominio',
    description: 'Definir interfaces, tipos y DTOs para las entidades del sprint board.',
    status: 'done',
    priority: 'critical',
    assignee: 'Ana Torres',
    dueDate: '2026-06-03',
    tags: ['architecture', 'typescript'],
    createdAt: '2026-06-01T07:00:00.000Z',
    updatedAt: '2026-06-03T10:00:00.000Z'
  },
  {
    id: 'TASK-106',
    title: 'Documentar decisiones técnicas',
    description: 'Escribir README con instrucciones de instalación, ejecución y decisiones del proyecto.',
    status: 'todo',
    priority: 'low',
    assignee: 'Carlos Ruiz',
    dueDate: '2026-06-15',
    tags: ['docs'],
    createdAt: '2026-06-02T12:00:00.000Z',
    updatedAt: '2026-06-02T12:00:00.000Z'
  }
];