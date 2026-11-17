// src/app/cart.service.ts
import { Service, computed, signal } from '@angular/core';
import { Product } from './models/product.model';

export type CartLine = {
  product: Product;
  quantity: number;
};

@Service()
export class CartService {
  private readonly items = signal<Product[]>([]); // le panier : seul le service y touche

  readonly count = computed(() => this.items().length);
  readonly lines = computed(() => {
    const lines = new Map<number, CartLine>();

    for (const product of this.items()) {
      const line = lines.get(product.id);
      if (line) {
        line.quantity += 1;
      } else {
        lines.set(product.id, { product, quantity: 1 });
      }
    }

    return [...lines.values()];
  });
  readonly total = computed(() =>
    this.items().reduce((sum, product) => sum + product.price, 0),
  );

  constructor() {
    console.log("🛒 Un panier vient d'être fabriqué");
  }
  
  add(product: Product): void {
    this.items.update((items) => [...items, product]); // un nouveau tableau, comme toujours
  }

  removeOne(product: Product): void {
    this.items.update((items) => {
      let index = -1;
      for (let currentIndex = items.length - 1; currentIndex >= 0; currentIndex--) {
        if (items[currentIndex].id === product.id) {
          index = currentIndex;
          break;
        }
      }

      return index === -1
        ? items
        : [...items.slice(0, index), ...items.slice(index + 1)];
    });
  }

  clear(): void {
    this.items.set([]);
  }

  quantityOf(product: Product): number {
    return this.items().filter((item) => item.id === product.id).length;
  }
}