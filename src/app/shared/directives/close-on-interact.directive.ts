import {
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CloseOnInteractService } from '../../core/layout/close-on-interact.service';

@Directive({
  selector: '[appCloseOnInteract]',
  standalone: true,
})
export class CloseOnInteractDirective implements OnChanges, OnDestroy {
  // Referencia al elemento host
  private readonly hostElement = inject(ElementRef<HTMLElement>);
  // Servicio para gestionar los listeners globales
  private readonly closeOnInteractService = inject(CloseOnInteractService);

  // Indica si el elemento está abierto y debe estar escuchando interacciones
  @Input() appCloseOnInteract = false;

  // Configura si debe cerrarse al hacer click fuera del elemento
  @Input() closeOnOutsideClick = true;

  // Configura si debe cerrarse al presionar Escape
  @Input() closeOnEscape = true;

  // Evento que se emite cuando se solicita cerrar
  @Output() requestClose = new EventEmitter<void>();

  // Función que permite cancelar el registro de listener
  private unregister?: () => void;

  ngOnChanges(changes: SimpleChanges): void {
    // Si se cambia el estado de "abierto/cerrado", se actualiza el registro
    if (changes['appCloseOnInteract']) this.updateRegistration();
  }

  private updateRegistration(): void {
    // Limpia cualquier registro previo
    if (this.unregister) {
      this.unregister();
      this.unregister = undefined;
    }

    // Solo registra listeners si el elemento está "abierto"
    if (this.appCloseOnInteract) {
      this.unregister = this.closeOnInteractService.register({
        htmlElement: this.hostElement.nativeElement, // Elemento a vigilar
        onClose: () => this.requestClose.emit(), // Acción al cerrar
        closeOnOutsideClick: this.closeOnOutsideClick,
        closeOnEscape: this.closeOnEscape,
      });
    }
  }

  ngOnDestroy(): void {
    // Se liberan los listeners al destruir la directiva
    if (this.unregister) this.unregister();
  }
}
