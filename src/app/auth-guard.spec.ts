import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { authGuard } from './auth-guard';
import { AuthService } from './auth.service';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));
  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('autorise la navigation avec un token non vide', () => {
    TestBed.inject(AuthService).token.set('valid-token');

    expect(executeGuard(route, state)).toBe(true);
  });

  it.each([null, '', '   '])('redirige vers /login quand le token vaut %s', (token) => {
    TestBed.inject(AuthService).token.set(token);

    const result = executeGuard(route, state);
    expect(result).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/login');
  });

  it('réévalue l’accès lorsque le signal du token change', () => {
    const auth = TestBed.inject(AuthService);
    auth.token.set(null);
    expect(executeGuard(route, state)).toBeInstanceOf(UrlTree);

    auth.token.set('new-token');
    expect(executeGuard(route, state)).toBe(true);
  });
});
