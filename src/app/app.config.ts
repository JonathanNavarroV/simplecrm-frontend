import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MsalBroadcastService,
  MsalGuard,
  MsalInterceptor,
  MsalInterceptorConfiguration,
  MsalService
} from '@azure/msal-angular';
import {
  BrowserCacheLocation,
  InteractionType,
  IPublicClientApplication,
  LogLevel,
  PublicClientApplication,
} from '@azure/msal-browser';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

/** Callback opcional de logging para MSAL. */
export function loggerCallback(logLevel: LogLevel, message: string) {
  // console.log(logLevel, message);
}

/** Instancia principal de MSAL. */
export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.azure.spaClientId, // ID de la SPA registrada en Entra
      authority: environment.azure.authority, // URL del tenant
      redirectUri: environment.azure.postLogoutRedirectUri, // A dónde volver después de login
      postLogoutRedirectUri: environment.azure.postLogoutRedirectUri, // A dónde volver después de logout
    },
    cache: {
      cacheLocation: BrowserCacheLocation.SessionStorage, // Dónde guardar tokens
    },
    system: {
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Info, // Nivel de logging de MSAL
        piiLoggingEnabled: false, // Nunca logear datos sensibles
      },
    },
  });
}

/**
 * Configuración del Interceptor HTTP de MSAL.
 *
 * Este se encargará de añadir automáticamente el header "Authorization: Bearer <token>" cuando hagas peticiones a URLs incluidas en protectedResourceMap.
 */
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();

  // CRM API (gateway -> backend)
  protectedResourceMap.set(environment.azure.apis.crm.baseUrl, environment.azure.apis.crm.scopes);

  return {
    interactionType: InteractionType.Redirect, // Tipo de login usado (Redirect o Popup)
    protectedResourceMap,
  };
}

/** Configuración global de Angular. */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // HttpClient con soporte de interceptores (incluye MsalInterceptor)
    provideHttpClient(withInterceptorsFromDi(), withFetch()),

    // Interceptor de MSAL (adjunta tokens a peticiones protegidas)
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },

    // Inyección de configuraciones de MSAL
    { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory },
    { provide: MSAL_INTERCEPTOR_CONFIG, useFactory: MSALInterceptorConfigFactory },

    // Servicios principales de MSAL
    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ],
};
