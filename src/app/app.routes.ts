// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { environment } from '../environments/environment';

export const routes: Routes = [
  // Página pública con botón "Iniciar sesión"
  {
    path: '',
    loadComponent: () =>
      import('./shared/components/layout/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent,
      ),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      // Rutas de UI showcase (solo si está habilitado en environment)
      ...(environment.uiShowcase
        ? [
            {
              path: 'ui-showcase',
              data: { breadcrumb: 'UI Showcase', breadcrumbLink: false },
              children: [
                {
                  path: 'components',
                  data: { breadcrumb: 'components', breadcrumbLink: false },
                  children: [
                    {
                      path: 'text-input',
                      data: { breadcrumb: 'text-input' },
                      loadComponent: () =>
                        import('./ui-showcase/features/components/text-input/text-input-demo.component').then(
                          (m) => m.TextInputDemoComponent,
                        ),
                    },
                    {
                      path: 'number-input',
                      data: { breadcrumb: 'number-input' },
                      loadComponent: () =>
                        import('./ui-showcase/features/components/number-input/number-input-demo.component').then(
                          (m) => m.NumberInputDemoComponent,
                        ),
                    },
                    {
                      path: 'date-input',
                      data: { breadcrumb: 'date-input' },
                      loadComponent: () =>
                        import('./ui-showcase/features/components/date-input/date-input-demo.component').then(
                          (m) => m.DateInputDemoComponent,
                        ),
                    },
                    {
                      path: 'buttons',
                      data: { breadcrumb: 'buttons' },
                      loadComponent: () =>
                        import('./ui-showcase/features/components/buttons/buttons-demo.component').then(
                          (m) => m.ButtonsDemoComponent,
                        ),
                    },
                    {
                      path: 'select',
                      data: { breadcrumb: 'select' },
                      loadComponent: () =>
                        import('./ui-showcase/features/components/select/select-demo.component').then(
                          (m) => m.SelectDemoComponent,
                        ),
                    },
                    {
                      path: 'badge',
                      data: { breadcrumb: 'badge' },
                      loadComponent: () =>
                        import('./ui-showcase/features/components/badge/badge-demo.component').then(
                          (m) => m.BadgeDemoComponent,
                        ),
                    },
                    {
                      path: 'tooltip',
                      data: { breadcrumb: 'tooltip' },
                      loadComponent: () =>
                        import('./ui-showcase/features/components/tooltip/tooltip-demo.component').then(
                          (m) => m.TooltipDemoComponent,
                        ),
                    },
                    {
                      path: 'tabs',
                      data: { breadcrumb: 'tabs' },
                      loadComponent: () =>
                        import('./ui-showcase/features/components/tabs/tab-demo.component').then(
                          (m) => m.TabDemoComponent,
                        ),
                    },
                    {
                      path: 'modal',
                      data: { breadcrumb: 'modal' },
                      loadComponent: () =>
                        import('./ui-showcase/features/components/modal/modal-demo.component').then(
                          (m) => m.ModalDemoComponent,
                        ),
                    },
                    {
                      path: 'table',
                      data: { breadcrumb: 'table' },
                      loadComponent: () =>
                        import('./ui-showcase/features/components/table/table-demo.component').then(
                          (m) => m.TableDemoComponent,
                        ),
                    },
                  ],
                },
                {
                  path: 'forms',
                  data: { breadcrumb: 'forms', breadcrumbLink: false },
                  children: [
                    {
                      path: 'simple',
                      data: { breadcrumb: 'simple' },
                      loadComponent: () =>
                        import('./ui-showcase/features/forms/simple-form/simple-form.component').then(
                          (m) => m.SimpleFormComponent,
                        ),
                    },
                  ],
                },
              ],
            },
          ]
        : []),
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
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
          import('./features/auth/pages/error/error.component').then((m) => m.ErrorComponent),
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
