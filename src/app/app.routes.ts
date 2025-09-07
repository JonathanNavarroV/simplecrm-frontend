// src/app/app.routes.ts
import { Routes } from '@angular/router';

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
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
    ],
  },

  {
    path: 'example',
    loadComponent: () => import('./example/example.component').then((m) => m.ExampleComponent),
  },

  { path: '**', redirectTo: '' },
];
