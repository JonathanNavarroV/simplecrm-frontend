import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, firstValueFrom } from 'rxjs';
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

  // Subject en memoria que guarda el perfil del usuario actual (o null si no hay sesión)
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  /** Getter síncrono del usuario actual (valor en memoria). */
  public get currentUser(): User | null {
    return this.userSubject.value;
  }

  /** Establece manualmente el usuario en memoria (útil si el login devuelve el perfil). */
  public setUser(user: User | null) {
    this.userSubject.next(user);
  }

  /** Limpia el usuario en memoria (logout local). */
  public clear() {
    this.userSubject.next(null);
  }

  /** Obtiene un usuario por RUN. Autenticación: gestionada por MSAL + gateway. */
  getUserByRun(run: number): Observable<User> {
    const url = `${this.apiBase}/auth/users/${run}`;
    return this.http.get<User>(url);
  }

  /**
   * Carga el perfil del usuario autenticado desde el endpoint /auth/users/me
   * y lo guarda en memoria (userSubject). Devuelve el usuario o null si no
   * está autenticado o ocurre un error.
   */
  public async loadProfile(): Promise<User | null> {
    const url = `${this.apiBase}/auth/users/me`;
    try {
      const user = await firstValueFrom(this.http.get<User>(url));
      this.userSubject.next(user);
      return user;
    } catch (err) {
      // En caso de error (401, 404, etc.) dejamos el estado en null
      this.userSubject.next(null);
      return null;
    }
  }
}
