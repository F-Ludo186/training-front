import { Component, input, model, output } from '@angular/core';
import {
  FormValueControl,
  ValidationError,
  WithOptionalFieldTree,
} from '@angular/forms/signals';

@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.html',
  styleUrl: './text-field.css',
})
export class TextField implements FormValueControl<string | number> {
  readonly inputId = input.required<string>();
  readonly label = input.required<string>();
  readonly type = input<'text' | 'email' | 'password' | 'number'>('text');

  readonly value = model<string | number>('');
  readonly touched = input(false);
  readonly invalid = input(false);
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly required = input(false);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
  readonly touch = output<void>();

  protected updateValue(field: HTMLInputElement): void {
    this.value.set(this.type() === 'number' ? field.valueAsNumber : field.value);
  }
}