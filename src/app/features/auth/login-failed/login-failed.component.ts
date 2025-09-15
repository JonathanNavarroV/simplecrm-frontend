import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-login-failed',
  imports: [],
  templateUrl: './login-failed.component.html',
  styleUrl: './login-failed.component.css',
})
export class LoginFailedComponent {
  private readonly msal = inject(MsalService);
  private readonly router = inject(Router);

  protected retryLogin(): void {
    // Inicia el flujo de login
    this.msal.loginRedirect();
  }

  protected goHome(): void {
    this.router.navigate(['/']);
  }
}
