import { Component, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink  } from '@angular/router';
import { CartService } from '../cart.service';
import { AuthService } from '../auth.service';
import { Button } from '../shared/ui/button/button';

@Component({
  imports: [RouterLink, Button, NgOptimizedImage],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  cart = inject(CartService);
  auth = inject(AuthService);
  
  // count et clear restent là, sans changement
  shipping = signal('Calcul des frais de port…');

  constructor() {
    setTimeout(() => {
      this.shipping.set('Livraison offerte');
    }, 2000);
  }

}
