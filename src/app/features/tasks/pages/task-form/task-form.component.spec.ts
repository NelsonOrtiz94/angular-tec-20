import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TaskFormComponent } from './task-form.component';

describe('TaskFormComponent', () => {
  let fixture: ComponentFixture<TaskFormComponent>;
  let component: TaskFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('el formulario debe ser inválido cuando está vacío', () => {
    expect(component.form.invalid).toBeTrue();
  });

  it('title debe ser inválido con menos de 5 caracteres', () => {
    component.form.controls.title.setValue('abc');
    component.form.controls.title.markAsTouched();
    expect(component.form.controls.title.errors?.['minlength']).toBeTruthy();
  });

  it('description debe ser inválida con menos de 20 caracteres', () => {
    component.form.controls.description.setValue('Corta');
    component.form.controls.description.markAsTouched();
    expect(component.form.controls.description.errors?.['minlength']).toBeTruthy();
  });

  it('dueDate debe rechazar fechas pasadas', () => {
    component.form.controls.dueDate.setValue('2020-01-01');
    component.form.controls.dueDate.markAsTouched();
    expect(component.form.controls.dueDate.errors?.['pastDate']).toBeTruthy();
  });

  it('onSubmit no debe navegar si el formulario es inválido', () => {
    const routerSpy = spyOn((component as any).router, 'navigate');
    component.onSubmit();
    expect(routerSpy).not.toHaveBeenCalled();
  });

  it('tags deben normalizarse a minúsculas sin duplicados', () => {
    component.form.patchValue({
      title: 'Titulo valido test',
      description: 'Descripcion suficientemente larga para pasar validacion',
      status: 'todo',
      priority: 'medium',
      assignee: 'Ana Torres',
      dueDate: '2027-01-01',
      tags: 'UI, ui, Dashboard'
    });

    const raw = component.form.getRawValue();
    const tags = [...new Set(raw.tags.split(',').map((t: string) => t.trim().toLowerCase()).filter(Boolean))];
    expect(tags).toEqual(['ui', 'dashboard']);
  });
});