// src/app/product-api.service.ts
import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Product, ProductsResponse } from './models/product.model';

export type NewProduct = Omit<Product, 'id' | 'thumbnail' | 'availabilityStatus'>;

@Service()
export class ProductApiService {
  private readonly http = inject(HttpClient);
  private readonly url = 'https://dummyjson.com/products';

  async getAll(): Promise<Product[]> { // la promesse faite aux composants : un tableau de produits
    const response = await firstValueFrom(this.http.get<ProductsResponse>(`${this.url}?limit=12`)); // 12 produits sur 194
    return response.products;
  }

  getById(id: number): Promise<Product> {
    return firstValueFrom(this.http.get<Product>(`${this.url}/${id}`));
  }

  add(product: NewProduct): Promise<Product> {
    return firstValueFrom(this.http.post<Product>(`${this.url}/add`, product)); // le corps, en 2ᵉ argument
  }

  update(product: Product): Promise<Product> {
    return firstValueFrom(this.http.put<Product>(`${this.url}/${product.id}`, product));
  }

  remove(id: number): Promise<Product> {
    return firstValueFrom(this.http.delete<Product>(`${this.url}/${id}`));
  }
}