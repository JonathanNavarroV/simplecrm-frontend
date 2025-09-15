import { isPlatformBrowser } from '@angular/common';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly msalService = inject(MsalService);

  // Flag para saber si estamos en navegador
  private isBrowser = true;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object // Token de Angular que indica dónde corre la app (browser o server)
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public login(): void {
    // Inicia el flujo de autenticación de Microsoft Entra ID (MSAL)
    this.msalService.loginRedirect({
      scopes: [...environment.azure.apis.crm.scopes],
      redirectUri: environment.azure.redirectUri,
    });
  }

  public logout(): void {
    // Si no es browser, no intentamos cerrar sesión.
    if (!this.isBrowser) return;

    // Se busca la cuenta activa de MSAL
    // Primero se intenta obtener la "active account" (la que MSAL tiene marcada como actual) y si no existe, se toma la primera de la lista de cuentas guardadas
    const account =
      this.msalService.instance.getActiveAccount() ?? this.msalService.instance.getAllAccounts()[0];

    // Se ejecuta el logout con redirección
    // Se pasa account (opcional) para asegurar que cierre la cuenta correcta si hay varias
    // Se pasa redirectUri para redirigir después de cerrar sesión
    this.msalService.logoutRedirect({
      account,
      postLogoutRedirectUri: environment.azure.redirectUri ?? '/',
    });
  }
}
