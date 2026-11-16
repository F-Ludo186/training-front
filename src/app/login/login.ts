import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Credentials } from '../models/credentials';
import { form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';


@Component({
  imports: [ FormRoot, FormField ],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  credentials = signal<Credentials>({ username: '', password: '' });

  logginForm = form(
    this.credentials,
    (path) => {
      required(path.username, { message: 'Le nom d\'utilisateur est obligatoire.' });
      minLength(path.username, 3, { message: '3 caractères au moins.' });
      required(path.password, { message: 'Le mot de passe est obligatoire.' });
      minLength(path.password, 6, { message: '6 caractères au moins.' });
    },
    { submission: { action: async () => this.Loggin() } }, // lancée à l'envoi, si tout est valide
  );

  error = signal<string | null>(null); 
  LoggIn = signal<Credentials | null>(null);

  async Loggin(): Promise<void> {
    this.error.set(null); // on efface l'échec précédent
    try {
      await this.authService.login(this.credentials().username, this.credentials().password);
      this.LoggIn.set(this.credentials());
      this.router.navigateByUrl('/account');
      this.logginForm().reset();
    } catch {
      this.error.set("La connexion a échoué.\nIdentifiant ou mot de passe incorrect.");
    }
  }
}

