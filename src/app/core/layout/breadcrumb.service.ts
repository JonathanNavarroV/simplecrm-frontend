import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BreadcrumbItem } from '../../shared/components/layout/header-controls/breadcrumbs/breadcrumb-item.interface';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  // Mantiene el "estado actual" de los breadcrumbs (inicia vacío `[]`)
  private readonly _items = new BehaviorSubject<BreadcrumbItem[]>([]);

  // Se expone un Observable "solo lectura" ($items) para que otros se suscriban sin poder hacer next()
  readonly items$ = this._items.asObservable();

  // Flag para saber si los breadcrumbs fueron configurados manualmente
  private manualOverride = false;

  // Reemplaza todo el array de breadcrumbs con uno nuevo.
  public set(items: BreadcrumbItem[], manual = true): void {
    this.manualOverride = manual; // Se guarda el origen de la acción
    this._items.next(items); // Se notifica a todos los suscriptores el nuevo estado
  }

  // Actualiza parcialmente un breadcrumb en una posición específica (index).
  public patch(index: number, partial: Partial<BreadcrumbItem>): void {
    const next = this._items.value.map((it, i) => (i === index ? { ...it, ...partial } : it));
    this.manualOverride = true; // El cambio se considera manual
    this._items.next(next); // Se notifica a los suscriptores el nuevo array
  }

  // Limpia todo
  public reset(): void {
    this.manualOverride = false;
    this._items.next([]);
  }

  // Método que ayuda a consultar desde afuera si el breadcrumb es manual o automático
  public isManual() {
    return this.manualOverride;
  }
}
