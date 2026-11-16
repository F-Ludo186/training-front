import { Component, inject, signal } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from '../auth.service';

@Component({
  imports: [],
  selector: 'app-account',
  styleUrl: './account.css',
  templateUrl: './account.html',
})
export class Account {
  private readonly auth = inject(AuthService);
  user = signal<User | null>(null);
  
  async ngOnInit(): Promise<void> {
    this.user.set(await this.auth.me()); // GET /auth/me
  }
}
