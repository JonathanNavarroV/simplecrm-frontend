// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Página pública con botón "Iniciar sesión"
  {
    path: '',
    loadComponent: () =>
      import('./shared/components/layout/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
    ],
  },
  // Ruta de error de autenticación
  {
    path: 'auth',
    children: [
      {
        path: 'error',
        loadComponent: () =>
          import('./features/auth/pages/error/error.component').then(
            (m) => m.ErrorComponent
          ),
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
