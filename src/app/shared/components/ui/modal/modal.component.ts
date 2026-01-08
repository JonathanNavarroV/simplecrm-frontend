import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

export interface ModalButton {
  /** Texto del botón */
  label: string;
  /** Variante admitida por `app-button` */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Tamaño admitido por `app-button` */
  size?: 'sm' | 'md';
  /** Icono opcional */
  icon?: string;
  /** Acción semántica manejada por `ModalComponent` */
  action?: 'close' | 'confirm' | 'custom';
  /** Nombre del evento si `action` es `custom` */
  event?: string;
}

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  @Input() title = 'Modal';
  /** Mostrar botón de retroceso (volver al modal padre) */
  @Input() showBack = false;
  @Output() back = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();
  @Output() action = new EventEmitter<string>();

  @Input()
  buttons?: ModalButton[];

  close() {
    this.closed.emit();
  }

  confirm() {
    this.confirmed.emit();
    this.closed.emit();
  }

  handleButton(btn: any) {
    const act = btn?.action || btn?.event || 'custom';
    if (act === 'close') {
      this.close();
      return;
    }

    if (act === 'confirm') {
      this.confirm();
      return;
    }

    // custom action: emit event name (or label)
    this.action.emit(btn?.event || btn?.label || 'custom');
  }
}
