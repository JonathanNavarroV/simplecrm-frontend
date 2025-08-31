// src/app/protected.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Component({
  standalone: true,
  selector: 'app-protected',
  imports: [CommonModule],
  template: `
    <section style="padding:1rem">
      <h2>Ruta protegida ✅</h2>
      <p *ngIf="username">
        Bienvenido, <b>{{ username }}</b>
      </p>
      <p>Si ves esto, el guard + login funcionan.</p>
    </section>
  `,
})
export class ProtectedComponent implements OnInit {
  private msal = inject(MsalService);
  username?: string;

  ngOnInit(): void {
    const acc = this.msal.instance.getActiveAccount() ?? this.msal.instance.getAllAccounts()[0];
    if (acc) {
      this.msal.instance.setActiveAccount(acc);
      this.username = (acc.name as string) ?? (acc.username as string);
    }
  }
}
