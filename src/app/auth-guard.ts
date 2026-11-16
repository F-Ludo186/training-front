import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

const isLoggedIn = false; // Remplacez cette valeur par la logique réelle de vérification de l'authentification

export const authGuard: CanActivateFn = (route, state) => {
  if (inject(AuthService).isLoggedIn()) {
    return true;
  }
  return inject(Router).parseUrl('/login'); // pas connecté : direction la page de connexion
};