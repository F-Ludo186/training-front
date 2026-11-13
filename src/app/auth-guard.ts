import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

const isLoggedIn = false; // Remplacez cette valeur par la logique réelle de vérification de l'authentification

export const authGuard: CanActivateFn = (route, state) => {
  if (isLoggedIn) {
    return true;
  }
  return inject(Router).parseUrl('/login'); // pas connecté : direction la page de connexion
};