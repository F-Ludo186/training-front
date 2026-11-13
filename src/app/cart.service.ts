// src/app/cart.service.ts
import { Service, computed, signal } from '@angular/core';
import { Product } from './models/product.model';

@Service()
export class CartService {
  private readonly items = signal<Product[]>([]); // le panier : seul le service y touche

  readonly count = computed(() => this.items().length);
  readonly total = computed(() =>
    this.items().reduce((sum, product) => sum + product.price, 0),
  );

  constructor() {
    console.log("🛒 Un panier vient d'être fabriqué");
  }
  
  add(product: Product): void {
    this.items.update((items) => [...items, product]); // un nouveau tableau, comme toujours
  }

  clear(): void {
    this.items.set([]);
  }

  quantityOf(product: Product): number {
    return this.items().filter((item) => item.id === product.id).length;
  }
}