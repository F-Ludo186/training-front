import { Component , input, output, signal, computed} from '@angular/core';
import { Product } from '../models/product.model';
import { RouterLink  } from '@angular/router';

@Component({
  imports: [RouterLink ],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  cart = input.required<Product[]>();
  clear = output<void>();

  // count et clear restent là, sans changement
  shipping = signal('Calcul des frais de port…');

  constructor() {
    setTimeout(() => {
      this.shipping.set('Livraison offerte');
    }, 2000);
  }

  count = computed(() => this.cart().length); // se recalcule quand cart change
  total = computed(() =>
    this.cart().reduce((sum, product) => sum + product.price, 0),
  );
}
