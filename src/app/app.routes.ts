import { Routes } from '@angular/router';
import { Home } from './home/home';
import { NotFound } from './not-found/not-found';
import { ProductDetail } from './product-detail/product-detail';
import { Account } from './account/account';
import { Login } from './login/login';
import { authGuard } from './auth-guard';
import { ProductForm } from './product-form/product-form';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'products/new', component: ProductForm ,canActivate: [authGuard] },
  { path: 'products/:id', component: ProductDetail,canActivate: [authGuard]  },
  { path: 'login', component: Login },
  { path: 'account', component: Account, canActivate: [authGuard] },
  { path: '**', component: NotFound }
];
