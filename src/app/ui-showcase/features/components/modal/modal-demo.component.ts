import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ModalComponent,
  ModalButton,
} from '../../../../shared/components/ui/modal/modal.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-modal-demo',
  standalone: true,
  imports: [CommonModule, ModalComponent, ButtonComponent],
  templateUrl: './modal-demo.component.html',
  styleUrls: ['./modal-demo.component.css'],
})
export class ModalDemoComponent {
  isOpen = signal<string | null>(null);
  lastConfirmed = false;

  simpleButtons: ModalButton[] = [
    { label: 'Cerrar', action: 'close', variant: 'secondary', size: 'sm' },
  ];

  confirmButtons: ModalButton[] = [
    { label: 'Cancelar', action: 'close', variant: 'secondary', size: 'sm' },
    { label: 'Confirmar', action: 'confirm', variant: 'primary', size: 'sm' },
  ];

  // Ejemplo: Confirmación de eliminación (acción custom 'delete')
  deleteButtons: ModalButton[] = [
    { label: 'Cancelar', action: 'close', variant: 'secondary', size: 'sm' },
    { label: 'Eliminar', action: 'custom', event: 'delete', variant: 'danger', size: 'sm' },
  ];

  // Ejemplo: Alerta informativa con un solo botón
  infoButtons: ModalButton[] = [
    { label: 'Aceptar', action: 'custom', event: 'info-ok', variant: 'primary', size: 'sm' },
  ];

  open(type: string) {
    this.isOpen.set(type);
  }

  close() {
    this.isOpen.set(null);
  }

  onConfirm() {
    this.lastConfirmed = true;
    // Registramos en consola en lugar de guardar en una propiedad para mostrar en plantilla
    console.log('Modal confirmado');
    this.close();
  }

  onAction(ev: string) {
    // manejar acciones custom del modal y registrar en consola
    if (ev === 'delete') {
      console.log('Modal acción: eliminado');
      this.close();
      return;
    }

    if (ev === 'info-ok') {
      console.log('Modal acción: informativo reconocido');
      this.close();
      return;
    }

    // fallback
    console.log('Modal acción:', ev);
  }
}
