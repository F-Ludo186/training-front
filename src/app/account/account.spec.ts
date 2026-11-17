import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { vi } from 'vitest';
import { AuthService } from '../auth.service';
import { User } from '../models/user.model';
import { Account } from './account';

describe('Account', () => {
  let fixture: ComponentFixture<Account>;
  let auth: { me: ReturnType<typeof vi.fn<( ) => Promise<User>>> };

  const user: User = {
    id: 1,
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.test',
    image: '/assets/ada.png',
    username: 'ada',
    gender: 'female',
  };

  beforeEach(async () => {
    auth = { me: vi.fn(() => Promise.resolve(user)) };

    await TestBed.configureTestingModule({
      imports: [Account],
      providers: [{ provide: AuthService, useValue: auth }],
    }).compileComponents();

    fixture = TestBed.createComponent(Account);
    await fixture.whenStable();
  });

  it('affiche le profil reçu et termine le chargement', () => {
    expect(fixture.componentInstance.loading()).toBe(false);
    expect(fixture.nativeElement.textContent).toContain('Ada Lovelace');
    expect(fixture.nativeElement.textContent).toContain('ada@example.test');
    expect((fixture.nativeElement.querySelector('img') as HTMLImageElement).alt).toBe('Avatar de Ada Lovelace');
  });

  it('affiche un message de session expirée en cas de réponse 401', async () => {
    auth.me.mockRejectedValueOnce(new HttpErrorResponse({ status: 401 }));
    fixture = TestBed.createComponent(Account);
    await fixture.whenStable();

    expect(fixture.componentInstance.error()).toContain('Ta session a expiré');
    expect(fixture.nativeElement.textContent).toContain('Ta session a expiré');
    expect(fixture.componentInstance.loading()).toBe(false);
  });

  it('affiche un message générique pour les autres erreurs', async () => {
    auth.me.mockRejectedValueOnce(new Error('offline'));
    fixture = TestBed.createComponent(Account);
    await fixture.whenStable();

    expect(fixture.componentInstance.error()).toContain('Impossible de charger');
    expect(fixture.componentInstance.loading()).toBe(false);
  });

});
