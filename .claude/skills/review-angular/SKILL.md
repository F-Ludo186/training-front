---
name: review-angular
description: Relit du code Angular sans le modifier, avec la grille du module. À utiliser quand l'utilisateur demande de relire, vérifier ou critiquer un composant, un service, une route ou un formulaire Angular.
---

# Review Angular

- Ne modifie aucun fichier. Liste les problèmes, du plus grave au moins grave.
- Pour chaque problème : la ligne, le risque pour l'utilisateur, le concept en cause.
- Passe la grille : mutation sur place, donnée en double, comparaison d'objets par `===`,
  service fabriqué avec `new`, appel HTTP sans chargement ni erreur.
- À compléter : les autres lignes de la grille.
- Termine par une question à l'utilisateur sur le point le plus grave.