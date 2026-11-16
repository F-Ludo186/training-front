import { Component,input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-async-state',
  styleUrl: './async-state.css',
  templateUrl: './async-state.html',
})
export class AsyncState {
  loading = input.required<boolean>();
  error = input<string | null>(null);
  loadingText = input('Chargement…');
}
