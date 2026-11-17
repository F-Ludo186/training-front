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
    await TestBed.configureTestingModule({
      imports: [Cart],
    }).compileComponents();

    fixture = TestBed.createComponent(Cart);
    cart = TestBed.inject(CartService);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('shows an empty message when the cart has no items', () => {
    expect(fixture.nativeElement.textContent).toContain('Ton panier est vide.');
  });

  it('shows grouped quantities, subtotals and total, and removes one item', () => {
    cart.add(product);
    cart.add(product);
    fixture.detectChanges();

    const line = fixture.nativeElement.querySelector('.cart-line') as HTMLLIElement;
    const details = line.querySelectorAll('.cart-line-details dd');
    const image = line.querySelector('.cart-product-image') as HTMLImageElement;
    expect(fixture.nativeElement.querySelectorAll('.cart-line').length).toBe(1);
    expect(image.getAttribute('src')).toBe(product.thumbnail);
    expect(details[1].textContent.trim()).toBe('2');
    expect(details[2].textContent).toContain('20.00 €');
    expect(fixture.nativeElement.querySelector('.cart-total strong').textContent).toContain('20.00 €');

    const removeButton = fixture.nativeElement.querySelector('.cart-line app-button button') as HTMLButtonElement;
    removeButton.click();
    fixture.detectChanges();

    expect(cart.lines()[0].quantity).toBe(1);
    expect(details[1].textContent.trim()).toBe('1');
    expect(details[2].textContent).toContain('10.00 €');
    expect(fixture.nativeElement.querySelector('.cart-total strong').textContent).toContain('10.00 €');
  });
});
