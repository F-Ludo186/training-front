import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NotFound } from './not-found';

describe('NotFound', () => {
  let fixture: ComponentFixture<NotFound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFound],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFound);
    await fixture.whenStable();
  });

  it('explique que la page est inconnue et fournit un lien de retour', () => {
    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(fixture.nativeElement.querySelector('h2')?.textContent).toContain("Cette page n'existe pas");
    expect(link.textContent).toContain("Retour à l'accueil");
    expect(link.getAttribute('href')).toBe('/');
  });
});
