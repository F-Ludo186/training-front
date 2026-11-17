import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MentionsLegales } from './mentions-legales';

describe('MentionsLegales', () => {
  let fixture: ComponentFixture<MentionsLegales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [MentionsLegales] }).compileComponents();
    fixture = TestBed.createComponent(MentionsLegales);
    await fixture.whenStable();
  });

  it('affiche les sections légales et les moyens de contact et de recours', () => {
    const headingElements = fixture.nativeElement.querySelectorAll('h2') as NodeListOf<HTMLHeadingElement>;
    const headings = Array.from(headingElements, (heading) => heading.textContent?.trim());
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Mentions légales');
    expect(headings).toContain('Éditeur du site');
    expect(headings).toContain('Hébergement');
    expect(headings).toContain('Données traitées');
    expect(fixture.nativeElement.querySelector('a[href="https://www.cnil.fr/fr/plaintes"]')).not.toBeNull();
  });
});
