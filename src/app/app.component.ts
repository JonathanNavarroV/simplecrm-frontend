import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ApiService } from './core/api.service';
import { environment } from '../environment/environment';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private readonly apiService = inject(ApiService);

  loading = signal(false);
  result = signal<string>('(sin probar)');
  error = signal<string | null>(null);

  readonly baseUrl = environment.API_BASE_URL;
  readonly healthPath = '/healtz';

  testCors() {
    this.loading.set(true);
    this.error.set(null);
    this.apiService.healt().subscribe({
      next: (text) => {
        this.result.set(String(text));
        this.loading.set(false);
      },
      error: (err) => {
        // Mostramos mensaje legible; en consola verás detalles CORS si aplica
        this.error.set(err?.message ?? 'Error desconocido');
        this.loading.set(false);
      },
    });
  }
}
