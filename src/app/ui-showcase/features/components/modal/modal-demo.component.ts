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

  open(type: string) {
    this.isOpen.set(type);
  }

  close() {
    this.isOpen.set(null);
  }

  onConfirm() {
    this.lastConfirmed = true;
    this.close();
  }

  onAction(ev: string) {
    // ejemplo: registrar o mapear acciones custom
    console.log('Modal action:', ev);
  }
}
