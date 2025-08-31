// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { MsalGuard, MsalRedirectComponent } from '@azure/msal-angular';
import { ClaimsComponent } from './claims.component';
import { ProtectedComponent } from './protected.component';
import { PublicComponent } from './public.component';

export const routes: Routes = [
  { path: 'login-callback', component: MsalRedirectComponent },

  // Página pública con botón "Iniciar sesión"
  { path: '', component: PublicComponent },

  // Vista simple para ver claims del usuario (requiere login para tener data útil)
  { path: 'claims', component: ClaimsComponent },

  // Ruta protegida por guard (si no hay sesión, MSAL redirige a Microsoft)
  { path: 'protected', component: ProtectedComponent, canActivate: [MsalGuard] },

  { path: '**', redirectTo: '' },
];
