import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-login-callback',
  imports: [],
  templateUrl: './login-callback.component.html',
  styleUrl: './login-callback.component.css',
})
export class LoginCallbackComponent implements OnInit {
  private readonly msalService = inject(MsalService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    // En este punto MSAL ya procesó la respuesta de Azure (token, información de usuario, etc...) y la guardó en su caché interna.

    // Se obtiene la lista de cuentas almacenadas en la caché de MSAL
    const account = this.msalService.instance.getAllAccounts()[0];

    if (account) {
      // Si existe una cuenta, se marca como "activa" en MSAL
      // Esto asegura que otras partes de la app sepan cuál usuario está logeado
      this.msalService.instance.setActiveAccount(account);

      // Se redirige al usuario al dashboard de la aplicación
      this.router.navigate(['/dashboard']);
    } else {
      // Si no se encuentra ninguna cuenta (algo falló en el login), se redirige a una página de error.
      this.router.navigate(['/login-failed']);
    }
  }
}
