import { CommonModule } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalComponent } from './modal.component';
import { ModalStackService, ModalStackItem } from '../../../../core/services/modal-stack.service';

@Component({
  selector: 'app-modal-host',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './modal-host.component.html',
})
export class ModalHostComponent {
  current$: Observable<ModalStackItem | null>;
  stack$: Observable<ModalStackItem[]>;

  constructor(public modalStack: ModalStackService) {
    this.current$ = this.modalStack.current$;
    this.stack$ = this.modalStack.stack$;
  }

  handleAction(ev: string) {
    console.log('ModalHost acción recibida:', ev);
    this.modalStack.back();
  }
}
