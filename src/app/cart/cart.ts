import { Component, inject } from '@angular/core';
import { Button } from '../shared/ui/button/button';
import { CartService } from '../cart.service';

@Component({
  imports: [Button],
  selector: 'app-cart',
  styleUrl: './cart.css',
  templateUrl: './cart.html',
})
export class Cart {
  readonly cart = inject(CartService);
}
