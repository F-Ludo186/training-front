import { Component, signal, inject } from '@angular/core';
import { FormField, FormRoot, form, min, minLength, required, validate } from '@angular/forms/signals';
import { JsonPipe } from '@angular/common';
import { ProductApiService } from '../product-api.service';
import { Product } from '../models/product.model';
import { FORM_CONTROLS } from '../shared/ui/form-controls';

@Component({
  imports: [FormField, FormRoot, JsonPipe, ...FORM_CONTROLS],
  selector: 'app-product-form',
  styleUrl: './product-form.css',
  templateUrl: './product-form.html',
})

export class ProductForm {
  private readonly productApi = inject(ProductApiService);

  product = signal({ title: '', price: 0,stock: 0 });

  productForm = form(
    this.product,
    (path) => {
      required(path.title, { message: 'Le nom est obligatoire.' });
      minLength(path.title, 3, { message: '3 caractères au moins.' });
      validate(path.title, ({ value }) =>
        value().trim().length === 0 ? { kind: 'blank', message: 'Le nom ne peut pas être composé uniquement d’espaces.' } : undefined,
      );
      required(path.price, { message: 'Le prix est obligatoire.' });
      min(path.price, 0.01, { message: 'Le prix doit dépasser 0 €.' });
      required(path.stock, { message: 'Le stock est obligatoire.' });
      min(path.stock, 0, { message: 'Le stock ne peut pas être négatif.' });
      validate(path.stock, ({ value }) =>
        Number.isInteger(value()) ? undefined : { kind: 'wholeNumber', message: 'Un nombre entier, sans virgule.' },
      );
    },
    { submission: { action: async () => this.send() } }, // lancée à l'envoi, si tout est valide
  );

  error = signal<string | null>(null); 
  created = signal<Product | null>(null);

  async send(): Promise<void> {
    this.error.set(null); // on efface l'échec précédent
    try {
      this.created.set(await this.productApi.add(this.product())); // le modèle, c'est déjà le corps du POST
      this.product.set({ title: '', price: 0, stock: 0 });
      this.productForm().reset();
    } catch {
      this.error.set("L'envoi a échoué. Réessaie dans un instant.");
    }
  }
  
}
