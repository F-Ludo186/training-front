import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Button } from './button';

@Component({
  imports: [Button],
  template: '<app-button [type]="type()" [disabled]="disabled()">{{ label() }}</app-button>',
})
class ButtonHost {
  readonly type = signal<'button' | 'submit' | 'reset'>('button');
  readonly disabled = signal(false);
  readonly label = signal('Ajouter');
}

describe('Button', () => {
  let fixture: ComponentFixture<ButtonHost>;
  let host: ButtonHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ButtonHost] }).compileComponents();
    fixture = TestBed.createComponent(ButtonHost);
    host = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('projette son libellé et utilise button par défaut', () => {
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.type).toBe('button');
    expect(button.textContent).toContain('Ajouter');
  });

  it('reflète les changements de type et d’état désactivé des signaux liés', async () => {
    host.type.set('submit');
    host.disabled.set(true);
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.type).toBe('submit');
    expect(button.disabled).toBe(true);
  });
});
