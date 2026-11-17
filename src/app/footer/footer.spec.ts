import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Footer } from './footer';

describe('Footer', () => {
  let fixture: ComponentFixture<Footer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    await fixture.whenStable();
  });

  it('affiche les informations de pied de page et le lien des mentions légales', () => {
    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(fixture.nativeElement.textContent).toContain('LF2026');
    expect(link.textContent).toContain('Mentions légales');
    expect(link.getAttribute('href')).toBe('/mentions-legales');
  });
});
