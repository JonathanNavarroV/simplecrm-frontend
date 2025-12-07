import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom, of } from 'rxjs';
import { ApiPaths } from '../config/api-paths';
import { catchError, tap, finalize, shareReplay } from 'rxjs/operators';
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

  // Rutas centralizadas para APIs (definidas en `ApiPaths`).
  // `ApiPaths.apiBase` apunta a `http://localhost:5000/api` y `ApiPaths.users` a `.../auth/users`.
  private readonly usersBase = ApiPaths.users;

  // Subject en memoria que guarda el perfil del usuario actual (o null si no hay sesión)
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  // Observable en vuelo para /me. Cuando existe, consumidores comparten la misma petición.
  private inFlightProfile$: Observable<User | null> | null = null;

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
    const url = `${this.usersBase}/${run}`;
    return this.http.get<User>(url);
  }

  /**
   * Devuelve un observable compartido con el perfil actual. Si ya está cargado
   * en memoria devuelve `of(current)`. Si hay una petición en vuelo, devuelve
   * el observable en vuelo para coalescer llamadas.
   */
  public getProfile(): Observable<User | null> {
    const url = `${this.usersBase}/me`;

    if (this.userSubject.value) return of(this.userSubject.value);

    if (!this.inFlightProfile$) {
      this.inFlightProfile$ = this.http.get<User>(url).pipe(
        tap((u) => this.userSubject.next(u)),
        catchError((_) => {
          this.userSubject.next(null);
          return of(null as User | null);
        }),
        finalize(() => {
          this.inFlightProfile$ = null;
        }),
        shareReplay(1),
      );
    }

    return this.inFlightProfile$;
  }

  /**
   * Carga el perfil del usuario autenticado desde el endpoint /auth/users/me
   * y lo guarda en memoria (userSubject). Devuelve el usuario o null si no
   * está autenticado o ocurre un error.
   */
  public async loadProfile(): Promise<User | null> {
    try {
      const user = await firstValueFrom(this.getProfile());
      return user;
    } catch (err) {
      this.userSubject.next(null);
      return null;
    }
  }
}
