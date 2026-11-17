import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartService } from '../cart.service';
import { Product } from '../models/product.model';
import { Cart } from './cart';

describe('Cart', () => {
  let fixture: ComponentFixture<Cart>;
  let cart: CartService;

  const product: Product = {
    id: 1,
    title: 'T-shirt',
    price: 10,
    thumbnail: '/assets/t-shirt.png',
    stock: 5,
    availabilityStatus: 'In Stock',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Cart] }).compileComponents();
    cart = TestBed.inject(CartService);
    cart.clear();
    fixture = TestBed.createComponent(Cart);
    await fixture.whenStable();
  });

  it('affiche un état vide lorsque le panier ne contient aucun article', () => {
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain('Ton panier est vide');
    expect(fixture.nativeElement.querySelector('.cart-lines')).toBeNull();
  });

  it('regroupe les produits identiques et calcule quantités, sous-totaux et total', async () => {
    cart.add(product);
    cart.add(product);
    await fixture.whenStable();

    const line = fixture.nativeElement.querySelector('.cart-line') as HTMLLIElement;
    const details = line.querySelectorAll('.cart-line-details dd');
    expect(fixture.nativeElement.querySelectorAll('.cart-line')).toHaveLength(1);
    expect((line.querySelector('img') as HTMLImageElement).getAttribute('src')).toBe(product.thumbnail);
    expect(details[1].textContent.trim()).toBe('2');
    expect(details[2].textContent).toContain('20.00');
    expect(fixture.nativeElement.querySelector('.cart-total strong')?.textContent).toContain('20.00');
  });

  it('retire un seul exemplaire avec le bouton de ligne et recalcule le total', async () => {
    cart.add(product);
    cart.add(product);
    await fixture.whenStable();

    (fixture.nativeElement.querySelector('.cart-line app-button button') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(cart.quantityOf(product)).toBe(1);
    const quantities = fixture.nativeElement.querySelectorAll('.cart-line-details dd');
    expect(quantities[1].textContent).toContain('1');
    expect(fixture.nativeElement.querySelector('.cart-total strong')?.textContent).toContain('10.00');
  });
});
