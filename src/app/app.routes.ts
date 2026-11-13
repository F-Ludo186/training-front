import { Routes } from '@angular/router';
import { Home } from './home/home';
import { NotFound } from './not-found/not-found';
import { ProductDetail } from './product-detail/product-detail';
import { Account } from './account/account';
import { Login } from './login/login';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'products/:id', component: ProductDetail },
  { path: 'account', component: Account, canActivate: [authGuard] },
  { path: 'login', component: Login },
  { path: 'products/:id', component: ProductDetail },
  { path: '**', component: NotFound }
];
