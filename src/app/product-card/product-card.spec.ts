import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CartService } from '../cart.service';
import { Product } from '../models/product.model';
import { ProductCard } from './product-card';

describe('ProductCard', () => {
  let fixture: ComponentFixture<ProductCard>;
  let cart: CartService;

  const product: Product = {
    id: 1,
    title: 'Essence Mascara',
    price: 9.99,
    thumbnail: '/mascara.webp',
    stock: 2,
    availabilityStatus: 'In Stock',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
      providers: [provideRouter([])],
    }).compileComponents();

    cart = TestBed.inject(CartService);
    cart.clear();
    fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', product);
    await fixture.whenStable();
  });

  it('affiche le produit reçu en entrée et un lien vers son détail', () => {
    const image = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    const link = fixture.nativeElement.querySelector('.product-card__link') as HTMLAnchorElement;
    expect(fixture.nativeElement.textContent).toContain('Essence Mascara');
    expect(fixture.nativeElement.textContent).toContain('9.99');
    expect(image.alt).toBe('Essence Mascara');
    expect(link.getAttribute('href')).toBe('/products/1');
  });

  it('ajoute le produit au panier et reflète la quantité du service', async () => {
    const addButton = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    addButton.click();
    await fixture.whenStable();

    expect(cart.quantityOf(product)).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Dans ton panier : 1');
  });

  it('masque l’action d’ajout lorsque le stock est nul', async () => {
    fixture.componentRef.setInput('product', { ...product, stock: 0 });
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('button')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Victime de son succès');
  });
});
