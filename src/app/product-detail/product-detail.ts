import { Component, input , inject, signal, OnInit} from '@angular/core';
import { CartService } from '../cart.service';
import { ProductApiService } from '../product-api.service';
import { Product } from '../models/product.model';
import { AsyncState } from '../async-state/async-state';

@Component({
  imports: [AsyncState],
  selector: 'app-product-detail',
  styleUrl: './product-detail.css',
  templateUrl: './product-detail.html',
})
export class ProductDetail implements OnInit{
  private readonly productApi = inject(ProductApiService);

  cart = inject(CartService);
  id = input.required<string>(); 
  
  product = signal<Product | undefined>(undefined);
  loading = signal(true);
  error = signal<string | null>(null);    

  async ngOnInit(): Promise<void> {
    try {
      this.product.set(await this.productApi.getById(Number(this.id())));
    } catch {
      this.product.set(undefined); // 404, ou réseau coupé : le @else affiche « Produit introuvable »
    } finally {
      this.loading.set(false);
    }
  }
}
