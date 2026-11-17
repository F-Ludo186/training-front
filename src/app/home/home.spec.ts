import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProductApiService } from '../product-api.service';
import { Home } from './home';

describe('Home', () => {
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        provideRouter([]),
        { provide: ProductApiService, useValue: { getAll: () => Promise.resolve([]) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
  });

  it('présente l’accueil et intègre la liste du catalogue', () => {
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Accueil');
    expect(fixture.nativeElement.textContent).toContain('Bienvenue');
    expect(fixture.nativeElement.querySelector('app-product-list')).not.toBeNull();
  });
});
