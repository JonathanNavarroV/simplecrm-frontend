import { isPlatformBrowser } from '@angular/common';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private readonly authService = inject(AuthService);
  private readonly msalService = inject(MsalService);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /**
   * Guard de autenticación para rutas protegidas.
   *
   * - En SSR (server-side rendering / prerender) permite siempre la navegación.
   * - En cliente (browser) inicializa MSAL y valida si existe una sesión activa.
   * - Si hay cuentas en caché, deja pasar.
   * - Si hay una interacción en curso (`interaction_in_progress`), procesa el redirect
   *   y fija la cuenta activa si corresponde.
   * - Si después del redirect hay cuentas, deja pasar; si no, relanza login.
   * - Si no hay sesión ni interacción, dispara loginRedirect.
   *
   * @returns {boolean | Promise<boolean>} `true` si la navegación se permite,
   * `false` si se corta para iniciar login, o una `Promise` que resuelve a `true|false`
   * dependiendo del resultado de `handleRedirectPromise`.
   */
  public canActivate(): boolean | Promise<boolean> {
    // Si estamos en server (SSR/prerender), no se bloquea
    if (!this.isBrowser) {
      return true;
    }

    // Se inicializa MSAL, si ya está inicializado, se resuelve instantaneamente
    return this.msalService.instance
      .initialize()
      .then(async () => {
        // Si ya hay cuentas en caché (usuario logeado), validar que exista en DB
        if (this.authService.isLoggedIn()) {
          // Si ya lo tenemos en memoria, no necesitamos llamar al endpoint
          if (this.userService.currentUser) return true;

          const user = await this.userService.loadProfile();
          if (!user) {
            // Usuario no existe en DB -> redirigir a página de error
            this.router.navigate(['/auth/error']);
            return false;
          }
          return true;
        }

        // Si MSAL dejó m,arcado que hay un redirect en progreso
        const inProgress = sessionStorage.getItem('msal.interaction.status');
        if (inProgress) {
          try {
            // Se procesa el resultado del redirect
            const result: AuthenticationResult | null =
              await this.msalService.instance.handleRedirectPromise();

            // Si viene una cuenta en el result, se fija como activa
            if (result?.account) {
              this.msalService.instance.setActiveAccount(result.account);
            }

            // Ahora si se tiene una cuenta caché, entonces validamos existencia en DB
            const hasAccount = !!(
              this.msalService.instance.getActiveAccount() ??
              this.msalService.instance.getAllAccounts()[0]
            );
            if (hasAccount) {
              if (this.userService.currentUser) return true;

              const user = await this.userService.loadProfile();
              if (!user) {
                this.router.navigate(['/auth/error']);
                return false;
              }
              return true;
            }

            // Si aún no hay cuenta, relanzar el login
            this.authService.login();
            return false;
          } catch (err) {
            // Si hubo error al procesar el redirect, se relanza el login
            console.error('[AuthGuard] Error en handleRedirectPromise:', err);
            this.authService.login();
            return false;
          }
        }

        // Si no hay sesión ni interacción, iniciar login
        this.authService.login();
        return false;
      })
      .catch((err) => {
        // Si falla el initialize, iniciar login
        console.error('[AuthGuard] Error inicializando MSAL en guard:', err);
        this.authService.login();
        return false;
      });
  }
}
