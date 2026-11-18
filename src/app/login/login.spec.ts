import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { vi } from 'vitest';
import { AuthService } from '../auth.service';
import { Login } from './login';

describe('Login', () => {
  let fixture: ComponentFixture<Login>;
  const auth = { login: vi.fn(() => Promise.resolve()) };

  beforeEach(async () => {
    auth.login.mockReset().mockResolvedValue(undefined);
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([]), { provide: AuthService, useValue: auth }],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    await fixture.whenStable();
  });

  async function submitCredentials(username: string, password: string): Promise<void> {
    const usernameInput = fixture.nativeElement.querySelector('#username') as HTMLInputElement;
    const passwordInput = fixture.nativeElement.querySelector('#password') as HTMLInputElement;
    usernameInput.value = username;
    passwordInput.value = password;
    usernameInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    fixture.nativeElement.querySelector('form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
  }

  it('affiche les champs de connexion et leurs libellés', () => {
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Connexion');
    expect((fixture.nativeElement.querySelector('#username') as HTMLInputElement).type).toBe('text');
    expect((fixture.nativeElement.querySelector('#password') as HTMLInputElement).type).toBe('password');
    expect(fixture.nativeElement.textContent).toContain("Nom d'utilisateur");
    expect(fixture.nativeElement.textContent).toContain('Mot de passe');
  });

  it('appelle le service et navigue vers le compte après une connexion réussie', async () => {
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    await submitCredentials('ada', 'secret1');

    expect(auth.login).toHaveBeenCalledWith('ada', 'secret1');
    expect(fixture.componentInstance.credentials()).toEqual({ username: '', password: '' });
    expect(navigate).toHaveBeenCalledWith('/account');
    expect(fixture.componentInstance.error()).toBeNull();
  });

  it('ne soumet pas des champs vides ou plus courts que les minimums', async () => {
    await submitCredentials('', '');
    await submitCredentials('ad', 'secret');
    await submitCredentials('ada', 'short');

    expect(auth.login).not.toHaveBeenCalled();
  });

  it('refuse un nom d’utilisateur composé uniquement d’espaces', async () => {
    await submitCredentials('   ', 'secret1');

    expect(auth.login).not.toHaveBeenCalled();
  });

  it('expose et affiche une erreur si le service refuse la connexion', async () => {
    auth.login.mockRejectedValueOnce(new Error('invalid credentials'));
    await submitCredentials('ada', 'incorrect');

    expect(fixture.componentInstance.error()).toContain('La connexion a échoué');
    expect(fixture.nativeElement.querySelector('.error')?.textContent).toContain('Identifiant ou mot de passe incorrect');
    expect(fixture.componentInstance.credentials().password).toBe('');
  });

  it('affiche le refus quand le service renvoie une erreur HTTP 400', async () => {
    auth.login.mockRejectedValueOnce(new HttpErrorResponse({ status: 400, statusText: 'Bad Request' }));
    const page: HTMLElement = fixture.nativeElement;
    const type = (selector: string, value: string) => {
      const field = page.querySelector<HTMLInputElement>(selector)!;
      field.value = value;
      field.dispatchEvent(new Event('input')); // comme une frappe : le modèle suit
    };
    type('#username', 'emilys');
    type('#password', 'fauxxx');
    page.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    await fixture.whenStable();

    expect(auth.login).toHaveBeenCalledWith('emilys', 'fauxxx');
    expect(page.querySelector('.error')?.textContent).toContain('Identifiant ou mot de passe incorrect');
  });

  // Vérifie qu’un identifiant contenant du HTML est transmis comme donnée et n’est jamais rendu comme balisage.
  it('ne rend pas un payload HTML fourni dans le nom d’utilisateur', async () => {
    const payload = '<img src=x onerror=alert(1)>';
    vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);

    await submitCredentials(payload, 'secret1');

    expect(auth.login).toHaveBeenCalledWith(payload, 'secret1');
    expect(fixture.nativeElement.querySelector('img')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain(payload);
  });

  // Vérifie qu’un message d’erreur non fiable venant du serveur n’est pas injecté dans le DOM.
  it('n’insère pas un payload HTML reçu dans une erreur de connexion', async () => {
    const payload = '<img src=x onerror=alert(1)>';
    auth.login.mockRejectedValueOnce(new Error(payload));

    await submitCredentials('emilys', 'secret1');

    expect(fixture.nativeElement.querySelector('.error')?.textContent).toContain('Identifiant ou mot de passe incorrect');
    expect(fixture.nativeElement.querySelector('img')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain(payload);
  });

  // Vérifie qu’après authentification, le composant ne garde pas le mot de passe en clair dans un autre signal.
  it('ne conserve pas le mot de passe en mémoire après une connexion réussie', async () => {
    vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);

    await submitCredentials('ada', 'secret1');

    expect(fixture.componentInstance.credentials().password).toBe('');
  });

  // Vérifie qu’un double clic pendant une requête en attente ne déclenche pas plusieurs tentatives de connexion.
  it('ne lance pas plusieurs connexions si le formulaire est soumis plusieurs fois pendant l’attente', async () => {
    let resolveLogin!: () => void;
    auth.login.mockImplementation(() => new Promise<void>((resolve) => { resolveLogin = resolve; }));
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const usernameInput = fixture.nativeElement.querySelector('#username') as HTMLInputElement;
    const passwordInput = fixture.nativeElement.querySelector('#password') as HTMLInputElement;
    usernameInput.value = 'ada';
    passwordInput.value = 'secret1';
    usernameInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(auth.login).toHaveBeenCalledTimes(1);
    resolveLogin();
    await fixture.whenStable();
  });
});
