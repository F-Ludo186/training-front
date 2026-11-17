import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { Product } from '../models/product.model';
import { NewProduct, ProductApiService } from '../product-api.service';
import { ProductForm } from './product-form';

describe('ProductForm', () => {
  let fixture: ComponentFixture<ProductForm>;
  const created: Product = {
    id: 12,
    title: 'Desk lamp',
    price: 45,
    stock: 3,
    thumbnail: '/lamp.webp',
    availabilityStatus: 'In Stock',
  };
  const api = { add: vi.fn((product: NewProduct) => Promise.resolve({ ...created, ...product })) };

  beforeEach(async () => {
    api.add.mockReset().mockImplementation((product) => Promise.resolve({ ...created, ...product }));
    await TestBed.configureTestingModule({
      imports: [ProductForm],
      providers: [{ provide: ProductApiService, useValue: api }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductForm);
    await fixture.whenStable();
  });

  async function submitProduct(title: string, price: string, stock: string): Promise<void> {
    const values = { title, price, stock };
    for (const [id, value] of Object.entries(values)) {
      const input = fixture.nativeElement.querySelector(`#${id}`) as HTMLInputElement;
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }
    await fixture.whenStable();
    fixture.nativeElement.querySelector('form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
  }

  it('affiche les trois contrôles associés à leurs libellés', () => {
    const inputs = fixture.nativeElement.querySelectorAll('input') as NodeListOf<HTMLInputElement>;
    const ids = Array.from(inputs, (input) => input.id);
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Ajouter un produit');
    expect(ids).toEqual(['title', 'price', 'stock']);
    expect(fixture.nativeElement.querySelectorAll('label')).toHaveLength(3);
  });

  it('relie les modifications du champ texte au signal product', async () => {
    const title = fixture.nativeElement.querySelector('#title') as HTMLInputElement;
    title.value = 'Desk lamp';
    title.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(fixture.componentInstance.product().title).toBe('Desk lamp');
  });

  it('envoie le signal du formulaire et affiche le produit créé', async () => {
    const product = { title: 'Desk lamp', price: 45, stock: 3 };
    fixture.componentInstance.product.set(product);
    await fixture.componentInstance.send();
    await fixture.whenStable();

    expect(api.add).toHaveBeenCalledWith(product);
    expect(fixture.componentInstance.created()).toEqual(created);
    expect(fixture.componentInstance.product()).toEqual({ title: '', price: 0, stock: 0 });
    expect(fixture.nativeElement.textContent).toContain('Desk lamp');
  });

  it('stocke un message dans le signal error si la création échoue', async () => {
    api.add.mockRejectedValueOnce(new Error('offline'));
    await fixture.componentInstance.send();

    expect(fixture.componentInstance.error()).toContain("L'envoi a échoué");
  });

  it('refuse les valeurs vides et un nom plus court que trois caractères', async () => {
    await submitProduct('', '', '');
    expect(api.add).not.toHaveBeenCalled();

    await submitProduct('ab', '10', '1');
    expect(api.add).not.toHaveBeenCalled();
  });

  it('refuse un prix nul ou un stock fractionnaire', async () => {
    await submitProduct('Lamp', '0', '1');
    expect(api.add).not.toHaveBeenCalled();

    await submitProduct('Lamp', '0.01', '1.5');
    expect(api.add).not.toHaveBeenCalled();
  });

  it('refuse un nom composé uniquement d’espaces et un stock négatif', async () => {
    await submitProduct('   ', '10', '1');
    expect(api.add).not.toHaveBeenCalled();

    await submitProduct('Lamp', '10', '-1');
    expect(api.add).not.toHaveBeenCalled();
  });

  it('accepte les bornes valides : nom de trois caractères, prix minimal et stock nul', async () => {
    await submitProduct('Lamp', '0.01', '0');

    expect(api.add).toHaveBeenCalledWith({ title: 'Lamp', price: 0.01, stock: 0 });
  });

});
