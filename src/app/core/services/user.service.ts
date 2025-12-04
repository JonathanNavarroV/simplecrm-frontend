import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  run: number;
  dv?: string;
  firstNames: string;
  lastNames: string;
  email: string;
  isActive: boolean;
  isDeleted: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  // Base URL del API configurado en `environment.azure.api.baseUrl`.
  // El gateway gestiona los prefixes (p. ej. `/crm`) y reenvía la petición
  // al servicio correspondiente. `api.baseUrl` apunta a `http://localhost:5000/api`.
  private readonly apiBase = environment.azure.api.baseUrl.replace(/\/$/, '');

  /** Obtiene un usuario por RUN. Autenticación: gestionada por MSAL + gateway. */
  getUserByRun(run: number): Observable<User> {
    const url = `${this.apiBase}/auth/users/${run}`;
    return this.http.get<User>(url);
  }
}
