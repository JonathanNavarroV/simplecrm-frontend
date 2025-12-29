import { Injectable } from '@angular/core';

type Closer = {
  htmlElement: HTMLElement; // Elemento que se debe vigilar
  onClose: () => void; // Función que se ejecuta al cerrar
  closeOnOutsideClick: boolean; // Cerrar si hago click fuera?
  closeOnEscape: boolean; // Cerrar si presiono el Escape?
};

@Injectable({
  providedIn: 'root',
})
export class CloseOnInteractService {
  private stack: Closer[] = []; // Pila de elementos registrados
  private listening = false; // Indica si hay listeners globales activos

  /**
   * Registra un elemento en la pila.
   *
   * Devuelve una función para desregistrarlo fácilmente.
   */
  public register(entry: Closer): () => void {
    this.stack.push(entry);
    this.ensureListeners();
    return () => this.unregister(entry);
  }

  /**
   * Quita un elemento de la pila.
   *
   * Si la lista de elementos queda vacía, se eliminan los listeners globales.
   */
  private unregister(entry: Closer) {
    const idx = this.stack.indexOf(entry);
    if (idx >= 0) this.stack.splice(idx, 1);
    if (this.stack.length === 0) this.teardownListeners();
  }

  /**
   * Crea los listeners globales si aún no están creados.
   *
   * Captura clicks y teclas a nivel de documento.
   */
  private ensureListeners() {
    if (this.listening) return;
    this.listening = true;
    // Usar pointerdown para detectar interacciones incluso sobre elementos disabled
    document.addEventListener('pointerdown', this.handleDocClick, true);
    document.addEventListener('keydown', this.handleKeyDown, true);
  }

  /** Elimina los listeners globales si no hay nada registrado. */
  private teardownListeners() {
    if (!this.listening) return;
    this.listening = false;
    document.removeEventListener('pointerdown', this.handleDocClick, true);
    document.removeEventListener('keydown', this.handleKeyDown, true);
  }

  /**
   * Maneja clicks en el documento.
   *
   * Si el click es fuera del elemento, lo cierra.
   *
   * Se recorre la pila al revés, para cerrar el último abierto primero.
   */
  private handleDocClick = (ev: MouseEvent) => {
    // Se recorre la pila en orden inverso. El último registrado se considera el que está "encima" (ej. un dropdown sobre otro).
    for (let i = this.stack.length - 1; i >= 0; i--) {
      const { htmlElement, onClose, closeOnOutsideClick } = this.stack[i];

      // Si el elemento no está configurado para cerrar en click externo, se salta
      if (!closeOnOutsideClick) continue;

      const target = ev.target as Node | null;

      // Si existe un target y NO está dentro del elemento registrado significa que el click fue fuera y debe cerrarse
      if (target && !htmlElement.contains(target)) {
        onClose(); // Dispara el cierre
        break; // Cierra solo el más reciente
      }
    }
  };

  /**
   * Maneja eventos del teclado.
   *
   * Si la tecla es Escape y el elemento está configurado, lo cierra.
   *
   * Se recorre la pila al revés, para cerrar el último abierto primero.
   */
  private handleKeyDown = (ev: KeyboardEvent) => {
    // Si no es la tecla Escape, salimos
    if (ev.key !== 'Escape') return;

    // Se recorre la pila en orden inverso. El último registrado se considera el que está "encima"
    for (let i = this.stack.length - 1; i >= 0; i--) {
      const { onClose, closeOnEscape } = this.stack[i];

      // Si este elemento está configurado para cerrarse con Escape
      if (closeOnEscape) {
        onClose(); // Dispara el cierre
        break; // Cierra solo el más reciente
      }
    }
  };
}
