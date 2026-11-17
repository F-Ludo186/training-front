import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('envoie les identifiants et conserve le token reçu', async () => {
    const promise = service.login('ada', 'secret');
    const request = http.expectOne('https://dummyjson.com/auth/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ username: 'ada', password: 'secret' });

    request.flush({
      id: 1,
      username: 'ada',
      firstName: 'Ada',
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
    await expect(promise).resolves.toBeUndefined();
    expect(service.token()).toBe('access-token');
    expect(localStorage.getItem('token')).toBe('access-token');
    expect(service.isLoggedIn()).toBe(true);
  });

  it('ne crée pas de session si la connexion échoue', async () => {
    const promise = service.login('ada', 'wrong');
    http.expectOne('https://dummyjson.com/auth/login').flush(
      { message: 'Invalid credentials' },
      { status: 401, statusText: 'Unauthorized' },
    );

    await expect(promise).rejects.toBeInstanceOf(HttpErrorResponse);
    expect(service.token()).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
  });

  it('charge le profil depuis /auth/me', async () => {
    const promise = service.me();
    const request = http.expectOne('https://dummyjson.com/auth/me');
    expect(request.request.method).toBe('GET');
    const user = {
      id: 1,
      username: 'ada',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.test',
      gender: 'female',
      image: '/ada.png',
    };
    request.flush(user);

    await expect(promise).resolves.toEqual(user);
  });

  it('efface le token du signal et du stockage lors de la déconnexion', () => {
    service.token.set('old-token');
    localStorage.setItem('token', 'old-token');

    service.logout();

    expect(service.token()).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
  });

  it('considère un token vide ou composé d’espaces comme une session absente', () => {
    service.token.set('');
    expect(service.isLoggedIn()).toBe(false);

    service.token.set('   ');
    expect(service.isLoggedIn()).toBe(false);

    service.token.set('valid-token');
    expect(service.isLoggedIn()).toBe(true);
  });
});
