import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { AuthService } from '../auth.service';
import { CartService } from '../cart.service';
import { Header } from './header';

@Component({ template: '' })
class LoginRouteStub {}

describe('Header', () => {
  let fixture: ComponentFixture<Header>;
  const cart = {
    count: signal(0),
    total: signal(0),
    clear: vi.fn(),
  };
  const auth = {
    isLoggedIn: signal(false),
    logout: vi.fn(),
  };

  beforeEach(async () => {
    cart.count.set(0);
    cart.total.set(0);
    cart.clear.mockClear();
    auth.isLoggedIn.set(false);
    auth.logout.mockClear();

    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        provideRouter([{ path: 'login', component: LoginRouteStub }]),
        { provide: CartService, useValue: cart },
        { provide: AuthService, useValue: auth },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    await fixture.whenStable();
  });

  it('affiche le résumé du panier, le lien de connexion et une icône accessible pour le vider', () => {
    cart.count.set(2);
    cart.total.set(19.98);
    return fixture.whenStable().then(() => {
      expect(fixture.nativeElement.textContent).toContain('2 article(s)');
      expect(fixture.nativeElement.textContent).toContain('19.98');
      expect(fixture.nativeElement.textContent).toContain('Connexion');
      expect((fixture.nativeElement.querySelector('.cart-summary img') as HTMLImageElement).alt).toBe('Vider le panier');
    });
  });

  it('efface le panier et déconnecte un utilisateur connecté', async () => {
    auth.isLoggedIn.set(true);
    await fixture.whenStable();

    const clearButton = fixture.nativeElement.querySelector('.cart-summary app-button button') as HTMLButtonElement;
    clearButton.click();
    const logoutLink = fixture.nativeElement.querySelector('.auth-link') as HTMLAnchorElement;
    logoutLink.click();
    await fixture.whenStable();

    expect(cart.clear).toHaveBeenCalledOnce();
    expect(auth.logout).toHaveBeenCalledOnce();
    expect(logoutLink.textContent).toContain('Déconnexion');
  });

  it('met à jour le signal des frais de livraison', async () => {
    fixture.componentInstance.shipping.set('Livraison offerte');
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Livraison offerte');
  });
});
