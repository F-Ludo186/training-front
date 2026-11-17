import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { AuthService } from './auth.service';
import { authInterceptor } from './auth-interceptor';

describe('authInterceptor', () => {
  let client: HttpClient;
  let http: HttpTestingController;
  const auth = { token: signal<string | null>(null) };

  beforeEach(() => {
    auth.token.set(null);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: auth },
      ],
    });
    client = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('ajoute le bearer token aux requêtes vers DummyJSON', () => {
    auth.token.set('valid-token');
    client.get('https://dummyjson.com/products').subscribe();
    const request = http.expectOne('https://dummyjson.com/products');

    expect(request.request.headers.get('Authorization')).toBe('Bearer valid-token');
    request.flush({});
  });

  it('n’ajoute aucun bearer token quand le token est absent', () => {
    client.get('https://dummyjson.com/products').subscribe();
    const request = http.expectOne('https://dummyjson.com/products');

    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({});
  });

  it('ne transmet pas le token à un autre domaine', () => {
    auth.token.set('private-token');
    client.get('https://example.test/products').subscribe();
    const request = http.expectOne('https://example.test/products');

    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({});
  });
});
