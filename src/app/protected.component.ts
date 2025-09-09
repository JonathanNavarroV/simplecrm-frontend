// src/app/protected.component.ts
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { environment } from '../environments/environment';

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

      <div style="display:flex; gap:.5rem; margin:.75rem 0">
        <button (click)="ping()">Probar /healthz (con token)</button>
        <button (click)="logout()">Cerrar sesión</button>
      </div>

      <pre *ngIf="resp">{{ resp | json }}</pre>
      <p *ngIf="error" style="color:#c00">{{ error }}</p>
    </section>
  `,
})
export class ProtectedComponent implements OnInit {
  private http = inject(HttpClient);
  private msal = inject(MsalService);

  username?: string;
  resp?: unknown;
  error?: string;

  ngOnInit(): void {
    const acc = this.msal.instance.getActiveAccount() ?? this.msal.instance.getAllAccounts()[0];
    if (acc) {
      this.msal.instance.setActiveAccount(acc);
      this.username = (acc.name as string) ?? (acc.username as string);
    }
  }

  ping(): void {
    const url = `${environment.azure.apis.crm.baseUrl}/healthz`;
    this.http.get(url).subscribe({
      next: (r) => {
        this.resp = r;
        this.error = undefined;
      },
      error: (e) => {
        this.error = e?.message ?? 'Error llamando /healthz';
        this.resp = undefined;
      },
    });
  }

  logout(): void {
    this.msal.logoutRedirect();
  }
}
