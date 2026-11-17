import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { ProductApiService } from '../product-api.service';
import { Product } from '../models/product.model';
import { ProductList } from './product-list';

describe('ProductList', () => {
  let fixture: ComponentFixture<ProductList>;
  const products: Product[] = [
    { id: 1, title: 'Book', price: 20, thumbnail: '/book.webp', stock: 2, availabilityStatus: 'In Stock' },
    { id: 2, title: 'Watch', price: 1500, thumbnail: '/watch.webp', stock: 4, availabilityStatus: 'Low Stock' },
    { id: 3, title: 'Sofa', price: 2500, thumbnail: '/sofa.webp', stock: 0, availabilityStatus: 'Out of Stock' },
  ];
  const api = { getAll: vi.fn<() => Promise<Product[]>>() };

  beforeEach(async () => {
    api.getAll.mockReset().mockResolvedValue(products);
    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [
        provideRouter([]),
        { provide: ProductApiService, useValue: api },
      ],
    }).compileComponents();
  });

  async function createList(): Promise<void> {
    fixture = TestBed.createComponent(ProductList);
    await fixture.whenStable();
  }

  it('charge les produits et calcule la liste complète par défaut', async () => {
    await createList();

    expect(api.getAll).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.loading()).toBe(false);
    expect(fixture.componentInstance.visibleProducts()).toHaveLength(3);
    expect(fixture.nativeElement.querySelectorAll('app-product-card')).toHaveLength(3);
    expect(fixture.nativeElement.textContent).toContain('Plus que 4');
  });

  it('filtre les produits en stock et les produits de luxe à partir du signal filter', async () => {
    await createList();

    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    buttons[1].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.filter()).toBe('inStock');
    expect(fixture.componentInstance.visibleProducts().map((product) => product.id)).toEqual([1, 2]);
    expect(fixture.nativeElement.querySelectorAll('li')).toHaveLength(2);
    expect(fixture.nativeElement.querySelectorAll('app-product-card')).toHaveLength(2);

    buttons[2].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.filter()).toBe('luxury');
    expect(fixture.componentInstance.visibleProducts().map((product) => product.id)).toEqual([2, 3]);
    expect(fixture.nativeElement.querySelectorAll('li')).toHaveLength(2);
    expect(fixture.nativeElement.querySelectorAll('app-product-card')).toHaveLength(2);
    expect(fixture.nativeElement.textContent).toContain('Watch');
    expect(fixture.nativeElement.textContent).toContain('Sofa');
    expect(fixture.nativeElement.textContent).not.toContain('Book');
  });

  it('affiche une erreur et termine le chargement en cas d’échec API', async () => {
    api.getAll.mockRejectedValueOnce(new Error('offline'));
    await createList();

    expect(fixture.componentInstance.loading()).toBe(false);
    expect(fixture.componentInstance.error()).toContain('catalogue est indisponible');
    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain('catalogue est indisponible');
  });
});
