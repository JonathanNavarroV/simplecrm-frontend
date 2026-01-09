import { Component, signal, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ModalComponent,
  ModalButton,
} from '../../../../shared/components/ui/modal/modal.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { ModalHostComponent } from '../../../../shared/components/ui/modal/modal-host.component';
import { ModalStackService } from '../../../../core/services/modal-stack.service';

@Component({
  selector: 'app-modal-demo',
  standalone: true,
  imports: [CommonModule, ModalComponent, ButtonComponent, ModalHostComponent],
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

  // Templates para demo de modales anidados
  @ViewChild('parentTpl', { read: TemplateRef }) parentTpl!: TemplateRef<any>;
  @ViewChild('childTpl', { read: TemplateRef }) childTpl!: TemplateRef<any>;
  @ViewChild('grandTpl', { read: TemplateRef }) grandTpl!: TemplateRef<any>;

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

  // Demo: abrir modal padre que puede abrir un hijo
  openNested() {
    this.modalStack.open({
      title: 'Modal padre',
      template: this.parentTpl,
      buttons: [{ label: 'Cerrar', action: 'close', variant: 'secondary', size: 'sm' }],
    });
  }

  openChild() {
    this.modalStack.open({
      title: 'Modal hijo',
      template: this.childTpl,
      buttons: [
        { label: 'Volver', action: 'close', variant: 'secondary', size: 'sm' },
        { label: 'Aceptar', action: 'custom', event: 'child-ok', variant: 'primary', size: 'sm' },
      ],
    });
  }

  openGrandchild() {
    this.modalStack.open({
      title: 'Modal nieto',
      template: this.grandTpl,
      buttons: [
        { label: 'Volver', action: 'close', variant: 'secondary', size: 'sm' },
        { label: 'Aceptar', action: 'custom', event: 'grand-ok', variant: 'primary', size: 'sm' },
      ],
    });
  }

  onGrandAccept() {
    console.log('Acción en modal nieto');
    this.modalStack.back();
  }

  onChildAccept() {
    console.log('Acción en modal hijo');
    this.modalStack.back();
  }

  constructor(private modalStack: ModalStackService) {}
}
