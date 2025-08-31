import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private base = 'http://localhost:5000';

  healt() {
    const url = `${this.base}/healthz`;
    // Si el endpoint retorna JSON, cambia responseType y el tipo
    return this.http.get(url, { responseType: 'text' });
  }
}
