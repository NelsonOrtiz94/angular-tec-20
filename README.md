# IAS Sprint Board

Aplicación Angular 20 para gestión de tareas de un sprint de desarrollo. Construida con componentes standalone, signals, formularios reactivos tipados, HttpClient con interceptor funcional y Tailwind CSS

## Requisitos previos

- Node.js 20+
- Angular CLI 20+

## Instalación

```bash
npm install
```

## Ejecución en desarrollo

```bash
ng serve
```

Abrir en `http://localhost:4200`. La app redirige automáticamente a `/tasks`.

## Pruebas

```bash
ng test
```

Ejecuta 27 pruebas con Jasmine/Karma en Chrome. Cubre: store, servicio HTTP, formulario, lista y routing.

## Build de producción

```bash
ng build
```

## Rutas disponibles

| Ruta | Descripción |
|------|-------------|
| `/tasks` | Dashboard con lista, filtros y métricas |
| `/tasks/new` | Formulario para crear tarea |
| `/tasks/:id` | Detalle de tarea |
| `/tasks/:id/edit` | Formulario para editar tarea |
| `**` | Página 404 |

## Decisiones técnicas

1. **Componentes standalone**: Sin AppModule ni FeatureModules. Toda la configuración vive en `app.config.ts` con `bootstrapApplication`.
2. **Interceptor funcional in-memory**: Simula el backend con datos en memoria sin dependencias externas. Mantiene la capa HTTP real con `HttpClient` tipado.
3. **TaskStore con signals**: Servicio singleton con `signal`, `computed` y `DestroyRef`. El estado derivado (filtros, summary) vive en `computed` para evitar recálculos innecesarios.
4. **`@defer` en métricas**: El panel de métricas usa `@defer` para carga diferida, cumpliendo el requerimiento de performance sin forzar la solución.
5. **Formularios reactivos tipados**: `FormGroup<TaskForm>` con controles `nonNullable` y validador personalizado `futureDateValidator` para fechas.
6. **Tailwind CSS vía PostCSS**: Sin dependencias de componentes externos, estilos encapsulados por componente, configuración mínima con `.postcssrc.json`.
7. **Lazy loading con `loadComponent`**: Cada ruta carga su componente de forma independiente reduciendo el bundle inicial.
8. **`inject()` consistente**: Usado en servicios, store, componentes e interceptor en lugar de inyección por constructor.
9. **`takeUntilDestroyed(destroyRef)`**: Limpieza explícita de suscripciones pasando `DestroyRef` inyectado en el contexto de construcción del store.
10. **Sin `any`**: TypeScript en modo estricto. Se usan tipos explícitos, `unknown` donde aplica, y DTOs separados del modelo de dominio.

## Qué mejoraría con más tiempo

- Agregar paginación o scroll virtual para listas grandes.
- Implementar notificaciones tipo toast para feedback de acciones (crear/editar).
- Añadir animaciones de transición entre rutas.
- Persistencia en `localStorage` con un `effect` justificado en el store.
- Ampliar cobertura de tests con pruebas E2E usando Playwright.
- Extraer los mapas de labels/clases de estado y prioridad a un pipe reutilizable.

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```
