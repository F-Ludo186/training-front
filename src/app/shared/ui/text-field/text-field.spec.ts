import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextField } from './text-field';

@Component({
  imports: [TextField],
  template: `
    <app-text-field
      inputId="test-field"
      label="Test field"
      [type]="type()"
      [value]="value()"
      (valueChange)="value.set($event)"
      [touched]="touched()"
      [invalid]="invalid()"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [required]="required()"
      [errors]="errors()"
      (touch)="touched.set(true)"
    />
  `,
})
class TextFieldHost {
  readonly type = signal<'text' | 'email' | 'password' | 'number'>('text');
  readonly value = signal<string | number>('');
  readonly touched = signal(false);
  readonly invalid = signal(false);
  readonly disabled = signal(false);
  readonly readonly = signal(false);
  readonly required = signal(false);
  readonly errors = signal([{ kind: 'required', message: 'Ce champ est obligatoire.' }]);
}

describe('TextField', () => {
  let fixture: ComponentFixture<TextFieldHost>;
  let host: TextFieldHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TextFieldHost] }).compileComponents();
    fixture = TestBed.createComponent(TextFieldHost);
    host = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('associe le label à l’input et reflète les propriétés natives', async () => {
    host.required.set(true);
    host.disabled.set(true);
    host.readonly.set(true);
    await fixture.whenStable();

    const label = fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(label.htmlFor).toBe(input.id);
    expect(input.required).toBe(true);
    expect(input.disabled).toBe(true);
    expect(input.readOnly).toBe(true);
  });

  it('met à jour le signal lié pour une saisie texte et signale le blur', async () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'Ada';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(host.value()).toBe('Ada');

    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(host.touched()).toBe(true);
  });

  it('convertit une saisie numérique en nombre', async () => {
    host.type.set('number');
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '12.5';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(host.value()).toBe(12.5);
  });

  it('n’annonce les erreurs que lorsque le champ invalide a été touché', async () => {
    host.invalid.set(true);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();

    host.touched.set(true);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe('test-field-error');
    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain('obligatoire');
  });
});
