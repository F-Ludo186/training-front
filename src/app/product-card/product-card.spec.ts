import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Product } from '../models/product.model';
import { ProductCard } from './product-card';

describe('ProductCard', () => {
  let component: ProductCard;
  let fixture: ComponentFixture<ProductCard>;
  const product: Product = {
    id: 1,
    title: 'Test product',
    price: 10,
    thumbnail: 'test.jpg',
    stock: 1,
    availabilityStatus: 'In Stock',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', product);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('links the card to the product detail page', () => {
    const link = fixture.nativeElement.querySelector(
      '.product-card__link',
    ) as HTMLAnchorElement | null;

    expect(link?.getAttribute('href')).toBe('/products/1');
  });
});
