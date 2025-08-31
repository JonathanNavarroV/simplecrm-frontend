import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private base = environment.API_BASE_URL;

  healt() {
    const url = `${this.base}/healthz`;
    // Si el endpoint retorna JSON, cambia responseType y el tipo
    return this.http.get(url, { responseType: 'text' });
  }
}
