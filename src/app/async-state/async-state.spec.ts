import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsyncState } from './async-state';

@Component({
  imports: [AsyncState],
  template: `
    <app-async-state [loading]="loading()" [error]="error()" [loadingText]="loadingText()">
      <strong>Contenu chargé</strong>
    </app-async-state>
  `,
})
class AsyncStateHost {
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly loadingText = signal('Chargement du test…');
}

describe('AsyncState', () => {
  let fixture: ComponentFixture<AsyncStateHost>;
  let host: AsyncStateHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AsyncStateHost] }).compileComponents();
    fixture = TestBed.createComponent(AsyncStateHost);
    host = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('annonce le chargement avec le texte fourni', () => {
    const status = fixture.nativeElement.querySelector('[role="status"]') as HTMLElement;
    expect(status.textContent).toContain('Chargement du test');
  });

  it('affiche l’erreur à la place du contenu', async () => {
    host.loading.set(false);
    host.error.set('Échec du chargement');
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain('Échec du chargement');
    expect(fixture.nativeElement.textContent).not.toContain('Contenu chargé');
  });

  it('projette le contenu quand le chargement est terminé sans erreur', async () => {
    host.loading.set(false);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('strong')?.textContent).toBe('Contenu chargé');
  });
});
