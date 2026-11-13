import { Component , signal, inject} from '@angular/core';
import { RouterLink  } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  imports: [RouterLink ],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  cart = inject(CartService);

  // count et clear restent là, sans changement
  shipping = signal('Calcul des frais de port…');

  constructor() {
    setTimeout(() => {
      this.shipping.set('Livraison offerte');
    }, 2000);
  }

}
