import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/user.model';
import { AuthService } from '../auth.service';
import { AsyncState } from '../async-state/async-state';

@Component({
  imports: [AsyncState],
  selector: 'app-account',
  styleUrl: './account.css',
  templateUrl: './account.html',
})
export class Account {
  private readonly auth = inject(AuthService);
  readonly user = signal<User | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    try {
      this.user.set(await this.auth.me());
    } catch (error: unknown) {
      this.error.set(
        error instanceof HttpErrorResponse && error.status === 401
          ? 'Ta session a expiré. Reconnecte-toi pour accéder à ton compte.'
          : 'Impossible de charger les informations du compte. Réessaie dans un instant.',
      );
    } finally {
      this.loading.set(false);
    }
  }
}
