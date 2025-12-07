import { inject, Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { environment } from '../../../environments/environment';
// HttpClient no es necesario aquí; exchange lo maneja el gateway.

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly msalService = inject(MsalService);

  // Flag para saber si estamos en navegador
  private isBrowser = true;

  /**
   * Verifica si hay alguna sesión activa en la caché de MSAL.
   *
   * @returns {boolean} `true` si existe al menos una cuenta en caché,
   * `false` si no hay sesión iniciada.
   */
  isLoggedIn(): boolean {
    // Se solicitan todas las cuentas almacenadas en caché
    const accounts = this.msalService.instance.getAllAccounts();
    // Se devuelve true si el array existe y tienme al menos un elemento
    return accounts && accounts.length > 0;
  }

  /**
   * Inicia el flujo de autenticación (login) contra Azure Entra ID usando redirect.
   *
   * - Ignora la llamada si no estamos en navegador.
   * - Evita relanzar si MSAL ya tiene una interacción en curso
   *   (`interaction_in_progress`) o si ya hay una sesión iniciada.
   * - Inicializa MSAL (si aún no lo está).
   * - Si no hay cuentas tras inicializar, ejecuta `loginRedirect`
   *   con los scopes configurados en `environment`.
   *
   * @returns {void}
   */
  public login(): void {
    // Si no es browser, no intentamos iniciar sesión.
    if (!this.isBrowser) return;

    // Evita relanzar si MSAL ya está en interacción o si ya hay sesión
    const inProgress = sessionStorage.getItem('msal.interaction.status');
    if (inProgress) {
      console.log('[AuthService] login() omitido: interaction_in_progress');
      return;
    }
    if (this.isLoggedIn()) {
      console.log('[AuthService] login() omitido: ya hay sesión');
      return;
    }

    // Inicializa MSAL (si ya está inicializado, resuelve inmediato)
    this.msalService.instance
      .initialize()
      .then(() => {
        // Si ya hay sesión, no relanzar login
        if (this.isLoggedIn()) return;

        // Lanza redirect (redirectUri ya está configurado en la instancia '/')
        this.msalService.instance.loginRedirect({
          scopes: [...environment.azure.api.scopes],
          prompt: 'select_account',
        });
      })
      .catch((err) => {
        console.error('[AuthService] initialize/loginRedirect error:', err);
      });
  }

  /**
   * Cierra la sesión actual del usuario.
   *
   * - Ignora la llamada si no estamos en navegador.
   * - Obtiene la cuenta activa de MSAL, o en su defecto la primera cuenta en caché.
   * - Ejecuta `logoutRedirect` para cerrar sesión en Azure Entra ID.
   * - Redirige al usuario a la URL configurada en `postLogoutRedirectUri`.
   *
   * @returns {void}
   */
  public logout(): void {
    // Si no es browser, no intentamos cerrar sesión.
    if (!this.isBrowser) return;

    // Se busca la cuenta activa de MSAL
    // Primero se intenta obtener la "active account" (la que MSAL tiene marcada como actual) y si no existe, se toma la primera de la lista de cuentas guardadas
    const account =
      this.msalService.instance.getActiveAccount() ?? this.msalService.instance.getAllAccounts()[0];

    // Se captura el usuario sugerido
    const logoutHint =
      account.idTokenClaims?.preferred_username ||
      account.idTokenClaims?.login_hint ||
      account.idTokenClaims?.sid;

    // Se ejecuta el logout con redirección
    // Se pasa account (opcional) para asegurar que cierre la cuenta correcta si hay varias
    // Se pasa redirectUri para redirigir después de cerrar sesión (redirectUri ya está configurado en la instancia '/')
    this.msalService.logoutRedirect({
      account,
      logoutHint,
    });
  }
}
