import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Product } from './models/product.model';
import { NewProduct, ProductApiService } from './product-api.service';

describe('ProductApiService', () => {
  let service: ProductApiService;
  let http: HttpTestingController;

  const product: Product = {
    id: 9,
    title: 'Dolce Shine Eau de',
    price: 70,
    thumbnail: '/dolce-shine.webp',
    stock: 5,
    availabilityStatus: 'In Stock',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('récupère les produits avec la limite demandée et renvoie le tableau', async () => {
    const promise = service.getAll();
    const request = http.expectOne('https://dummyjson.com/products?limit=12');
    expect(request.request.method).toBe('GET');

    request.flush({ products: [product], total: 1, skip: 0, limit: 12 });
    await expect(promise).resolves.toEqual([product]);
  });

  it('récupère un produit par son identifiant', async () => {
    const promise = service.getById(product.id);
    const request = http.expectOne(`https://dummyjson.com/products/${product.id}`);
    expect(request.request.method).toBe('GET');

    request.flush(product);
    await expect(promise).resolves.toEqual(product);
  });

  it('propage une erreur 404 lorsqu’un produit est introuvable', async () => {
    const promise = service.getById(999);
    const request = http.expectOne('https://dummyjson.com/products/999');
    request.flush(
      { message: "Product with id '999' not found" },
      { status: 404, statusText: 'Not Found' },
    );

    await expect(promise).rejects.toMatchObject({ status: 404, statusText: 'Not Found' });
  });

  it('crée un produit avec POST et renvoie la réponse du serveur', async () => {
    const newProduct: NewProduct = { title: 'Desk lamp', price: 45, stock: 3 };
    const promise = service.add(newProduct);
    const request = http.expectOne('https://dummyjson.com/products/add');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(newProduct);

    request.flush({ ...product, ...newProduct });
    await expect(promise).resolves.toEqual({ ...product, ...newProduct });
  });

  it('met à jour un produit par PUT avec son identifiant et son contenu', async () => {
    const updatedProduct = { ...product, title: 'Updated lamp', price: 50 };
    const promise = service.update(updatedProduct);
    const request = http.expectOne(`https://dummyjson.com/products/${product.id}`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(updatedProduct);

    request.flush(updatedProduct);
    await expect(promise).resolves.toEqual(updatedProduct);
  });

  it('supprime un produit par DELETE et renvoie la réponse du serveur', async () => {
    const promise = service.remove(product.id);
    const request = http.expectOne(`https://dummyjson.com/products/${product.id}`);
    expect(request.request.method).toBe('DELETE');

    request.flush(product);
    await expect(promise).resolves.toEqual(product);
  });
});
