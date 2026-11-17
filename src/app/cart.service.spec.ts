import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product } from './models/product.model';

const firstProduct: Product = {
  id: 1,
  title: 'T-shirt',
  price: 12.5,
  thumbnail: '',
  stock: 5,
  availabilityStatus: 'In Stock',
};

const secondProduct: Product = {
  id: 2,
  title: 'Cap',
  price: 8,
  thumbnail: '',
  stock: 3,
  availabilityStatus: 'In Stock',
};

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('groups products into lines and removes one matching item at a time', () => {
    for (let quantity = 0; quantity < 5; quantity++) {
      service.add(firstProduct);
      service.add(secondProduct);
    }
    service.add(firstProduct);

    expect(service.lines()).toEqual([
      { product: firstProduct, quantity: 6 },
      { product: secondProduct, quantity: 5 },
    ]);
    expect(service.total()).toBe(115);

    service.removeOne(firstProduct);

    expect(service.lines()).toEqual([
      { product: firstProduct, quantity: 5 },
      { product: secondProduct, quantity: 5 },
    ]);
    expect(service.total()).toBe(102.5);

    service.removeOne(firstProduct);

    expect(service.lines()).toEqual([
      { product: firstProduct, quantity: 4 },
      { product: secondProduct, quantity: 5 },
    ]);
    expect(service.total()).toBe(90);
  });
});
