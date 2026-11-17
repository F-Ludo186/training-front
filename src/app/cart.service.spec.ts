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

  it('commence avec un panier vide et des totaux nuls', () => {
    expect(service.count()).toBe(0);
    expect(service.lines()).toEqual([]);
    expect(service.total()).toBe(0);
    expect(service.quantityOf(firstProduct)).toBe(0);
  });

  it('compte les unités et regroupe les objets ayant le même identifiant', () => {
    const sameProductFromAnotherResponse = { ...firstProduct };
    service.add(firstProduct);
    service.add(sameProductFromAnotherResponse);
    service.add(secondProduct);

    expect(service.count()).toBe(3);
    expect(service.quantityOf(sameProductFromAnotherResponse)).toBe(2);
    expect(service.lines()).toEqual([
      { product: firstProduct, quantity: 2 },
      { product: secondProduct, quantity: 1 },
    ]);
    expect(service.total()).toBe(33);
  });

  it('retire une occurrence par identifiant et ignore un produit absent', () => {
    service.add(firstProduct);
    service.add({ ...firstProduct });
    service.add(secondProduct);

    service.removeOne({ ...firstProduct });
    expect(service.quantityOf(firstProduct)).toBe(1);
    expect(service.count()).toBe(2);
    expect(service.total()).toBe(20.5);

    service.removeOne({ ...firstProduct, id: 99 });
    expect(service.quantityOf(firstProduct)).toBe(1);
    expect(service.count()).toBe(2);
  });

  it('vide le panier et recalcule les signaux dérivés', () => {
    service.add(firstProduct);
    service.add(secondProduct);

    service.clear();

    expect(service.count()).toBe(0);
    expect(service.lines()).toEqual([]);
    expect(service.total()).toBe(0);
  });
});
