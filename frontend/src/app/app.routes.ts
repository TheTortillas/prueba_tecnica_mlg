import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'articulos',
    loadComponent: () =>
      import('./components/articulos/articulos.component').then(
        (m) => m.ArticulosComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'carrito',
    loadComponent: () =>
      import('./components/carrito/carrito.component').then(
        (m) => m.CarritoComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'tiendas',
    loadComponent: () =>
      import('./components/tiendas/tiendas.component').then(
        (m) => m.TiendasComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'mis-compras',
    loadComponent: () =>
      import('./components/mis-compras/mis-compras.component').then(
        (m) => m.MisComprasComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'clientes',
    loadComponent: () =>
      import('./components/clientes/clientes.component').then(
        (m) => m.ClientesComponent
      ),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/login' },
];
