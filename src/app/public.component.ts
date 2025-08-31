// src/app/public.component.ts
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Component({
  standalone: true,
  selector: 'app-public',
  imports: [RouterLink],
  template: `
    <section style="padding:1rem">
      <h1>Front listo 👋</h1>
      <p>Esto es público. Puedes:</p>
      <ul>
        <li>
          <a routerLink="/protected">Ir a ruta protegida</a> (dispara login si no tienes sesión)
        </li>
        <li><a routerLink="/claims">Ver tus claims</a> (útil tras iniciar sesión)</li>
      </ul>

      <div style="margin-top:1rem; display:flex; gap:.5rem">
        <button (click)="login()">Iniciar sesión</button>
        <button (click)="logout()">Cerrar sesión</button>
      </div>
    </section>
  `,
})
export class PublicComponent {
  private msal = inject(MsalService);

  login() {
    this.msal.loginRedirect(); // pide los scopes definidos en tu MSALGuardConfig
  }

  logout() {
    this.msal.logoutRedirect();
  }
}
