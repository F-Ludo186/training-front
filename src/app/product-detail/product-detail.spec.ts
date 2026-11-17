import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { CartService } from '../cart.service';
import { ProductApiService } from '../product-api.service';
import { Product } from '../models/product.model';
import { ProductDetail } from './product-detail';

describe('ProductDetail', () => {
  let fixture: ComponentFixture<ProductDetail>;
  const product: Product = {
    id: 7,
    title: 'Desk lamp',
    price: 45,
    thumbnail: '/lamp.webp',
    stock: 3,
    availabilityStatus: 'In Stock',
  };
  const api = { getById: vi.fn((id: number) => Promise.resolve(product)) };
  const cart = { add: vi.fn(), quantityOf: vi.fn(() => 0) };

  beforeEach(async () => {
    api.getById.mockReset().mockImplementation(() => Promise.resolve(product));
    cart.add.mockReset();
    await TestBed.configureTestingModule({
      imports: [ProductDetail],
      providers: [
        { provide: ProductApiService, useValue: api },
        { provide: CartService, useValue: cart },
      ],
    }).compileComponents();
  });

  async function createDetail(): Promise<void> {
    fixture = TestBed.createComponent(ProductDetail);
    fixture.componentRef.setInput('id', '7');
    await fixture.whenStable();
  }

  it('charge le produit à partir de l’entrée id', async () => {
    await createDetail();

    expect(api.getById).toHaveBeenCalledWith(7);
    expect(fixture.componentInstance.loading()).toBe(false);
    expect(fixture.componentInstance.product()).toEqual(product);
    expect(fixture.nativeElement.textContent).toContain('Desk lamp');
    expect(fixture.nativeElement.querySelector('img').alt).toBe('Desk lamp');
  });

  it('ajoute le produit disponible au panier', async () => {
    await createDetail();
    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(cart.add).toHaveBeenCalledWith(product);
  });

  it('indique la rupture de stock et masque le bouton d’ajout', async () => {
    api.getById.mockResolvedValueOnce({ ...product, stock: 0, availabilityStatus: 'Out of Stock' });
    await createDetail();

    expect(fixture.nativeElement.textContent).toContain('Rupture de stock');
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });

  it('affiche le message introuvable si le chargement échoue', async () => {
    api.getById.mockRejectedValueOnce(new Error('not found'));
    await createDetail();

    expect(fixture.componentInstance.loading()).toBe(false);
    expect(fixture.componentInstance.product()).toBeUndefined();
    expect(fixture.nativeElement.textContent).toContain('Produit introuvable');
  });
});
