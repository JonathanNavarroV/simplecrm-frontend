import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { BreadcrumbItem } from '../../shared/components/layout/header-controls/breadcrumbs/breadcrumb-item.interface';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  // Mantiene el "estado actual" de los breadcrumbs (inicia vacío `[]`)
  private readonly _items = signal<BreadcrumbItem[]>([]);

  // Se expone una señal de solo lectura para que consumidores puedan leer el estado sin mutarlo
  readonly items = this._items.asReadonly();
  // Observable para compatibilidad con templates que usan `| async` y consumidores RxJS
  readonly items$ = toObservable(this._items);

  // Flag para saber si los breadcrumbs fueron configurados manualmente
  private manualOverride = false;

  // Reemplaza todo el array de breadcrumbs con uno nuevo.
  public set(items: BreadcrumbItem[], manual = true): void {
    this.manualOverride = manual; // Se guarda el origen de la acción
    this._items.set(items);
  }

  // Actualiza parcialmente un breadcrumb en una posición específica (index).
  public patch(index: number, partial: Partial<BreadcrumbItem>): void {
    this._items.update((prev) => prev.map((it, i) => (i === index ? { ...it, ...partial } : it)));
    this.manualOverride = true; // El cambio se considera manual
  }

  // Limpia todo
  public reset(): void {
    this.manualOverride = false;
    this._items.set([]);
  }

  // Método que ayuda a consultar desde afuera si el breadcrumb es manual o automático
  public isManual() {
    return this.manualOverride;
  }
}
