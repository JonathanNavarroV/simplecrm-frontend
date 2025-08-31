// src/app/claims.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Component({
  standalone: true,
  selector: 'app-claims',
  imports: [CommonModule],
  template: `
    <section style="padding:1rem">
      <h2>Claims del usuario</h2>
      <ng-container *ngIf="claims; else noLogin">
        <pre>{{ claims }}</pre>
      </ng-container>
      <ng-template #noLogin>
        <p>No hay sesión activa. Inicia sesión desde la página principal.</p>
      </ng-template>
    </section>
  `,
})
export class ClaimsComponent implements OnInit {
  private msal = inject(MsalService);
  claims?: Record<string, unknown>;

  ngOnInit(): void {
    const acc = this.msal.instance.getActiveAccount() ?? this.msal.instance.getAllAccounts()[0];
    if (acc) {
      this.msal.instance.setActiveAccount(acc);
      this.claims = acc.idTokenClaims as Record<string, unknown>;
    }
  }
}
